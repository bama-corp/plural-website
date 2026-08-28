import { useEffect, useState } from 'react';

const platforms = [
  'Smart TV',
  'Android',
  'iOS',
  'Windows',
  'Fire Stick',
  'Android Box',
  'LG',
  'Samsung',
];

const HIGHLIGHT_MS = 3000;

const HomeLogos = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive(i => (i + 1) % platforms.length);
    }, HIGHLIGHT_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="border-y border-white/10 bg-black">
      <div className="container py-10 sm:py-12">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-white/40 mb-8">
          Compatível com os ecrãs que já tens
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {platforms.map((name, index) => {
            const isOn = index === active;
            return (
              <span
                key={name}
                className={`text-sm sm:text-base font-semibold tracking-wide transition-colors duration-700 ${
                  isOn ? 'text-white' : 'text-white/25'
                }`}
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeLogos;
