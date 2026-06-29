import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { FloatingCTA } from '../ui/FloatingCTA';
import updateSEOMetadata from '../../services/seo';
import { getBreadcrumbSchema, getLocalBusinessSchema } from '../../utils/schemaMarkup';

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const pageMap: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'Luxury Bridal Mehendi & Makeup Services in Pune',
        description: 'Premium bridal mehendi, makeup, hair styling, and saree draping in Pune, PCMC, Hinjewadi, Wakad, and nearby wedding locations.',
      },
      '/services': {
        title: 'Bridal Beauty Services',
        description: 'Explore bridal mehendi, bridal makeup, engagement looks, family mehendi, reception makeup, party makeup, and hair styling.',
      },
      '/portfolio': {
        title: 'Bridal Portfolio',
        description: 'Browse premium bridal mehendi and makeup transformations in a luxury Pinterest-style gallery.',
      },
      '/before-after': {
        title: 'Before and After Transformations',
        description: 'See real bridal beauty transformations with interactive before and after comparisons.',
      },
      '/packages': {
        title: 'Bridal Packages',
        description: 'Compare premium bridal mehendi and makeup packages for intimate functions and full wedding ceremonies.',
      },
      '/about': {
        title: 'About Pradnya Bridal Studio',
        description: 'Meet the artist behind the studio, with experience, values, certifications, and a bridal-first philosophy.',
      },
      '/testimonials': {
        title: 'Client Testimonials',
        description: 'Read verified bridal reviews, stories, and star-rated testimonials from Pune brides.',
      },
      '/blog': {
        title: 'Bridal Beauty Blog',
        description: 'SEO-friendly bridal beauty advice, wedding prep tips, and Pune wedding trends.',
      },
      '/contact': {
        title: 'Contact Pradnya Bridal Studio',
        description: 'Send an inquiry, call, WhatsApp, or find the studio in Shivajinagar, Pune.',
      },
      '/availability': {
        title: 'Check Availability',
        description: 'Check wedding date availability and submit your bridal inquiry in seconds.',
      },
    };

    const metadata = pageMap[pathname] || pageMap['/'];
    updateSEOMetadata({
      title: metadata.title,
      description: metadata.description,
      canonicalUrl: `${window.location.origin}${pathname}`,
    });

    const schemaScriptId = 'local-business-schema';
    const existingSchema = document.getElementById(schemaScriptId);
    if (existingSchema) {
      existingSchema.remove();
    }

    const localBusinessSchema = document.createElement('script');
    localBusinessSchema.type = 'application/ld+json';
    localBusinessSchema.id = schemaScriptId;
    localBusinessSchema.textContent = JSON.stringify(getLocalBusinessSchema());
    document.head.appendChild(localBusinessSchema);

    const breadcrumbSchema = document.createElement('script');
    breadcrumbSchema.type = 'application/ld+json';
    breadcrumbSchema.id = `${schemaScriptId}-breadcrumbs`;
    breadcrumbSchema.textContent = JSON.stringify(
      getBreadcrumbSchema([
        { name: 'Home', url: `${window.location.origin}/` },
        { name: metadata.title, url: `${window.location.origin}${pathname}` },
      ])
    );
    document.head.appendChild(breadcrumbSchema);

    return () => {
      document.getElementById(schemaScriptId)?.remove();
      document.getElementById(`${schemaScriptId}-breadcrumbs`)?.remove();
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
