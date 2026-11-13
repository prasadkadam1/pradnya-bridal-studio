import { STUDIO_NAME } from '../config/siteFeatures';

/**
 * SEO Schema Markup Utilities (JSON-LD)
 * Target Areas: Pune, Talegaon, Pimpri-Chinchwad, Hinjewadi, Wakad
 */

export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": STUDIO_NAME,
    "telephone": "+917040496065",
    "image": [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    "@id": "https://pradnyabridalstudio.com/#beauty-salon",
    "url": "https://pradnyabridalstudio.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Siddharth Heights, opposite Balgandharva, J.M. Road, Shivajinagar",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "411005",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.525287,
      "longitude": 73.844390
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://instagram.com/pradnyabridal"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Pune"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Pimpri-Chinchwad"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Talegaon Dabhade"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Hinjewadi"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Wakad"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Baner"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Chakan"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Nigdi"
      }
    ]
  };
};

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": STUDIO_NAME,
  "url": "https://pradnyabridalstudio.com/",
  "inLanguage": "en-IN",
});

export const getArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  author: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "mainEntityOfPage": { "@type": "WebPage", "@id": article.url },
  "image": article.image || undefined,
  "datePublished": article.datePublished,
  "author": { "@type": "Person", "name": article.author },
  "publisher": { "@type": "Organization", "name": STUDIO_NAME, "url": "https://pradnyabridalstudio.com/" },
});

export const getServiceSchema = (service: {
  title: string;
  description: string;
  url: string;
  price: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.title,
  "description": service.description,
  "url": service.url,
  "provider": { "@type": "BeautySalon", "name": STUDIO_NAME, "url": "https://pradnyabridalstudio.com/" },
  "areaServed": { "@type": "City", "name": "Pune" },
  "offers": { "@type": "Offer", "priceCurrency": "INR", "price": service.price },
});

