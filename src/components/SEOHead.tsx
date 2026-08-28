import { Helmet } from 'react-helmet-async';

const SEOHead = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Plural",
    "description": "IPTV Premium Angola com mais de 5.000 canais, filmes e séries",
    "url": "https://plural.ao",
    "logo": "https://plural.ao/favicon.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Portuguese",
      "areaServed": "AO"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AO",
      "addressRegion": "Luanda"
    },
    "sameAs": [
      "https://plural.ao"
    ],
    "offers": {
      "@type": "Offer",
      "name": "IPTV Premium Angola",
      "description": "Serviço de IPTV com mais de 5.000 canais, filmes e séries",
      "category": "Entertainment",
      "availability": "https://schema.org/InStock"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "IPTV Premium Angola",
    "description": "Serviço de streaming IPTV com mais de 5.000 canais, filmes e séries",
    "provider": {
      "@type": "Organization",
      "name": "Plural"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Angola"
    },
    "serviceType": "Entertainment Streaming",
    "offers": {
      "@type": "Offer",
      "name": "Planos IPTV",
      "description": "Planos mensais, trimestrais e anuais para IPTV",
      "availability": "https://schema.org/InStock"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Plural IPTV Angola",
    "url": "https://plural.ao",
    "description": "IPTV Premium Angola com mais de 5.000 canais, filmes e séries",
    "publisher": {
      "@type": "Organization",
      "name": "Plural"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://plural.ao/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
