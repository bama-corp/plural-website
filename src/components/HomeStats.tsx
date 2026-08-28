import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stats = [
  { value: '900+', label: 'Clientes' },
  { value: '20k+', label: 'Conteúdos' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Suporte' },
];

const quotes = [
  {
    text: 'Passei a ver tudo sem cortes. A instalação foi rápida e o suporte responde mesmo.',
    name: 'Carla M.',
    role: 'Luanda',
  },
  {
    text: 'Troquei de serviço duas vezes antes da Plural. Aqui a qualidade aguenta o jogo inteiro.',
    name: 'Nuno P.',
    role: 'Benguela',
  },
  {
    text: 'O ULTIMATE vale cada kwanza — canais, filmes e séries no mesmo sítio.',
    name: 'Isabel T.',
    role: 'Huambo',
  },
];

const HomeStats = () => {
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-y border-white/10 py-12 mb-20">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker mb-6">_ quem já vê</p>
          <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white mb-10">
            Feita para quem não pode falhar o jogo, a série ou o filme.
          </h2>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={quotes[index].name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-2xl sm:text-3xl font-light leading-snug text-white/90"
            >
              “{quotes[index].text}”
            </motion.blockquote>
          </AnimatePresence>
          <p className="mt-6 text-sm text-white/45">
            {quotes[index].name} · {quotes[index].role}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {quotes.map((quote, i) => (
              <button
                key={quote.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Depoimento ${i + 1}`}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
