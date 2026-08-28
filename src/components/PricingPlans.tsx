import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { formatPrice, openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';
import ContactModal from './ContactModal';
import CatalogYouTubeBackground from './CatalogYouTubeBackground';

type Pack = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  meta: string[];
  details: string[];
  highlight?: boolean;
};

const iptvPackages: Pack[] = [
  {
    id: 'basico',
    name: 'BÁSICO',
    subtitle: 'Canais brasileiros',
    price: 9500,
    meta: ['Até 2.000 canais', 'HD / FHD'],
    details: [
      'Canais brasileiros (sem internacionais)',
      'Até 2.000 canais ao vivo',
      '+ 12.000 filmes',
      '+ 6.000 séries',
      'Qualidade HD/FHD',
      'Sem limite de dispositivos',
      'Instalação grátis',
      'Suporte 24/7',
    ],
  },
  {
    id: 'ultimate',
    name: 'ULTIMATE',
    subtitle: 'Brasil + internacionais',
    price: 12500,
    meta: ['Até 6.000 canais', 'HD / FHD / 4K'],
    details: [
      'Tudo do BÁSICO',
      'Canais internacionais completos',
      'Até 6.000 canais ao vivo',
      '+ 33.000 filmes',
      '+ 15.000 séries',
      'Qualidade HD/FHD/4K',
      'Canais premium exclusivos',
      'Backup de 2 meses grátis',
      'Instalação grátis',
      'Suporte 24/7',
    ],
    highlight: true,
  },
];

const netflixPackages: Pack[] = [
  {
    id: 'room',
    name: 'ROOM',
    subtitle: 'Perfil numa sala',
    price: 5000,
    meta: ['Conta partilhada', 'HD / FHD / 4K'],
    details: [
      'Netflix na Plural, perfil numa sala partilhada',
      'Um ecrã de cada vez',
      'Qualidade HD/FHD/4K',
      'Instalação grátis',
      'Suporte 24/7',
    ],
  },
  {
    id: 'solo',
    name: 'SOLO',
    subtitle: 'Conta só tua',
    price: 16500,
    meta: ['Conta exclusiva', 'HD / FHD / 4K'],
    details: [
      'Netflix exclusiva, sem partilha',
      'A tua conta e os teus perfis',
      'Qualidade HD/FHD/4K',
      'Sem concorrer com outros ecrãs',
      'Instalação grátis',
      'Suporte 24/7',
    ],
    highlight: true,
  },
];

type FamilyBoardProps = {
  title: string;
  packs: Pack[];
  selectedId: string;
  onSelect: (id: string) => void;
  onActivate: (pack: Pack) => void;
  logo?: string;
  theme?: 'plural' | 'netflix';
  videoId?: string;
};

const FamilyBoard = ({
  title,
  packs,
  selectedId,
  onSelect,
  onActivate,
  logo,
  theme = 'plural',
  videoId,
}: FamilyBoardProps) => {
  const selected = packs.find(pack => pack.id === selectedId) ?? packs[0];
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logo) && !logoFailed;
  const isNetflix = theme === 'netflix';

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-md border ${
        isNetflix
          ? 'border-[#E50914]/35 bg-[#141414]'
          : 'border-white/10 bg-[#0a0a0a]'
      }`}
    >
      {videoId ? (
        <>
          <CatalogYouTubeBackground
            handles={[]}
            fallbackIds={[videoId]}
            startFraction={0}
            clipSeconds={20}
            color
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/70 to-[#141414]/90" />
        </>
      ) : null}
      <header className="relative z-10 px-7 pt-7 pb-6">
        {showLogo ? (
          <>
            <h3 className="sr-only">{title}</h3>
            <img
              src={logo}
              alt={title}
              className={`relative h-8 sm:h-10 w-auto ${
                isNetflix ? '' : 'brightness-0 invert'
              }`}
              onError={() => setLogoFailed(true)}
            />
          </>
        ) : (
          <h3 className="!text-3xl font-extrabold tracking-[-0.03em] text-white">
            {title}
          </h3>
        )}
      </header>

      <div className="relative z-10 border-t border-white/10">
        {packs.map(pack => {
          const active = pack.id === selectedId;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onSelect(pack.id)}
              className={`flex w-full items-baseline justify-between gap-4 border-b border-white/10 px-7 py-5 text-left transition-colors ${
                active
                  ? isNetflix
                    ? 'bg-[#E50914]/15 shadow-[inset_3px_0_0_#E50914]'
                    : 'bg-white/[0.07]'
                  : isNetflix
                    ? 'hover:bg-[#E50914]/10'
                    : 'hover:bg-white/[0.03]'
              }`}
            >
              <span>
                <span
                  className={`block text-lg font-semibold tracking-tight ${
                    active
                      ? 'text-white'
                      : isNetflix
                        ? 'text-white/60'
                        : 'text-white/55'
                  }`}
                >
                  {pack.name}
                </span>
                <span className="mt-1 block text-sm text-white/40">
                  {pack.subtitle}
                </span>
              </span>
              <span
                className={`shrink-0 text-right text-xl font-semibold tabular-nums ${
                  isNetflix
                    ? active
                      ? 'text-[#E50914]'
                      : 'text-white'
                    : pack.highlight
                      ? 'pack-silver-price'
                      : 'text-white'
                }`}
              >
                {formatPrice(pack.price)}
                <span className="ml-1 text-xs font-normal text-white/35">
                  /mês
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-7 py-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
          {selected.meta.map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <ul className="mt-5 flex-1 space-y-2.5">
          {selected.details.map(item => (
            <li key={item} className="text-sm leading-relaxed text-white/65">
              {item}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onActivate(selected)}
          className={
            isNetflix
              ? 'mt-8 w-full rounded-sm bg-[#E50914] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#f40612]'
              : 'btn-primary mt-8 w-full'
          }
        >
          Ativar {selected.name}
        </button>
      </div>
    </article>
  );
};

const PricingPlans = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [iptvId, setIptvId] = useState('ultimate');
  const [netflixId, setNetflixId] = useState('solo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  const activate = (name: string) => {
    setSelectedPlanName(name);
    setIsModalOpen(true);
  };

  return (
    <section id="planos" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="text-center mb-14 sm:mb-16"
        >
          <p className="section-kicker mb-5">{'{ PACOTES }'} _</p>
          <h2 className="!text-4xl sm:!text-5xl md:!text-6xl font-extrabold tracking-[-0.03em] text-white">
            Os pacotes
          </h2>
          <p className="mt-5 text-white/50 max-w-2xl mx-auto text-base sm:text-lg font-light">
            Dois tipos. Quatro opções. Clica no nome, vê o que inclui, activa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl mx-auto items-stretch">
          <FamilyBoard
            title="IPTV"
            packs={iptvPackages}
            selectedId={iptvId}
            onSelect={setIptvId}
            onActivate={pack => activate(pack.name)}
          />
          <FamilyBoard
            title="Netflix"
            packs={netflixPackages}
            selectedId={netflixId}
            onSelect={setNetflixId}
            onActivate={pack => activate(`Netflix ${pack.name}`)}
            logo="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            theme="netflix"
            videoId="sDL70A0I3kA"
          />
        </div>

        <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-md overflow-hidden">
          {[
            { title: 'Sem fidelização', text: 'Cancele quando quiser' },
            { title: 'Ativação rápida', text: 'Acesso após o pagamento' },
            { title: 'Suporte 24/7', text: 'Ajuda via WhatsApp' },
          ].map(item => (
            <div key={item.title} className="bg-black px-6 py-8 text-center">
              <p className="text-white font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-white/40">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        title={
          selectedPlanName ? `Quero o ${selectedPlanName}` : 'Quero este plano'
        }
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            `Olá! Quero assinar o ${selectedPlanName ?? 'plano'} da Plural.`,
            '',
            'Dados do cliente:',
            `- Nome: ${name}`,
            `- E-mail: ${email}`,
            `- Localização: ${location}`,
          ].join('\n');
          openWhatsApp(contactInfo.whatsapp, message);
          setIsModalOpen(false);
        }}
      />
    </section>
  );
};

export default PricingPlans;
