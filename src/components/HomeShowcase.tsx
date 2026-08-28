import { Link } from 'react-router-dom';
import { ArrowUpRight, Clapperboard, CreditCard, Store } from 'lucide-react';

const cards = [
  {
    kicker: '01',
    title: 'Planos',
    description:
      'BÁSICO, ULTIMATE ou Netflix ROOM e SOLO. Escolhe o pacote certo para a tua casa — sem letras pequenas.',
    href: '/planos',
    cta: 'Ver planos',
    icon: CreditCard,
  },
  {
    kicker: '02',
    title: 'Catálogo',
    description:
      'Filmes, séries, desporto, infantis e canais ao vivo. O que quiseres, quando quiseres.',
    href: '/catalogo',
    cta: 'Explorar catálogo',
    icon: Clapperboard,
  },
  {
    kicker: '03',
    title: 'Revendedores',
    description:
      'Indica clientes e cresce connosco. Estrutura de preços clara e suporte da marca.',
    href: '/revendedor',
    cta: 'Saber mais',
    icon: Store,
  },
];

const HomeShowcase = () => {
  return (
    <section className="bg-black pb-8">
      <div className="container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="section-kicker mb-5">_ o que podes fazer</p>
          <h2 className="!text-4xl sm:!text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
            Quando não basta ver,
            <br />
            constróis o teu sítio.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/55">
            Assina, explora o catálogo ou entra no programa de revendedores.
            Tudo no mesmo sítio, com a mesma qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-md border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-white/50 hover:bg-white/[0.05]"
              >
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/35">
                      {card.kicker}
                    </span>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <span className="mt-10 inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-white transition-colors">
                  {card.cta}
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeShowcase;
