import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';

const WhatsAppFloat = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickMessages = [
    'Olá! Gostaria de saber mais sobre os planos da Plural!',
    'Preciso de ajuda com a instalação do IPTV.',
    'Quero assinar um plano agora!',
    'Preciso de suporte técnico urgente.',
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      {/* Quick Messages */}
      {isExpanded && (
        <div className="mb-4 space-y-2">
          {quickMessages.map((message, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-[280px] sm:max-w-xs animate-slide-up border border-gray-200 dark:border-gray-700"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => {
                  openWhatsApp(contactInfo.whatsapp, message);
                  setIsExpanded(false);
                }}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-white transition-colors duration-300 text-left w-full leading-relaxed"
              >
                {message}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-whatsapp-pulse hover:scale-110 active:scale-95 group"
          aria-label="Abrir WhatsApp"
        >
          {isExpanded ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
