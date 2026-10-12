import { Helmet } from 'react-helmet-async';

const SEOHead = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Plural",
    "description": "Streaming TV ao vivo premium em Angola com mais de 5.000 canais, filmes e séries",
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
      "name": "Streaming TV ao vivo Premium Angola",
      "description": "Serviço de streaming TV ao vivo com mais de 5.000 canais, filmes e séries",
      "category": "Entertainment",
      "availability": "https://schema.org/InStock"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Streaming TV ao vivo Premium Angola",
    "description": "Serviço de streaming TV ao vivo com mais de 5.000 canais, filmes e séries",
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
      "name": "Planos de streaming TV ao vivo",
      "description": "Planos mensais, trimestrais e anuais para streaming TV ao vivo",
      "availability": "https://schema.org/InStock"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Plural Streaming TV ao vivo Angola",
    "url": "https://plural.ao",
    "description": "Streaming TV ao vivo premium em Angola com mais de 5.000 canais, filmes e séries",
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
