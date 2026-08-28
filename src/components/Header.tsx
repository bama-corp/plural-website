import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import pluralMark from '../assets/images/logos/plural-mark.png';
import pluralWordmark from '../assets/images/logos/plural-wordmark.png';

const navItems = [
  { name: 'Planos', href: '/planos' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Indique', href: '/indique' },
  { name: 'Revendedores', href: '/revendedor' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Suporte', href: '/suporte' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();
  const location = useLocation();

  useEffect(() => {
    setIsScrolled(scrollPosition > 24);
  }, [scrollPosition]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5"
            aria-label="Plural — página inicial"
          >
            <img
              src={pluralMark}
              alt=""
              className="w-8 h-8 object-contain"
            />
            <img
              src={pluralWordmark}
              alt="plural"
              className="h-5 w-auto object-contain hidden xs:block"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-6"
            role="navigation"
            aria-label="Menu principal"
          >
            {navItems.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className={`text-[13px] tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link to="/planos" onClick={handleNavClick} className="btn-primary !py-2 !px-5 text-sm">
              Começar
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-[640px] opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col border-t border-white/10 pt-4">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={`px-1 py-3 text-base ${
                  location.pathname === item.href
                    ? 'text-white'
                    : 'text-white/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/planos"
              onClick={handleNavClick}
              className="btn-primary mt-4 text-center"
            >
              Começar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
