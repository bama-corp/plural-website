import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Gift } from 'lucide-react';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FreeTrialModal = ({ isOpen, onClose }: FreeTrialModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    device: '',
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá! Gostaria de iniciar meu teste grátis de 24 horas.\n\nNome: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\nDispositivo: ${formData.device}`;
    openWhatsApp(contactInfo.whatsapp, message);
    onClose();
  };

  const included = [
    'Acesso a 5.000+ canais',
    'Filmes e séries em HD',
    'Suporte 24/7',
    'Todos os dispositivos',
    'Sem anúncios',
  ];

  const limitations = [
    'Duração: 24 horas',
    'Conteúdo: 50% do catálogo (mais populares)',
    'Qualidade: HD (4K apenas para assinantes)',
    'Dispositivos: 1 simultâneo',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-gray-900 rounded shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-800">
              {/* Header */}
              <div className="bg-white text-black p-5 sm:p-6 rounded-t relative flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-black hover:bg-black/10 rounded-full p-1.5 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 pr-10">
                  <div className="bg-white/20 rounded-full p-2">
                    <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Teste Grátis por 24 Horas</h2>
                    <p className="text-white/90 text-sm">Acesso completo sem compromisso</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Two Columns Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* What's Included */}
                    <div className="bg-gray-800/50 rounded border border-gray-800 p-4 sm:p-5">
                      <h3 className="text-base font-bold text-white mb-4 flex items-center">
                        O que está incluído:
                      </h3>
                      <div className="space-y-2.5">
                        {included.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 text-gray-300">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Limitations */}
                    <div className="bg-gray-800/50 border-2 border-gray-800 rounded p-4 sm:p-5">
                      <h3 className="text-base font-bold text-white mb-4 flex items-center">
                        Limitações do teste:
                      </h3>
                      <ul className="space-y-2.5 text-gray-400">
                        {limitations.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-gray-500 mt-0.5 flex-shrink-0 font-bold">•</span>
                            <span className="text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-800"></div>

                  {/* Form */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      Preencha seus dados
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome completo"
                          className="w-full px-4 py-3 rounded border border-gray-800 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 rounded border border-gray-800 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            placeholder="+244 900 000 000"
                            className="w-full px-4 py-3 rounded border border-gray-800 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Dispositivo Preferido *
                        </label>
                        <select
                          required
                          value={formData.device}
                          onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                          className="w-full px-4 py-3 rounded border border-gray-800 bg-gray-800/50 text-white focus:ring-2 focus:ring-white focus:border-white transition-colors"
                        >
                      <option value="" className="bg-gray-900">Selecione...</option>
                      <optgroup label="Smart TVs" className="bg-gray-900">
                        <option value="smart-tv-samsung" className="bg-gray-900">Samsung Smart TV (Tizen)</option>
                        <option value="smart-tv-lg" className="bg-gray-900">LG Smart TV (webOS)</option>
                        <option value="smart-tv-sony" className="bg-gray-900">Sony Smart TV (Android TV)</option>
                        <option value="smart-tv-philips" className="bg-gray-900">Philips Smart TV (Android TV)</option>
                        <option value="smart-tv-panasonic" className="bg-gray-900">Panasonic Smart TV</option>
                        <option value="smart-tv-tcl" className="bg-gray-900">TCL Smart TV (Android TV)</option>
                      </optgroup>
                      <optgroup label="Smartphones e Tablets" className="bg-gray-900">
                        <option value="android-phone" className="bg-gray-900">Android (Smartphone)</option>
                        <option value="ios-phone" className="bg-gray-900">iOS - iPhone</option>
                        <option value="android-tablet" className="bg-gray-900">Android (Tablet)</option>
                        <option value="ios-tablet" className="bg-gray-900">iOS - iPad</option>
                      </optgroup>
                      <optgroup label="Streaming Devices" className="bg-gray-900">
                        <option value="fire-stick" className="bg-gray-900">Amazon Fire TV Stick</option>
                        <option value="fire-tv-cube" className="bg-gray-900">Amazon Fire TV Cube</option>
                        <option value="android-tv-box" className="bg-gray-900">Android TV Box</option>
                        <option value="chromecast" className="bg-gray-900">Google Chromecast</option>
                        <option value="chromecast-google-tv" className="bg-gray-900">Chromecast with Google TV</option>
                        <option value="apple-tv" className="bg-gray-900">Apple TV</option>
                        <option value="roku" className="bg-gray-900">Roku</option>
                        <option value="mi-box" className="bg-gray-900">Xiaomi Mi Box</option>
                        <option value="nvidia-shield" className="bg-gray-900">NVIDIA Shield TV</option>
                      </optgroup>
                      <optgroup label="Computadores" className="bg-gray-900">
                        <option value="windows" className="bg-gray-900">Windows (PC/Notebook)</option>
                        <option value="macos" className="bg-gray-900">macOS (Mac)</option>
                        <option value="linux" className="bg-gray-900">Linux</option>
                      </optgroup>
                      <optgroup label="Gaming Consoles" className="bg-gray-900">
                        <option value="xbox" className="bg-gray-900">Xbox</option>
                        <option value="playstation" className="bg-gray-900">PlayStation</option>
                        <option value="nintendo-switch" className="bg-gray-900">Nintendo Switch</option>
                      </optgroup>
                      <optgroup label="Outros" className="bg-gray-900">
                        <option value="outro" className="bg-gray-900">Outro dispositivo</option>
                      </optgroup>
                    </select>
                  </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded border border-gray-800">
                        <input
                          type="checkbox"
                          required
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          className="mt-0.5 w-4 h-4 accent-white border-gray-700 rounded focus:ring-white"
                        />
                        <label className="text-sm text-gray-300 leading-relaxed">
                          Aceito os termos e condições do teste grátis *
                        </label>
                      </div>

                      <div className="bg-gray-800/50 border-2 border-gray-800 rounded p-4">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          <strong className="text-white">Sem pagamento prévio necessário!</strong> Após o teste, você receberá
                          uma oferta especial para continuar. Pode cancelar a qualquer momento.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full btn-primary text-base sm:text-lg py-3.5 sm:py-4 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Gift className="w-5 h-5" />
                        Iniciar Teste Grátis Agora
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FreeTrialModal;

