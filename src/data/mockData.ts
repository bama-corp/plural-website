import {
  Plan,
  Category,
  FAQ,
  BlogPost,
  ContactInfo,
  SocialMedia,
} from '../types';

export const plans: Plan[] = [
  {
    id: 'basico',
    name: 'BÁSICO',
    price: 9500.0,
    period: 'monthly',
    features: [
      'Canais brasileiros',
      '(sem internacionais)',
      'Até 2.000 canais ao vivo',
      '+ 12.000 filmes',
      '+ 6.000 séries',
      'Qualidade HD/FHD',
      'Sem limite de dispositivos',
    ],
  },
  {
    id: 'ultimate',
    name: 'ULTIMATE',
    price: 12500.0,
    period: 'monthly',
    features: [
      'BÁSICO',
      'Canais brasileiros',
      'Canais internacionais completos',
      'Até 6.000 canais ao vivo',
      '+ 33.000 filmes',
      '+ 15.000 séries',
      'Qualidade HD/FHD/4K',
      'Canais premium exclusivos',
      'Backup de 2 meses grátis',
    ],
  },
  {
    id: 'room',
    name: 'ROOM',
    price: 5000.0,
    period: 'monthly',
    features: [
      'Netflix na Plural',
      'Perfil numa sala partilhada',
      'Um ecrã de cada vez',
      'Qualidade HD/FHD/4K',
    ],
  },
  {
    id: 'solo',
    name: 'SOLO',
    price: 16500.0,
    period: 'monthly',
    features: [
      'Netflix exclusiva',
      'Conta só tua',
      'Qualidade HD/FHD/4K',
      'Sem partilha de ecrã',
    ],
  },
];

export const categories: Category[] = [
  {
    id: 'movies',
    name: 'Filmes',
    icon: 'Film',
    description: 'Milhares de filmes dos mais variados gêneros',
    contentCount: 15000,
  },
  {
    id: 'series',
    name: 'Séries',
    icon: 'Tv',
    description: 'Séries completas e episódios atualizados',
    contentCount: 8000,
  },
  {
    id: 'sports',
    name: 'Esportes',
    icon: 'Trophy',
    description: 'Canais esportivos nacionais e internacionais',
    contentCount: 500,
  },
  {
    id: 'kids',
    name: 'Infantis',
    icon: 'Baby',
    description: 'Conteúdo educativo e entretenimento para crianças',
    contentCount: 300,
  },
  {
    id: 'news',
    name: 'Notícias',
    icon: 'Newspaper',
    description: 'Canais de notícias 24 horas',
    contentCount: 200,
  },
  {
    id: 'adult',
    name: 'Adultos',
    icon: 'Heart',
    description: 'Conteúdo adulto exclusivo',
    contentCount: 2000,
  },
  {
    id: 'music',
    name: 'Música',
    icon: 'Music',
    description: 'Canais de música e videoclipes',
    contentCount: 1500,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    icon: 'Globe',
    description: 'Séries e filmes da Netflix',
    contentCount: 5000,
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Como instalar o IPTV da Plural?',
    answer:
      'O processo é simples! Após a assinatura, você receberá as credenciais de acesso e instruções detalhadas de instalação para seu dispositivo. Nossa equipe também oferece suporte remoto para instalação.',
    category: 'installation',
  },
  {
    id: '2',
    question: 'Quais dispositivos são compatíveis?',
    answer:
      'A Plural é compatível com Smart TVs (Samsung, LG, Android TV e muitas mais), smartphones (Android e iOS), tablets, computadores (Windows, Mac, Linux) e dispositivos Android TV Box.',
    category: 'devices',
  },
  {
    id: '3',
    question: 'Como funciona o pagamento?',
    answer:
      'Aceitamos pagamentos via cartão de crédito/débito(BAI, BFA, Standard Bank, Millenium Atlantico e muito mais), transferência bancária e por serviços(Multicaixa Express e KWiK). O pagamento é processado de forma segura e você recebe acesso imediato após a confirmação.',
    category: 'payment',
  },
  {
    id: '4',
    question: 'Posso assistir em múltiplos dispositivos?',
    answer:
      'Sim! Não há limite de dispositivos. Você pode assistir em quantos aparelhos quiser simultaneamente com uma única assinatura. Mais o recomendado é assistir em mais de 4 dispositivos simultaneamente.',
    category: 'general',
  },
  {
    id: '5',
    question: 'Qual a qualidade do streaming?',
    answer:
      'Oferecemos qualidade SD, HD, Full HD (1080p) e 4K para a maioria dos canais e conteúdos. A qualidade pode variar dependendo da sua conexão com a internet.',
    category: 'general',
  },
  {
    id: '6',
    question: 'O suporte técnico está disponível 24/7?',
    answer:
      'Sim! Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por semana através do WhatsApp e e-mail para ajudar com qualquer dúvida ou problema.',
    category: 'general',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como escolher o melhor plano IPTV para você',
    excerpt:
      'Descubra qual plano da Plural se adapta melhor às suas necessidades de entretenimento.',
    content: 'Conteúdo completo do blog...',
    image: '/blog/planos-iptv.jpg',
    date: '2024-01-15',
    author: 'Equipe Plural',
    tags: ['planos', 'iptv', 'dicas'],
  },
  {
    id: '2',
    title: 'Top 10 filmes para assistir este mês',
    excerpt:
      'Confira nossa seleção dos melhores filmes disponíveis na plataforma Plural.',
    content: 'Conteúdo completo do blog...',
    image: '/blog/filmes-destaque.jpg',
    date: '2024-01-10',
    author: 'Equipe Plural',
    tags: ['filmes', 'destaques', 'entretenimento'],
  },
  {
    id: '3',
    title: 'Configurando sua Smart TV para IPTV',
    excerpt:
      'Guia passo a passo para configurar o IPTV da Plural em sua Smart TV.',
    content: 'Conteúdo completo do blog...',
    image: '/blog/smart-tv-config.jpg',
    date: '2024-01-05',
    author: 'Equipe Plural',
    tags: ['configuração', 'smart-tv', 'tutorial'],
  },
];

export const contactInfo: ContactInfo = {
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '+244933623143',
  email: import.meta.env.VITE_EMAIL || 'pacaviraholding@gmail.com',
  phone: import.meta.env.VITE_WHATSAPP_NUMBER || '+244933623143',
};

export const socialMedia: SocialMedia = {
  facebook: 'https://facebook.com/plural',
  instagram: 'https://www.instagram.com/plural',
  twitter: 'https://twitter.com/plural',
  youtube: 'https://youtube.com/plural',
  tiktok: 'https://tiktok.com/@plural',
};
