import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { FloatingCTA } from '../ui/FloatingCTA';
import updateSEOMetadata, { getCanonicalUrl } from '../../services/seo';
import { getBreadcrumbSchema, getLocalBusinessSchema, getWebSiteSchema } from '../../utils/schemaMarkup';
import { MEHENDI_ENABLED, STUDIO_NAME } from '../../config/siteFeatures';

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
    const pageMap: Record<string, { title: string; description: string }> = {
      '/': {
        title: MEHENDI_ENABLED ? 'Luxury Bridal Mehendi & Makeup Services in Pune' : 'Bridal Makeup Artist & Hair Styling in Pune',
        description: MEHENDI_ENABLED ? 'Premium bridal mehendi, makeup, hair styling, and saree draping in Pune, PCMC, Hinjewadi, Wakad, and nearby wedding locations.' : 'Bridal makeup, reception glam, hair styling, and saree draping in Pune, PCMC, Hinjewadi, Wakad, and nearby wedding locations.',
      },
      '/services': {
        title: MEHENDI_ENABLED ? 'Bridal Mehendi, Makeup & Hair Styling Services' : 'Bridal Makeup, Reception Glam & Hair Styling',
        description: MEHENDI_ENABLED ? 'Explore bridal mehendi, bridal makeup, engagement looks, family mehendi, reception makeup, party makeup and hair styling in Pune.' : 'Explore HD bridal makeup, airbrush looks, engagement styling, reception makeup, and professional hair styling in Pune.',
      },
      '/portfolio': {
        title: MEHENDI_ENABLED ? 'Bridal Mehendi & Makeup Portfolio' : 'Bridal Makeup Portfolio',
        description: MEHENDI_ENABLED ? 'Browse real bridal mehendi designs, makeup looks and wedding transformations by Pradnya Bridal Studio in Pune.' : 'Browse bridal makeup, reception glam, and wedding transformations by Pradnya Bridal Makeup Studio in Pune.',
      },
      '/before-after': {
        title: 'Before and After Transformations',
        description: 'See real bridal beauty transformations with interactive before and after comparisons.',
      },
      '/packages': {
        title: MEHENDI_ENABLED ? 'Bridal Packages' : 'Bridal Makeup Packages',
        description: MEHENDI_ENABLED ? 'Compare premium bridal mehendi and makeup packages for intimate functions and full wedding ceremonies.' : 'Compare bridal makeup and hair styling packages for wedding ceremonies, receptions, and celebrations.',
      },
      '/about': {
        title: `About ${STUDIO_NAME}`,
        description: 'Meet Pradnya Kadam and learn about her bridal makeup artistry, experience, and client-first approach.',
      },
      '/testimonials': {
        title: MEHENDI_ENABLED ? 'Bridal Makeup & Mehendi Reviews' : 'Bridal Makeup Reviews',
        description: `Read approved client reviews and wedding stories from clients of ${STUDIO_NAME} in Pune.`,
      },
      '/contact': {
        title: `Contact ${STUDIO_NAME}`,
        description: 'Send an inquiry, call, WhatsApp, or find the studio in Shivajinagar, Pune.',
      },
      '/availability': {
        title: 'Check Bridal Artist Availability',
        description: MEHENDI_ENABLED ? 'Check your wedding date and enquire about bridal mehendi, makeup and styling availability in Pune.' : 'Check your wedding date and enquire about bridal makeup and styling availability in Pune.',
      },
    };

    const serviceSlug = normalizedPathname.startsWith('/services/') ? normalizedPathname.split('/').filter(Boolean).at(-1) : undefined;
    const metadata = pageMap[normalizedPathname]
      || (serviceSlug ? { title: MEHENDI_ENABLED ? `${serviceSlug.replaceAll('-', ' ')} Bridal Beauty Service` : 'Bridal Makeup Services in Pune', description: `Explore bridal beauty service details, pricing, and booking information from ${STUDIO_NAME} in Pune.` } : undefined)
      || pageMap['/'];
    const canonicalUrl = getCanonicalUrl(normalizedPathname);
    // Dynamic detail pages set metadata from their loaded Firestore records.
    if (!serviceSlug) {
      updateSEOMetadata({
        title: metadata.title,
        description: metadata.description,
        canonicalUrl,
      });
    }

    const schemaScriptId = 'local-business-schema';
    const existingSchema = document.getElementById(schemaScriptId);
    if (existingSchema) {
      existingSchema.remove();
    }

    const breadcrumbItems = [{ name: 'Home', url: getCanonicalUrl('/') }];
    if (serviceSlug) breadcrumbItems.push({ name: 'Services', url: getCanonicalUrl('/services') });
    if (normalizedPathname !== '/') breadcrumbItems.push({ name: metadata.title, url: canonicalUrl });

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = schemaScriptId;
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [getLocalBusinessSchema(), getWebSiteSchema(), getBreadcrumbSchema(breadcrumbItems)],
    });
    document.head.appendChild(schema);

    return () => {
      document.getElementById(schemaScriptId)?.remove();
    };
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-brand-ivory selection:bg-brand-gold-champagne selection:text-brand-green-dark">
      {/* Global Header */}
      <Header />
      
      {/* Main Page Content */}
      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Conversions CTAs */}
      <FloatingCTA />
    </div>
  );
};
export default AppLayout;
