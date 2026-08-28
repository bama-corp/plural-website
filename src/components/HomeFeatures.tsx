import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: 'Catálogo enorme',
    description:
      'Milhares de filmes, séries e canais ao vivo, organizados para encontrares o que queres em segundos.',
  },
  {
    title: 'Sem travas',
    description:
      'Servidores pensados para Angola, com estabilidade para veres em HD, FHD e 4K sem interrupções.',
  },
  {
    title: 'Em qualquer ecrã',
    description:
      'Smart TV, telemóvel, tablet ou computador. Uma assinatura, os dispositivos que precisares.',
  },
  {
    title: 'Qualidade de cinema',
    description:
      'Do HD ao 4K. Conteúdo nacional, brasileiro e internacional no mesmo sítio.',
  },
  {
    title: 'Suporte humano',
    description:
      'Ajuda real via WhatsApp, 24 horas por dia. Instalação guiada e resposta rápida.',
  },
  {
    title: 'Feita para Angola',
    description:
      'Pagamentos locais, suporte em português e uma rede otimizada para a tua ligação.',
  },
];

const HomeFeatures = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive(current => (current + 1) % features.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker mb-5">_ a plataforma</p>
          <h2 className="!text-4xl sm:!text-5xl lg:!text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
            Moderna, estável e fácil de usar.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/55 leading-relaxed">
            A Plural junta o melhor do entretenimento numa experiência limpa:
            assina, instala e vê. Sem ruído, sem surpresas.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <div className="relative min-h-[240px] rounded-md border border-white/10 bg-white/[0.03] p-8 sm:p-10 overflow-hidden text-center">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={features[active].title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {features[active].title}
                </h3>
                <p className="text-white/55 leading-relaxed">
                  {features[active].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                type="button"
                onClick={() => setActive(index)}
                className={`rounded-sm px-3 py-1.5 text-xs tracking-wide transition-colors ${
                  index === active
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
