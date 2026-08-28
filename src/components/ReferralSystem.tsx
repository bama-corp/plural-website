import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';
import ContactModal from './ContactModal';

const levels = [
  { value: '15%', label: '1 amigo' },
  { value: '50%', label: '2 amigos' },
  { value: '75%', label: '3 amigos' },
  { value: '100%', label: '4 amigos — mês grátis' },
];

const steps = [
  {
    number: '01',
    title: 'Pede o código',
    text: 'No WhatsApp escreves INDICAR. A equipa envia o teu PLURAL-XXXX.',
  },
  {
    number: '02',
    title: 'O amigo assina',
    text: 'Ele escreve: «Quero assinar — código PLURAL-XXXX» antes de pagar.',
  },
  {
    number: '03',
    title: 'A indicação vale',
    text: 'Depois de 7 dias de uso activo, a indicação fica confirmada.',
  },
  {
    number: '04',
    title: 'O desconto entra',
    text: 'Aplica-se na tua próxima mensalidade, no nível mais alto que atingiste.',
  },
];

const friendPerks = [
  {
    title: 'Primeira mensalidade',
    text: '15% de desconto na primeira mensalidade dele.',
  },
  {
    title: 'Activação',
    text: 'Activação com prioridade, para começar a ver mais cedo.',
  },
  {
    title: 'Suporte',
    text: 'Acompanhamento inicial com prioridade no WhatsApp.',
  },
];

const rules = [
  {
    title: 'Quando',
    text: 'O código tem de ir no pedido, antes do pagamento.',
  },
  {
    title: 'Uma vez',
    text: 'Cada número de WhatsApp conta uma só indicação.',
  },
  {
    title: 'Sete dias',
    text: 'A indicação só vale depois de 7 dias de uso activo.',
  },
  {
    title: 'Cancelar',
    text: 'Se o amigo cancelar antes dos 7 dias, a indicação anula-se.',
  },
];

const ReferralSystem = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyKeyword = () => {
    navigator.clipboard.writeText('INDICAR');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="indique" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto max-w-4xl"
        >
          <p className="section-kicker mb-5">{'{ INDIQUE }'} _</p>
          <h1 className="!text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Indica um amigo.{' '}
            <span className="italic font-light">Chega ao mês grátis.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/55 font-light leading-relaxed">
            Por cada amigo que assina com o teu código, o desconto sobe. Quatro
            amigos, um mês teu. O desconto não acumula — vale o nível mais alto.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 sm:mt-20 grid max-w-4xl grid-cols-2 gap-y-8 gap-x-6 border-y border-white/10 py-10 sm:grid-cols-4">
          {levels.map(level => (
            <div key={level.label}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {level.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
                {level.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-10">_ como funciona</p>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {steps.map(item => (
              <li
                key={item.number}
                className="grid gap-2 py-8 sm:grid-cols-[4rem_11rem_1fr] sm:gap-10 sm:items-baseline"
              >
                <span className="font-mono text-sm text-white/40">{item.number}</span>
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="text-white/55 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl grid gap-16 border-y border-white/10 py-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="section-kicker mb-4">_ o teu pedido</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              INDICAR
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Escreves isto no WhatsApp. A equipa responde com o código no
              formato PLURAL-XXXX.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Pedir código
              </button>
              <button type="button" onClick={copyKeyword} className="btn-ghost">
                {copied ? 'Copiado' : 'Copiar INDICAR'}
              </button>
            </div>
          </div>
          <div>
            <p className="section-kicker mb-4">_ o amigo diz</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Quero assinar.
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              «Quero assinar — código PLURAL-XXXX». Tem de ir no pedido, antes
              de pagar. Sem o código, a indicação não conta.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-6xl grid border-y border-white/10 lg:grid-cols-2">
          <div className="py-10 lg:pr-12">
            <p className="section-kicker mb-8">_ o amigo recebe</p>
            <table className="w-full text-left">
              <tbody>
                {friendPerks.map(item => (
                  <tr
                    key={item.title}
                    className="border-b border-white/10 align-baseline last:border-b-0"
                  >
                    <th className="w-[7rem] py-5 pr-4 text-base font-semibold tracking-tight text-white sm:w-44">
                      {item.title}
                    </th>
                    <td className="py-5 text-sm leading-relaxed text-white/55 sm:text-base">
                      {item.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/10 py-10 lg:border-l lg:border-t-0 lg:pl-12">
            <p className="section-kicker mb-8">_ regras</p>
            <table className="w-full text-left">
              <tbody>
                {rules.map(item => (
                  <tr
                    key={item.title}
                    className="border-b border-white/10 align-baseline last:border-b-0"
                  >
                    <th className="w-[7rem] py-5 pr-4 text-base font-semibold tracking-tight text-white sm:w-36">
                      {item.title}
                    </th>
                    <td className="py-5 text-sm leading-relaxed text-white/55 sm:text-base">
                      {item.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="section-kicker mb-4">_ começa</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Pede o teu código.
            </h2>
            <p className="mt-3 max-w-md text-white/50">
              Quatro amigos, um mês grátis. O desconto entra na próxima
              mensalidade.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary shrink-0"
          >
            Pedir código
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        title="Pedir código de indicação"
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            'INDICAR',
            '',
            'Quero o meu código de indicação.',
            '',
            'Dados:',
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

export default ReferralSystem;
