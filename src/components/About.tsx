import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';
import ContactModal from './ContactModal';

const stats = [
  { value: '900+', label: 'Clientes' },
  { value: '3+', label: 'Anos' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Suporte' },
];

const principles = [
  {
    title: 'Inovação',
    text: 'Servidores pensados para Angola. Do HD ao 4K, a técnica fica connosco.',
  },
  {
    title: 'Qualidade',
    text: 'Estabilidade para o jogo, a série ou o filme — sem travas a meio.',
  },
  {
    title: 'Confiança',
    text: 'Pagamentos locais, preços claros e uma equipa humana no WhatsApp.',
  },
  {
    title: 'Acessibilidade',
    text: 'Dois pacotes, sem fidelização. Entretenimento de qualidade ao alcance de mais casas.',
  },
];

const About = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto max-w-4xl"
        >
          <p className="section-kicker mb-5">{'{ SOBRE }'} _</p>
          <h1 className="!text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Feita para Angola.
            <br />
            <span className="italic font-light">Para veres tudo.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/55 font-light leading-relaxed">
            A Plural junta filmes, séries, desporto e canais ao vivo num só
            sítio. Estável, simples, com instalação guiada e suporte que
            responde.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 sm:mt-20 grid max-w-4xl grid-cols-2 gap-y-8 gap-x-6 border-y border-white/10 py-10 sm:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 sm:mt-28 grid max-w-4xl gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="section-kicker mb-4">_ missão</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Ver bem, sem ruído.
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Democratizar o entretenimento de qualidade: preços claros,
              instalação guiada e uma experiência premium sem fidelização. Tu
              assinas, instalas e vês.
            </p>
          </div>
          <div>
            <p className="section-kicker mb-4">_ visão</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              O sítio certo no ecrã.
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Ser a referência em IPTV em Angola — de Luanda a Benguela, de
              Huambo ao resto do país — com qualidade, inovação e uma equipa
              que não desaparece depois da instalação.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-10">_ o que nos guia</p>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {principles.map(item => (
              <li
                key={item.title}
                className="grid gap-2 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10 sm:items-baseline"
              >
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="text-white/55 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="section-kicker mb-4">_ começa hoje</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Queres conhecer a Plural?
            </h2>
            <p className="mt-3 max-w-md text-white/50">
              Teste grátis de 24 horas. Instalação guiada. Sem compromisso.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary shrink-0"
          >
            Fala connosco
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        title="Fala connosco"
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            'Olá! Gostaria de saber mais sobre a Plural.',
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

export default About;
