import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FreeTrialModal from './FreeTrialModal';
import YouTubeHeroBackground from './YouTubeHeroBackground';

const Hero = () => {
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      <YouTubeHeroBackground />

      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/80" />

      <div className="relative z-10 container pt-28 pb-20 sm:pt-32 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="section-kicker mb-6">_ streaming premium</p>
          <h1 className="!text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Mais do que
            <br />
            só um <span className="italic font-light">IPTV.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg sm:text-xl text-white/75 font-light leading-relaxed">
            A Plural leva filmes, séries e canais ao vivo até ti — estável,
            rápida e feita para Angola.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsFreeTrialModalOpen(true)}
              className="btn-primary"
            >
              Começar agora
            </button>
            <Link to="/planos" className="btn-ghost text-center">
              Ver planos
            </Link>
          </div>
        </motion.div>
      </div>

      <FreeTrialModal
        isOpen={isFreeTrialModalOpen}
        onClose={() => setIsFreeTrialModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
