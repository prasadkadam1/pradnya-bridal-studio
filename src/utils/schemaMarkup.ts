/**
 * SEO Schema Markup Utilities (JSON-LD)
 * Target Areas: Pune, Talegaon, Pimpri-Chinchwad, Hinjewadi, Wakad
 */

export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Pradnya Bridal Beauty Studio",
    "image": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
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
