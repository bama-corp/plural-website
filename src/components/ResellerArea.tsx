import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo } from '../data/mockData';
import TextReel from './TextReel';

const kz = (value: number) => `${value.toLocaleString('pt-PT')} Kz`;

const tiers = [
  {
    id: 'iniciante',
    name: 'Nível 1',
    subtitle: 'A começar',
    minPurchases: 1,
    pricePerActivation: 7000,
    suggestedSalePrice: 9500,
    averageProfit: 2500,
    details: [
      'Compra mínima: 1 activação',
      'Margem de entrada',
      'Painel, login e banca próprios',
      'Activação rápida',
    ],
  },
  {
    id: 'intermediario',
    name: 'Nível 2',
    subtitle: 'Já a vender',
    minPurchases: 5,
    pricePerActivation: 6000,
    suggestedSalePrice: 9500,
    averageProfit: 3500,
    details: [
      'Compra mínima: 5 activações',
      'Margem média',
      'BÁSICO e ULTIMATE',
      'Vários servidores',
    ],
  },
  {
    id: 'profissional',
    name: 'Nível 3',
    subtitle: 'Volume',
    minPurchases: 10,
    pricePerActivation: 5000,
    suggestedSalePrice: 9500,
    averageProfit: 4500,
    details: [
      'Compra mínima: 10 activações',
      'Boa margem',
      'Mais servidores',
      'Suporte prioritário',
    ],
  },
  {
    id: 'master',
    name: 'Master',
    subtitle: 'Rede e margem',
    minPurchases: 20,
    pricePerActivation: 4000,
    suggestedSalePrice: 9500,
    averageProfit: 5500,
    highlight: true,
    details: [
      'Compra mínima: 20 activações',
      'Maior margem',
      'Todos os servidores',
      'Subrevendedores',
      'Canal directo com a administração',
    ],
  },
];

const perks = [
  {
    title: 'Painel',
    text: 'Login teu, banca tua. Vês activações e contas sem pedir a ninguém.',
  },
  {
    title: 'Activação',
    text: 'O cliente paga, activas. O processo é curto — sem papelada.',
  },
  {
    title: 'Suporte',
    text: 'A equipa trata do cliente final. Tu falas connosco só sobre a banca.',
  },
  {
    title: 'Materiais',
    text: 'Banners, textos e o visual da marca. Chegam no WhatsApp e no e-mail.',
  },
  {
    title: 'Servidores',
    text: 'Acesso cresce com o nível — do essencial até à rede completa no Master.',
  },
  {
    title: 'Estabilidade',
    text: 'Se a rede falhar em bloco, os dias são repostos. Não ficas a gerir o incidente.',
  },
];

const rules = [
  {
    title: 'Quem atende',
    text: 'O cliente final fala com a Plural. O revendedor não faz suporte.',
  },
  {
    title: 'O teu papel',
    text: 'Indicas, activas a banca, cobras o preço. O resto fica connosco.',
  },
  {
    title: 'Preço',
    text: 'Não se vende abaixo de 9.500 Kz por activação. Protege o mercado e os outros revendedores.',
  },
  {
    title: 'Banca',
    text: 'Cada um gere só a sua. Sem passar painéis sem autorização.',
  },
  {
    title: 'Falhas',
    text: 'Falhas globais: reposição de dias. Não precisas de negociar isso com o cliente.',
  },
  {
    title: 'Master',
    text: 'Prioridade no suporte, canal directo e possibilidade de subrevenda.',
  },
];

const faqItems = [
  {
    question: 'Quem atende os clientes finais?',
    answer:
      'A Plural. Tu indicas e activas; a instalação, as dúvidas e os problemas ficam com a equipa. Mantém o padrão e tira-te o suporte do dia-a-dia.',
  },
  {
    question: 'Qual é a compra mínima?',
    answer:
      'Nível 1: 1 activação. Nível 2: 5. Nível 3: 10. Master: 20. Sem taxa de entrada — compras o mínimo do nível.',
  },
  {
    question: 'Posso vender abaixo de 9.500 Kz?',
    answer:
      'Não. O preço sugerido de 9.500 Kz é o mínimo. Assim o mercado não se desfaz e todos os revendedores ficam no mesmo patamar.',
  },
  {
    question: 'Como chegam os materiais?',
    answer:
      'Depois da aprovação, envio no WhatsApp e no e-mail: banners, textos e o padrão visual.',
  },
  {
    question: 'E se a rede falhar?',
    answer:
      'Em falhas globais, os dias são repostos. Não tens de gerir o incidente com o cliente — isso é da Plural.',
  },
  {
    question: 'O Master pode ter subrevendedores?',
    answer:
      'Sim. Além disso tem todos os servidores e canal directo com a administração.',
  },
  {
    question: 'Preciso de investimento inicial?',
    answer:
      'Não há taxa de entrada. Compras o mínimo de activações do nível que escolheres. Tudo digital.',
  },
  {
    question: 'Como é o suporte ao revendedor?',
    answer:
      'Canal próprio, não é o mesmo do cliente. O Master tem prioridade e fala directo com a administração.',
  },
];

const fieldClass =
  'w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white';

const ResellerArea = () => {
  const { ref, hasIntersected } = useIntersectionObserver();
  const [selectedId, setSelectedId] = useState('master');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    experience: '',
    howDidYouKnow: '',
    message: '',
    acceptTerms: false,
  });

  const selected = tiers.find(tier => tier.id === selectedId) ?? tiers[3];

  const scrollToForm = () => {
    document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = [
      'Candidatura a revendedor Plural.',
      '',
      `Nível: ${selected.name}`,
      `Nome: ${formData.name}`,
      `E-mail: ${formData.email}`,
      `WhatsApp: ${formData.whatsapp}`,
      `Experiência: ${formData.experience || 'Não indicada'}`,
      `Como conheceu: ${formData.howDidYouKnow || 'Não indicado'}`,
      `Mensagem: ${formData.message || '—'}`,
    ].join('\n');
    openWhatsApp(contactInfo.whatsapp, message);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      experience: '',
      howDidYouKnow: '',
      message: '',
      acceptTerms: false,
    });
  };

  return (
    <section id="revendedor" className="py-20 sm:py-28 bg-black">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="mx-auto max-w-4xl"
        >
          <p className="section-kicker mb-5">{'{ REVENDEDORES }'} _</p>
          <h1 className="!text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
            Tu vendes.{' '}
            <span className="italic font-light">Nós tratamos do resto.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/55 font-light leading-relaxed">
            Indicas o cliente, a Plural instala e atende. Quatro níveis, margem
            clara, sem taxa de entrada.
          </p>
          <button type="button" onClick={scrollToForm} className="btn-primary mt-10">
            Quero ser revendedor
          </button>
        </motion.div>

        <div className="mx-auto mt-16 sm:mt-20 grid max-w-4xl grid-cols-2 gap-y-8 gap-x-6 border-y border-white/10 py-10 sm:grid-cols-4">
          {[
            { value: '4', label: 'Níveis' },
            { value: '5.500', label: 'Lucro até, Kz' },
            { value: '9.500', label: 'Venda mín., Kz' },
            { value: '0', label: 'Taxa de entrada' },
          ].map(stat => (
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
            <p className="section-kicker mb-4">_ tu vendes</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              O cliente chega por ti.
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Indicas, explicas o pacote, activas na banca. Sem suporte no
              WhatsApp do cliente, sem instalar TV Box, sem gerir avarias.
            </p>
          </div>
          <div>
            <p className="section-kicker mb-4">_ nós atendemos</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              A marca fala com ele.
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed">
              Instalação, dúvidas e problemas ficam na Plural. Atendimento
              igual para todos — e tu ficas só com a venda.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-8">_ os níveis</p>
          <article className="overflow-hidden rounded-md border border-white/10 bg-[#0a0a0a]">
            <div className="border-b border-white/10">
              {tiers.map(tier => {
                const active = tier.id === selectedId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedId(tier.id)}
                    className={`flex w-full items-baseline justify-between gap-4 border-b border-white/10 px-6 py-5 text-left last:border-b-0 sm:px-7 ${
                      active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>
                      <span
                        className={`block text-lg font-semibold tracking-tight ${
                          active ? 'text-white' : 'text-white/55'
                        }`}
                      >
                        {tier.name}
                      </span>
                      <span className="mt-1 block text-sm text-white/40">
                        {tier.subtitle} · mín. {tier.minPurchases}{' '}
                        {tier.minPurchases === 1 ? 'activação' : 'activações'}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-right text-xl font-semibold tabular-nums ${
                        tier.highlight ? 'pack-silver-price' : 'text-white'
                      }`}
                    >
                      {kz(tier.averageProfit)}
                      <span className="ml-1 text-xs font-normal text-white/35">
                        lucro
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-6 sm:px-7">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
                <span>Custo {kz(selected.pricePerActivation)}</span>
                <span>Venda {kz(selected.suggestedSalePrice)}</span>
                <span>Lucro {kz(selected.averageProfit)}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {selected.details.map(item => (
                  <li key={item} className="text-sm leading-relaxed text-white/65">
                    {item}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={scrollToForm} className="btn-primary mt-8 w-full">
                Candidatar-me ao {selected.name}
              </button>
            </div>
          </article>
          <p className="mt-4 text-sm text-white/40">
            Valores de base para o BÁSICO a 9.500 Kz. Podem ajustar-se; o
            mínimo de venda mantém-se.
          </p>
        </div>

        <div className="mx-auto mt-20 sm:mt-28 max-w-6xl grid border-y border-white/10 lg:grid-cols-2">
          <div className="py-10 lg:pr-12">
            <p className="section-kicker mb-8">_ o que recebes</p>
            <table className="w-full text-left">
              <tbody>
                {perks.map(item => (
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

        <div className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-8 text-center">_ perguntas</p>
          <TextReel
            enabled={hasIntersected}
            items={faqItems.map(item => ({
              id: item.question,
              label: item.question,
              content: item.answer,
            }))}
          />
        </div>

        <div id="candidatura" className="mx-auto mt-20 sm:mt-28 max-w-4xl">
          <p className="section-kicker mb-4">_ candidatura</p>
          <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
            Envia pelo WhatsApp.
          </h2>
          <p className="mt-4 max-w-xl text-white/50">
            Nível seleccionado: {selected.name}. A equipa responde com os
            próximos passos.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="reseller-name" className="mb-2 block text-sm text-white/55">
                Nome completo
              </label>
              <input
                id="reseller-name"
                type="text"
                required
                value={formData.name}
                onChange={event =>
                  setFormData({ ...formData, name: event.target.value })
                }
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="reseller-email" className="mb-2 block text-sm text-white/55">
                  E-mail
                </label>
                <input
                  id="reseller-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={event =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="reseller-whatsapp" className="mb-2 block text-sm text-white/55">
                  WhatsApp
                </label>
                <input
                  id="reseller-whatsapp"
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={event =>
                    setFormData({ ...formData, whatsapp: event.target.value })
                  }
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reseller-experience" className="mb-2 block text-sm text-white/55">
                Experiência em vendas (opcional)
              </label>
              <textarea
                id="reseller-experience"
                rows={3}
                value={formData.experience}
                onChange={event =>
                  setFormData({ ...formData, experience: event.target.value })
                }
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="reseller-source" className="mb-2 block text-sm text-white/55">
                Como conheceste a Plural?
              </label>
              <select
                id="reseller-source"
                value={formData.howDidYouKnow}
                onChange={event =>
                  setFormData({ ...formData, howDidYouKnow: event.target.value })
                }
                className={fieldClass}
              >
                <option value="" className="bg-black">
                  Selecciona…
                </option>
                <option value="google" className="bg-black">
                  Google
                </option>
                <option value="facebook" className="bg-black">
                  Facebook
                </option>
                <option value="instagram" className="bg-black">
                  Instagram
                </option>
                <option value="indicacao" className="bg-black">
                  Indicação
                </option>
                <option value="outro" className="bg-black">
                  Outro
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="reseller-message" className="mb-2 block text-sm text-white/55">
                Mensagem (opcional)
              </label>
              <textarea
                id="reseller-message"
                rows={4}
                value={formData.message}
                onChange={event =>
                  setFormData({ ...formData, message: event.target.value })
                }
                className={fieldClass}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-white/50">
              <input
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={event =>
                  setFormData({ ...formData, acceptTerms: event.target.checked })
                }
                className="mt-1 accent-white"
              />
              Aceito as regras do programa de revendedores.
            </label>

            <button type="submit" className="btn-primary">
              Enviar candidatura
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResellerArea;
