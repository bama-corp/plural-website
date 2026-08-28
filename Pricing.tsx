import { motion } from 'framer-motion';
import { plans, contactInfo } from '../data/mockData';
import { Check } from 'lucide-react';
import { openWhatsApp, formatPrice } from '../utils/helpers';

type Plan = (typeof plans)[number];

const Pricing = () => {
  return (
    <section id="planos" className="py-20 sm:py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-white mb-4">
            Escolha o Plano Perfeito para Si
          </h2>
          <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            Acesso ilimitado ao melhor entretenimento, com a flexibilidade que
            precisa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-max gap-8 justify-items-center justify-center max-w-4xl mx-auto">
          {plans.map((plan: Plan, index: number) => (
            <motion.div
              key={plan.id}
              className={`relative flex flex-col p-6 sm:p-8 rounded-2xl border-2 w-full max-w-md ${
                plan.popular
                  ? 'bg-primary-500/10 border-primary-500'
                  : 'bg-white/5 border-white/10'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Mais Popular
                </div>
              )}
              <h3 className="text-3xl font-bold text-white">{plan.name}</h3>
              <p className="text-5xl font-extrabold text-white my-4">
                {formatPrice(plan.price)}
                <span className="text-lg font-medium text-gray-300">/mês</span>
              </p>
              <ul className="space-y-3 text-gray-300 flex-grow mb-8">
                {plan.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.startsWith('(') ? (
                      <span className="text-gray-400 text-base ml-7 -mt-2 block">
                        {feature}
                      </span>
                    ) : (
                      <>
                        <Check className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-base">{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  openWhatsApp(
                    contactInfo.whatsapp,
                    `Olá! Tenho interesse no ${plan.name}.`
                  )
                }
                className={`w-full py-3 mt-auto rounded-lg font-bold text-xl transition-transform duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-primary-500 text-white shadow-primary-500/30 shadow-[0_8px_20px]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Escolher Plano
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
