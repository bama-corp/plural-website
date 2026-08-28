import { useState } from 'react';
import { Link } from 'react-router-dom';
import FreeTrialModal from './FreeTrialModal';

const HomeCTA = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-black pb-24 sm:pb-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-white/10 via-black to-black px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <p className="section-kicker mb-5 relative">_ começa hoje</p>
          <h2 className="relative mx-auto !text-4xl sm:!text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white max-w-2xl">
            Pronto a ver
            <br />
            tudo num só sítio?
          </h2>
          <p className="relative mx-auto mt-6 max-w-lg text-white/60">
            Teste grátis de 24 horas. Instalação guiada. Sem compromisso.
          </p>
          <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button type="button" onClick={() => setIsOpen(true)} className="btn-primary">
              Testar grátis
            </button>
            <Link to="/indique" className="btn-ghost text-center">
              Indicar um amigo
            </Link>
          </div>
        </div>
      </div>

      <FreeTrialModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
};

export default HomeCTA;
