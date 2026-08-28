import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ContactModal from './ContactModal';
import TextReel from './TextReel';
import { openWhatsApp, sendEmail } from '../utils/helpers';
import { contactInfo } from '../data/mockData';

const faqData = [
  {
    question: 'Como se instala a Plural?',
    answer:
      'A instalação é guiada e gratuita. A equipa configura o serviço no teu dispositivo por WhatsApp. Marcas um horário, fazemos o resto.',
  },
  {
    question: 'Que dispositivos são compatíveis?',
    answer:
      'Smart TVs (Samsung, LG, Sony), telemóveis Android e iOS, tablets, computadores Windows e Mac, Fire Stick, Android TV Box, Apple TV e outros leitores de streaming.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Pagamentos locais: transferência, depósito e outros métodos usados em Angola. Os pacotes são mensais, trimestrais ou anuais, com desconto nos períodos mais longos. O pagamento é feito antes de activar o serviço.',
  },
  {
    question: 'Posso ver em vários ecrãs?',
    answer:
      'Sim. O BÁSICO e o ULTIMATE não têm limite de dispositivos. Podes trocar de ecrã quando quiseres.',
  },
  {
    question: 'Qual é a qualidade do streaming?',
    answer:
      'HD e FHD no BÁSICO; HD, FHD e 4K no ULTIMATE. A rede está pensada para Angola, para o jogo, a série ou o filme correrem sem travas.',
  },
  {
    question: 'O suporte está disponível 24/7?',
    answer:
      'Sim. Equipa humana no WhatsApp, 24 horas por dia, 7 dias por semana. Instalação, dúvidas e problemas — respondemos.',
  },
  {
    question: 'A Plural tem Netflix?',
    answer:
      'Sim. Há Netflix no catálogo IPTV e dois pacotes só Netflix: ROOM a 5.000 Kz e SOLO a 16.500 Kz.',
  },
  {
    question: 'Qual a diferença entre ROOM e SOLO?',
    answer:
      'ROOM é um perfil numa sala partilhada — mais barato, um ecrã de cada vez, até 4K. SOLO é conta só tua, sem partilha, também até 4K.',
  },
  {
    question: 'Preciso de uma conta Netflix?',
    answer:
      'Não. A Netflix na Plural faz parte do pacote. Não precisas de subscrição extra nem de login na Netflix.',
  },
  {
    question: 'Está nos dois pacotes?',
    answer:
      'Sim. BÁSICO e ULTIMATE incluem filmes e séries da Netflix. O ULTIMATE acrescenta mais catálogo, canais internacionais e 4K.',
  },
  {
    question: 'A Netflix na Plural está em 4K?',
    answer:
      'No catálogo IPTV, o ULTIMATE vai até 4K. Nos pacotes Netflix ROOM e SOLO também. O BÁSICO fica em HD/FHD.',
  },
  {
    question: 'Os lançamentos da Netflix aparecem?',
    answer:
      'O catálogo actualiza com frequência. Estreias e títulos novos da Netflix entram à medida que ficam disponíveis. Se falta alguma coisa, diz no WhatsApp.',
  },
];

const FAQ = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto max-w-4xl"
        >
          <p className="section-kicker mb-5">{'{ FAQ }'} _</p>
          <h1 className="!text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Perguntas <span className="italic font-light">frequentes.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/55 font-light leading-relaxed">
            Instalação, Netflix, pagamentos e suporte. Gira a lista, ou clica
            na pergunta.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 sm:mt-16 max-w-4xl">
          <TextReel
            enabled={hasIntersected}
            items={faqData.map(item => ({
              id: item.question,
              label: item.question,
              content: item.answer,
            }))}
          />
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="section-kicker mb-4">_ ainda com dúvidas</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              A equipa responde.
            </h2>
            <p className="mt-3 max-w-md text-white/50">
              WhatsApp 24/7 ou e-mail. Instalação, pagamentos ou um ecrã que não
              liga — estamos aí.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsUrgentModalOpen(true)}
              className="btn-primary"
            >
              Suporte urgente
            </button>
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="btn-ghost"
            >
              Enviar e-mail
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isUrgentModalOpen}
        title="Suporte urgente"
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsUrgentModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            'URGENTE! Preciso de suporte técnico imediato.',
            '',
            'Dados do cliente:',
            `- Nome: ${name}`,
            `- E-mail: ${email}`,
            `- Localização: ${location}`,
            '',
            'Por favor, entra em contacto o mais rápido possível.',
          ].join('\n');
          openWhatsApp(contactInfo.whatsapp, message);
          setIsUrgentModalOpen(false);
        }}
      />

      <ContactModal
        isOpen={isEmailModalOpen}
        title="Enviar e-mail"
        submitLabel="Enviar e-mail"
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const subject = 'Suporte Plural — pedido de ajuda';
          const body = [
            'Olá! Preciso de ajuda com o serviço Plural.',
            '',
            'Dados do cliente:',
            `- Nome: ${name}`,
            `- E-mail: ${email}`,
            `- Localização: ${location}`,
            '',
            'Por favor, entra em contacto para me ajudar.',
          ].join('\n');
          sendEmail(contactInfo.email, subject, body);
          setIsEmailModalOpen(false);
        }}
      />
    </section>
  );
};

export default FAQ;
