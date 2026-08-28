import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { contactInfo } from '../data/mockData';
import { openWhatsApp } from '../utils/helpers';
import ContactModal from './ContactModal';
import ChannelLogoMarquee, {
  movieStudioLogos,
  seriesStreamingLogos,
  sportsEventLogos,
  internationalChannelLogos,
} from './ChannelLogoMarquee';
import CatalogYouTubeBackground from './CatalogYouTubeBackground';
import { warmupCatalogPlayback } from '../lib/youtubeFeed';
import { preloadYouTubeApi } from '../lib/youtubeApi';

const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>\")";

const catalogBlocks = [
  {
    id: 'live-channels',
    kicker: '01',
    title: 'Canais ao vivo',
    subtitle: 'SD • HD • FHD • 4K',
    description: '+6.000 canais ao vivo, de SD a 4K.',
    youtubeHandles: ['TVGlobo', 'Band', 'DisneyPlus', 'ParamountPlus'],
    fallbackIds: ['y80_2R-aPT0', 'oG6HTohzswg', 'obMCJENCzoI', 'WmPomHPYsII'],
    showChannelLogos: true,
  },
  {
    id: 'movies',
    kicker: '02',
    title: 'Filmes',
    subtitle: 'Sob demanda',
    description: 'Milhares de filmes, incluindo 4K.',
    youtubeHandles: ['ingresso-com', 'ParamountPlusBR', 'MarvelEntertainment', 'Netflix'],
    fallbackIds: ['qSqVVswa420', '8g18jFHCLXk', 'uYPbbksJxIg', 'xjDjIWPwcPU'],
    footerLogos: movieStudioLogos,
  },
  {
    id: 'series',
    kicker: '03',
    title: 'Séries',
    subtitle: 'Todas as plataformas',
    description: 'Séries completas, prontas a ver.',
    youtubeHandles: ['HBOMaxBR', 'AppleTV', 'PrimeVideo', 'globoplay'],
    fallbackIds: ['sBEvEcpnG7k', 'Q73Oug-dsn8', 'uLtkt8XuwpE', 'gf7IR3s3CH8'],
    footerLogos: seriesStreamingLogos,
  },
  {
    id: 'sports',
    kicker: '04',
    title: 'Desporto',
    subtitle: 'Ao vivo',
    description: 'Jogos e eventos ao vivo, sem travas.',
    youtubeHandles: ['ESPNBrasil', 'geglobo', 'F1', 'NBA', 'CazeTV'],
    fallbackIds: ['GCsIlvKdZy4', 'EO-ExfxVfMY', '2Ei4E6I_Jvc', 'hIrN9V18LgM'],
    footerLogos: sportsEventLogos,
  },
  {
    id: 'international',
    kicker: '05',
    title: 'Internacionais',
    subtitle: 'Canais de fora',
    description: 'Conteúdo internacional no mesmo sítio.',
    youtubeHandles: [
      'WarnerBrosPictures',
      'UniversalPictures',
      'SonyPicturesEntertainment',
      'BBCNews',
      'CNN',
      'NatGeo',
    ],
    fallbackIds: ['JsxxNJIngIk', 'zSWdZVtXT7E', 'YoHD9XEInc0', 'n9xhJrPXop4'],
    footerLogos: internationalChannelLogos,
  },
  {
    id: 'adult',
    kicker: '06',
    title: 'Adultos',
    subtitle: 'Opcional',
    description: 'Conteúdo adulto, se quiseres.',
    youtubeHandles: [] as string[],
    fallbackIds: ['oQHW9_ahB5M'],
    startFraction: 0.5,
    clipSeconds: 20,
    light: true,
  },
];

const Catalog = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const gridRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);

  useEffect(() => {
    preloadYouTubeApi();
    warmupCatalogPlayback(
      catalogBlocks.map(block => ({
        handles: block.youtubeHandles,
        fallbackIds: block.fallbackIds,
      }))
    );
  }, []);

  const goTo = (direction: -1 | 1) => {
    setExpandedId(current => {
      if (!current) return current;
      const index = catalogBlocks.findIndex(block => block.id === current);
      if (index < 0) return current;
      const next =
        (index + direction + catalogBlocks.length) % catalogBlocks.length;
      return catalogBlocks[next].id;
    });
  };

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const capture = () => {
      if (!expandedId) setGridHeight(el.offsetHeight);
    };

    capture();
    const observer = new ResizeObserver(capture);
    if (!expandedId) observer.observe(el);
    return () => observer.disconnect();
  }, [expandedId, hasIntersected]);

  useEffect(() => {
    if (!expandedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedId(null);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedId]);

  return (
    <section id="catalogo" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto mb-14 sm:mb-16 max-w-3xl text-center"
        >
          <p className="section-kicker mb-5">{'{ CATÁLOGO }'} _</p>
          <h2 className="!text-4xl sm:!text-5xl md:!text-6xl font-extrabold tracking-[-0.03em] text-white">
            O catálogo
          </h2>
          <p className="mt-5 text-white/50 max-w-2xl mx-auto text-base sm:text-lg font-light">
            Filmes, séries, desporto e canais ao vivo. Tudo o que precisas,
            num só sítio.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
          style={
            expandedId && gridHeight
              ? { height: gridHeight, minHeight: gridHeight }
              : undefined
          }
        >
          {catalogBlocks.map((block, index) => {
            const isExpanded = expandedId === block.id;
            const isHidden = Boolean(expandedId) && !isExpanded;
            const isLight = Boolean(block.light);
            const showVideo =
              Boolean(block.youtubeHandles?.length) ||
              Boolean(block.fallbackIds?.length);
            const ink = isLight ? 'text-black' : 'text-white';
            const muted = isLight ? 'text-black/40' : 'text-white/40';
            const soft = isLight ? 'text-black/50' : 'text-white/45';
            const body = isLight ? 'text-black/65' : 'text-white/60';
            const chrome = isLight
              ? 'text-black/80 hover:text-black'
              : 'text-white/90 hover:text-white';
            const close = isLight
              ? 'text-black/60 hover:text-black'
              : 'text-white/70 hover:text-white';

            return (
              <motion.article
                key={block.id}
                initial={{ opacity: 0, y: 24 }}
                animate={
                  isHidden
                    ? { opacity: 0, y: 0 }
                    : hasIntersected
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 24 }
                }
                transition={{ delay: expandedId ? 0 : 0.08 * index, duration: 0.35 }}
                className={`relative flex flex-col overflow-hidden rounded-md cursor-pointer ${
                  isLight
                    ? 'border border-black/10 bg-white'
                    : 'border border-white/10 bg-[#0a0a0a]'
                } ${isExpanded ? 'col-span-full h-full min-h-0' : 'min-h-[280px]'} ${
                  isHidden ? 'hidden' : ''
                }`}
                onClick={() => {
                  if (!expandedId && gridRef.current) {
                    setGridHeight(gridRef.current.offsetHeight);
                  }
                  setExpandedId(current => (current === block.id ? null : block.id));
                }}
              >
                {showVideo && (
                  <>
                    <CatalogYouTubeBackground
                      handles={block.youtubeHandles}
                      fallbackIds={block.fallbackIds}
                      startFraction={block.startFraction}
                      clipSeconds={block.clipSeconds}
                      lightCover={isLight}
                    />
                    <div
                      className={`absolute inset-0 z-[1] ${
                        isLight
                          ? isExpanded
                            ? 'bg-white/80'
                            : 'bg-white/85'
                          : isExpanded
                            ? 'bg-black/50'
                            : 'bg-black/55'
                      }`}
                    />
                  </>
                )}

                <div
                  className={`relative z-10 flex flex-1 flex-col ${
                    isExpanded ? 'p-8 sm:px-16 sm:py-12' : 'p-7'
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -left-8 -top-16 h-48 w-48 rounded-full blur-3xl ${
                      isLight ? 'bg-black/10' : 'bg-white/15'
                    }`}
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 mix-blend-overlay ${
                      isLight ? 'opacity-20' : 'opacity-30'
                    }`}
                    style={{ backgroundImage: noise }}
                  />

                  {isExpanded && (
                    <>
                      <button
                        type="button"
                        aria-label="Cartão anterior"
                        className={`absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-transparent p-1 text-2xl leading-none sm:left-5 ${chrome}`}
                        onClick={event => {
                          event.stopPropagation();
                          goTo(-1);
                        }}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="Cartão seguinte"
                        className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-transparent p-1 text-2xl leading-none sm:right-5 ${chrome}`}
                        onClick={event => {
                          event.stopPropagation();
                          goTo(1);
                        }}
                      >
                        ›
                      </button>
                      <button
                        type="button"
                        aria-label="Fechar"
                        className={`group/close absolute right-5 top-5 z-20 flex items-center gap-2 text-sm tracking-wide ${close}`}
                        onClick={event => {
                          event.stopPropagation();
                          setExpandedId(null);
                        }}
                      >
                        <span className="text-lg leading-none">×</span>
                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/close:max-w-[4.5rem] group-hover/close:opacity-100">
                          Fechar
                        </span>
                      </button>
                    </>
                  )}

                  <span
                    className={`relative font-mono text-[10px] tracking-[0.18em] ${muted}`}
                  >
                    {block.kicker}
                  </span>
                  <h3
                    className={`relative mt-8 font-semibold tracking-tight ${ink} ${
                      isExpanded ? 'text-4xl sm:text-6xl' : 'text-2xl'
                    }`}
                  >
                    {block.title}
                  </h3>
                  <p
                    className={`relative mt-2 ${soft} ${
                      isExpanded ? 'text-base sm:text-lg' : 'text-sm'
                    }`}
                  >
                    {block.subtitle}
                  </p>
                  <p
                    className={`relative leading-relaxed ${body} ${
                      isExpanded
                        ? 'mt-4 max-w-xl text-base sm:text-lg'
                        : 'mt-4 text-sm'
                    }`}
                  >
                    {block.description}
                  </p>
                </div>
                {(block.showChannelLogos || block.footerLogos) && (
                  <div
                    className={`relative z-10 mt-auto ${
                      isExpanded ? 'pb-8 pt-4' : 'pb-5 pt-2'
                    }`}
                  >
                    <ChannelLogoMarquee
                      compact={!isExpanded}
                      items={block.footerLogos}
                    />
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-white/10 via-black to-black px-8 py-14 sm:px-16 sm:py-16 text-center">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <p className="section-kicker mb-5 relative">_ começa hoje</p>
            <h3 className="relative !text-3xl sm:!text-5xl font-extrabold tracking-[-0.03em] text-white">
              Pronto a ver tudo num só sítio?
            </h3>
            <p className="relative mx-auto mt-5 max-w-lg text-white/55">
              Teste grátis de 24 horas. Instalação guiada. Sem compromisso.
            </p>
            <div className="relative mt-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        title="Vamos começar"
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            'Olá! Quero começar agora com a Plural.',
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

export default Catalog;
