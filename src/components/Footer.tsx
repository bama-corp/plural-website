import { Link } from 'react-router-dom';
import { useState } from 'react';
import { openWhatsApp } from '../utils/helpers';
import { contactInfo, socialMedia } from '../data/mockData';
import pluralMark from '../assets/images/logos/plural-mark.png';
import pluralWordmark from '../assets/images/logos/plural-wordmark.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      return;
    }

    openWhatsApp(
      contactInfo.whatsapp,
      `📧 NOVA INSCRIÇÃO NA NEWSLETTER PLURAL\n\nE-mail: ${email}\n\nData: ${new Date().toLocaleDateString('pt-AO')}`
    );
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end mb-16 pb-16 border-b border-white/10">
          <div>
            <p className="section-kicker mb-4">_ newsletter</p>
            <h2 className="!text-3xl sm:!text-4xl font-extrabold tracking-[-0.03em] text-white">
              Queres ficar a par?
            </h2>
            <p className="mt-3 text-white/50 max-w-md">
              Novidades, conteúdos e ofertas. Sem spam.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="O teu e-mail"
              className="flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscrever
            </button>
          </form>
          {status === 'success' && (
            <p className="lg:col-span-2 text-sm text-white/60">Inscrição enviada. Confirma no WhatsApp.</p>
          )}
          {status === 'error' && (
            <p className="lg:col-span-2 text-sm text-white/70">Insere um e-mail válido.</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src={pluralMark} alt="" className="w-8 h-8 object-contain" />
              <img src={pluralWordmark} alt="plural" className="h-5 w-auto object-contain" />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              IPTV premium para Angola.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Recursos</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/planos" className="hover:text-white">Planos</Link></li>
              <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/suporte" className="hover:text-white">Suporte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Empresa</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
              <li><Link to="/indique" className="hover:text-white">Indique um amigo</Link></li>
              <li><Link to="/revendedor" className="hover:text-white">Revendedores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Contacto</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>{contactInfo.whatsapp}</li>
              <li>{contactInfo.email}</li>
              <li>
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-white/35">
          <span>© {currentYear} Plural. Todos os direitos reservados.</span>
          <span>Feito para Angola.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
