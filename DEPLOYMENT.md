# Guia de Deploy - Plural

Este documento contém instruções detalhadas para fazer o deploy do site da Plural em diferentes plataformas.

## 🚀 Deploy no Vercel (Recomendado)

### 1. Preparação
1. Crie uma conta no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub/GitLab
3. Configure as variáveis de ambiente

### 2. Variáveis de Ambiente no Vercel
```bash
VITE_WHATSAPP_NUMBER=+244123456789
VITE_EMAIL=contato@plural.ao
VITE_SITE_URL=https://plural.ao
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 3. Deploy Automático
- O Vercel fará deploy automático a cada push para a branch `main`
- O build será executado automaticamente
- O site estará disponível em `https://seu-projeto.vercel.app`

## 🌐 Deploy no Netlify

### 1. Preparação
1. Crie uma conta no [Netlify](https://netlify.com)
2. Conecte seu repositório

### 2. Configurações de Build
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### 3. Variáveis de Ambiente
Configure as mesmas variáveis de ambiente no painel do Netlify.

## 🐳 Deploy com Docker

### 1. Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Build e Deploy
```bash
docker build -t plural .
docker run -p 80:80 plural
```

## 📱 Deploy para Produção

### 1. Checklist Pré-Deploy
- [ ] Teste local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] SEO otimizado
- [ ] Performance otimizada
- [ ] Testes passando

### 2. Build de Produção
```bash
npm run build
```

### 3. Teste Local da Build
```bash
npm run preview
```

## 🔧 Configurações de Domínio

### 1. Domínio Personalizado
1. Configure o DNS apontando para o servidor
2. Adicione o domínio na plataforma de deploy
3. Configure SSL/HTTPS

### 2. Subdomínios
- `www.plural.ao` → `plural.ao`
- `api.plural.ao` → API (futuro)
- `admin.plural.ao` → Painel admin (futuro)

## 📊 Monitoramento

### 1. Google Analytics
- Configure o GA4 no painel
- Adicione o ID de rastreamento
- Monitore conversões

### 2. Performance
- Use Lighthouse para auditorias
- Monitore Core Web Vitals
- Configure alertas de performance

### 3. Uptime
- Configure monitoramento de uptime
- Configure alertas de downtime
- Monitore logs de erro

## 🔒 Segurança

### 1. Headers de Segurança
```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 2. HTTPS
- Force HTTPS em produção
- Configure HSTS
- Use certificados SSL válidos

### 3. CSP (Content Security Policy)
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build falhando**
   - Verifique as dependências
   - Confirme versão do Node.js
   - Verifique logs de erro

2. **Página não encontrada (404)**
   - Configure redirecionamentos SPA
   - Verifique rotas do React Router

3. **Performance lenta**
   - Otimize imagens
   - Configure cache
   - Use CDN

4. **WhatsApp não funciona**
   - Verifique número do WhatsApp
   - Teste em diferentes dispositivos

## 📞 Suporte

Para problemas de deploy:
- **Vercel**: [docs.vercel.com](https://docs.vercel.com)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Equipe Plural**: suporte@plural.ao

---

**Última atualização**: Janeiro 2024
