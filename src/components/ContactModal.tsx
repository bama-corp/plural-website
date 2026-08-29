import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import HoneypotField from './HoneypotField';
import {
  canSubmitForm,
  isHoneypotFilled,
  isValidEmail,
  markFormSubmitted,
  sanitizeText,
} from '../utils/formGuard';

interface ContactModalProps {
  isOpen: boolean;
  title?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; location: string }) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  title = 'Preencha seus dados',
  submitLabel = 'Enviar',
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const finish = () => {
    setIsSubmitting(false);
    setIsSuccess(true);
    window.setTimeout(() => {
      setName('');
      setEmail('');
      setLocation('');
      setHoneypot('');
      setIsSuccess(false);
      setError('');
      onClose();
    }, 2000);
  };

  const handleSubmit = async () => {
    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeText(email, 254);
    const cleanLocation = sanitizeText(location, 80);

    if (!cleanName || !isValidEmail(cleanEmail) || !cleanLocation) {
      setError('Confirma o nome, um e-mail válido e a localização.');
      return;
    }
    if (!canSubmitForm()) {
      setError('Espera uns segundos e tenta de novo.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    if (isHoneypotFilled(honeypot)) {
      finish();
      return;
    }

    markFormSubmitted();
    onSubmit({ name: cleanName, email: cleanEmail, location: cleanLocation });
    finish();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative bg-gray-900 rounded shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="bg-white p-4 sm:p-6 text-black relative">
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full hover:bg-black/10 transition-colors duration-300"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold pr-8 sm:pr-10">
                {title}
              </h3>
              <p className="text-black/60 mt-2 text-sm sm:text-base">
                Preencha os dados abaixo para continuarmos
              </p>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="relative space-y-3 sm:space-y-4">
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    maxLength={80}
                    autoComplete="name"
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="O teu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    maxLength={254}
                    autoComplete="email"
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="O teu e-mail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Localização
                  </label>
                  <input
                    type="text"
                    value={location}
                    maxLength={80}
                    autoComplete="address-level2"
                    onChange={e => setLocation(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Cidade"
                  />
                </div>
              </div>
              {error ? (
                <p className="text-sm text-white/70">{error}</p>
              ) : null}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  isSuccess ||
                  !name.trim() ||
                  !email.trim() ||
                  !location.trim()
                }
                className={`w-full font-semibold py-3 px-6 rounded transition-all duration-300 transform text-sm sm:text-base flex items-center justify-center space-x-2 ${
                  isSuccess
                    ? 'bg-green-500 text-white'
                    : isSubmitting
                    ? 'bg-gray-600 text-white cursor-not-allowed transform-none'
                    : 'bg-white hover:bg-neutral-200 disabled:bg-neutral-700 text-black hover:scale-105 disabled:transform-none disabled:cursor-not-allowed'
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Enviado!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{submitLabel}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
