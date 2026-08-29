import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PluralScrollbar from './components/PluralScrollbar';
import Home from './pages/Home';
import PlansPage from './pages/PlansPage';
import CatalogPage from './pages/CatalogPage';
import ReferralPage from './pages/ReferralPage';
import ResellerPage from './pages/ResellerPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import SupportPage from './pages/SupportPage';
import { initGA } from './utils/analytics';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-black text-white">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planos" element={<PlansPage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/indique" element={<ReferralPage />} />
              <Route path="/revendedor" element={<ResellerPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/suporte" element={<SupportPage />} />
            </Routes>
            <Footer />
            <PluralScrollbar />
            <ScrollToTop />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
