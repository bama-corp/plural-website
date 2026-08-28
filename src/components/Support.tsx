import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { openWhatsApp, sendEmail } from '../utils/helpers';
import { contactInfo } from '../data/mockData';
import ContactModal from './ContactModal';
import TextReel from './TextReel';

const problems = [
  {
    id: 'signal',
    title: 'Sinal fraco ou a travar',
    steps: [
      'Confirma a internet (mínimo 10 Mbps).',
      'Reinicia o router.',
      'Fecha apps em segundo plano.',
      'Testa outro canal. Se continuar, fala connosco.',
    ],
  },
  {
    id: 'access',
    title: 'Acesso ou login',
    steps: [
      'Confirma utilizador e palavra-passe.',
      'Vê se a subscrição está activa.',
      'Tenta noutro ecrã.',
    ],
  },
  {
    id: 'config',
    title: 'TV Box ou app',
    steps: [
      'Smart TV, Android TV, telemóvel ou computador — a instalação é guiada.',
      'Pedimos o modelo do aparelho e fazemos o resto no WhatsApp.',
    ],
  },
  {
    id: 'payment',
    title: 'Pagamentos e subscrição',
    steps: [
      'Confirma se o pagamento chegou.',
      'Vê o estado da subscrição.',
      'Se não bater certo, envia o comprovativo no WhatsApp.',
    ],
  },
  {
    id: 'renewal',
    title: 'Renovação ou reactivação',
    steps: [
      'Confirma a data de expiração.',
      'Paga a renovação pelos métodos locais.',
      'A reactivação é rápida depois da confirmação.',
    ],
  },
  {
    id: 'other',
    title: 'Outro problema',
    steps: [
      'Descreve o que vês no ecrã.',
      'Diz o dispositivo e o pacote (BÁSICO, ULTIMATE, ROOM ou SOLO).',
      'Abrimos o WhatsApp e resolvemos.',
    ],
  },
];

const formatWhatsApp = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('244') && digits.length === 12) {
    return `+244 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return raw;
};

const notes = [
  {
    question: 'O serviço trava?',
    answer:
      'Primeiro a ligação (mínimo 10 Mbps), o router e as apps em fundo. Se persistir, a equipa troca de servidor ou ajusta o teu acesso.',
  },
  {
    question: 'Como funciona o teste grátis?',
    answer:
      '24 horas, sem compromisso. Pedes no WhatsApp, activamos, vês se serve. Depois escolhes o pacote.',
  },
  {
    question: 'E se não pagar?',
    answer:
      'O serviço suspende no fim do período. Reactivas quando quiseres, com o pagamento em dia. Sem fidelização.',
  },
  {
    question: 'Trocamos de servidor?',
    answer:
      'Sim, se a estabilidade falhar. A equipa monitoriza e muda quando for preciso — dizes no WhatsApp.',
  },
];

const Support = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <section id="suporte" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto max-w-4xl"
        >
          <p className="section-kicker mb-5">{'{ SUPORTE }'} _</p>
          <h1 className="!text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Suporte <span className="italic font-light">humano.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/55 font-light leading-relaxed">
            Sinal, acesso, pagamento ou a TV que não liga. Gira o problema ou
            a pergunta — a equipa está no WhatsApp, não um bot.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 sm:mt-20 grid max-w-4xl grid-cols-1 gap-y-8 border-y border-white/10 py-10 sm:grid-cols-2 sm:gap-x-12">
          {[
            { label: 'Servidor principal', value: 'Online' },
            { label: 'Servidor alternativo', value: 'Online' },
          ].map(item => (
            <div key={item.label} className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-white/45">{item.label}</span>
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-6xl grid gap-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-kicker mb-8 text-center">_ o problema</p>
            <TextReel
              enabled={hasIntersected}
              compact
              items={problems.map(item => ({
                id: item.id,
                label: item.title,
                content: (
                  <ol className="mx-auto max-w-sm space-y-3 text-left">
                    {item.steps.map((step, index) => (
                      <li key={step} className="grid grid-cols-[auto_1fr] gap-x-3">
                        <span className="font-mono text-xs text-white/35 pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ),
              }))}
            />
          </div>

          <div>
            <p className="section-kicker mb-8 text-center">_ perguntas rápidas</p>
            <TextReel
              enabled={hasIntersected}
              compact
              items={notes.map(item => ({
                id: item.question,
                label: item.question,
                content: item.answer,
              }))}
            />
            <p className="mt-8 text-center text-sm text-white/40">
              Mais dúvidas?{' '}
              <Link to="/faq" className="text-white/70 hover:text-white">
                Ver a FAQ
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-8">_ contactos</p>
          <div className="grid border-y border-white/10 lg:grid-cols-2">
            <article className="py-10 lg:pr-12">
              <p className="section-kicker mb-4">_ whatsapp</p>
              <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
                O canal principal.
              </h2>
              <p className="mt-5 text-white/55 leading-relaxed">
                Atendimento humano, todos os dias das 09h às 22h. Emergências
                técnicas com prioridade.
              </p>
              <p className="mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                {formatWhatsApp(contactInfo.whatsapp)}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Horário
                  </dt>
                  <dd className="mt-1 text-sm text-white">09h — 22h</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Prioridade
                  </dt>
                  <dd className="mt-1 text-sm text-white">Técnica</dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn-primary mt-8"
                onClick={() => setIsUrgentModalOpen(true)}
              >
                Abrir WhatsApp
              </button>
            </article>

            <article className="border-t border-white/10 py-10 lg:border-l lg:border-t-0 lg:pl-12">
              <p className="section-kicker mb-4">_ e-mail</p>
              <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
                Para o que não é urgente.
              </h2>
              <p className="mt-5 text-white/55 leading-relaxed">
                Questões com mais detalhe. Resposta em até 24 horas úteis.
              </p>
              <p className="mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-white break-all">
                {contactInfo.email}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Resposta
                  </dt>
                  <dd className="mt-1 text-sm text-white">Até 24h úteis</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Para
                  </dt>
                  <dd className="mt-1 text-sm text-white">Não urgente</dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn-ghost mt-8"
                onClick={() => setIsEmailModalOpen(true)}
              >
                Enviar e-mail
              </button>
            </article>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="section-kicker mb-4">_ relatar</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Algo a falhar no ecrã?
            </h2>
            <p className="mt-3 max-w-md text-white/50">
              Diz o dispositivo, o pacote e o que vês. A equipa trata no
              WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="btn-ghost shrink-0"
          >
            Relatar problema
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={isUrgentModalOpen}
        title="Suporte WhatsApp"
        submitLabel="Enviar pelo WhatsApp"
        onClose={() => setIsUrgentModalOpen(false)}
        onSubmit={({ name, email, location }) => {
          const message = [
            'Olá! Preciso de suporte técnico.',
            '',
            'Dados do cliente:',
            `- Nome: ${name}`,
            `- E-mail: ${email}`,
            `- Localização: ${location}`,
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
          ].join('\n');
          sendEmail(contactInfo.email, subject, body);
          setIsEmailModalOpen(false);
        }}
      />

      <ContactModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Relatar problema"
        submitLabel="Enviar pelo WhatsApp"
        onSubmit={({ name, email, location }) => {
          const message = [
            'Olá! Quero relatar um problema com o serviço Plural.',
            '',
            'Dados:',
            `- Nome: ${name}`,
            `- E-mail: ${email}`,
            `- Localização: ${location}`,
          ].join('\n');
          openWhatsApp(contactInfo.whatsapp, message);
          setIsReportModalOpen(false);
        }}
      />
    </section>
  );
};

export default Support;
