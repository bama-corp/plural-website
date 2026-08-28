# Plural - Site IPTV Premium

Site moderno e responsivo para a empresa Plural, especializada em serviços IPTV de alta qualidade.

## 🚀 Tecnologias Utilizadas

- **Vite** - Build tool rápida e moderna
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **React Router** - Roteamento da aplicação

## 📋 Funcionalidades

### ✅ Implementadas
- **Design Responsivo** - Otimizado para mobile, tablet e desktop
- **Animações Suaves** - Transições e animações com Framer Motion
- **SEO Otimizado** - Meta tags e estrutura semântica
- **Integração WhatsApp** - Botões de contato direto
- **Navegação Suave** - Scroll suave entre seções
- **Componentes Modulares** - Código organizado e reutilizável

### 🎯 Seções do Site
1. **Hero Section** - Banner principal com call-to-action
2. **Planos e Preços** - Tabela de planos com comparação
3. **Catálogo** - Categorias de conteúdo disponível
4. **Sobre a Empresa** - Missão, visão e valores
5. **Suporte/FAQ** - Perguntas frequentes e contatos
6. **Footer** - Links e informações de contato

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd plural-website
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto em modo desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse o site**
```
http://localhost:3000
```

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── Hero.tsx        # Banner principal
│   ├── PricingPlans.tsx # Seção de planos
│   ├── Catalog.tsx     # Catálogo de conteúdo
│   ├── About.tsx       # Sobre a empresa
│   ├── Support.tsx     # Suporte e FAQ
│   ├── Footer.tsx      # Rodapé
│   └── WhatsAppFloat.tsx # Botão flutuante WhatsApp
├── pages/              # Páginas da aplicação
│   └── Home.tsx        # Página principal
├── hooks/              # Hooks customizados
│   ├── useScrollPosition.ts
│   └── useIntersectionObserver.ts
├── utils/              # Funções utilitárias
│   └── helpers.ts
├── types/              # Definições TypeScript
│   └── index.ts
├── data/               # Dados mockados
│   └── mockData.ts
├── App.tsx             # Componente principal
├── main.tsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🎨 Design System

### Cores Principais
- **Primary**: Azul (#3B82F6) - Tecnologia e confiança
- **Secondary**: Roxo (#A855F7) - Inovação e modernidade
- **Accent**: Verde (#22C55E) - Sucesso e ação
- **Neutral**: Tons de cinza para texto e fundos

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

### Componentes
- Botões com gradientes e hover effects
- Cards com sombras e animações
- Navegação responsiva
- Animações de entrada e transições

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Configurações

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_WHATSAPP_NUMBER=+244123456789
VITE_EMAIL=contato@plural.ao
VITE_SITE_URL=https://plural.ao
```

### Personalização
- Edite os dados em `src/data/mockData.ts`
- Modifique as cores em `tailwind.config.js`
- Ajuste as animações em `src/index.css`

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Faça build: `npm run build`
2. Faça upload da pasta `dist/`
3. Configure as variáveis de ambiente

### Outros
O projeto pode ser deployado em qualquer servidor estático que suporte SPA.

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **WhatsApp**: +244123456789
- **E-mail**: contato@plural.ao

## 📄 Licença

Este projeto é propriedade da Plural e está protegido por direitos autorais.

---

**Desenvolvido com ❤️ para a Plural**
