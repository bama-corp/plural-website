import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (name.trim() && email.trim() && location.trim()) {
      setIsSubmitting(true);

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSubmit({ name, email, location });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setName('');
        setEmail('');
        setLocation('');
        setIsSuccess(false);
        onClose();
      }, 2000);
    }
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
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Digite seu e-mail"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Localização
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full border border-gray-800 rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm sm:text-base bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Cidade/Estado"
                  />
                </div>
              </div>

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
