import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useService } from '../hooks/useFirestore';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Clock, IndianRupee, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { ServiceFaq, ServiceProcessStep } from '../types/studio';
import updateSEOMetadata, { getCanonicalUrl } from '../services/seo';
import { getServiceSchema } from '../utils/schemaMarkup';
import { isPublicServiceEnabled, MEHENDI_ENABLED } from '../config/siteFeatures';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading } = useService(slug || '');

  useEffect(() => {
    if (!slug) return;
    const canonicalUrl = getCanonicalUrl(`/services/${slug}`);
    if (!service || !isPublicServiceEnabled(service)) {
      updateSEOMetadata({
        title: MEHENDI_ENABLED ? `${slug.replaceAll('-', ' ')} Bridal Beauty Service` : 'Bridal Makeup Services in Pune',
        description: MEHENDI_ENABLED ? 'Explore bridal beauty service details, pricing, and booking information from Pradnya Bridal Studio in Pune.' : 'Explore bridal makeup, reception looks, and styling services from Pradnya Bridal Makeup Studio in Pune.',
        canonicalUrl,
        robots: !isLoading || (service && !isPublicServiceEnabled(service)) ? 'noindex,follow' : 'index,follow,max-image-preview:large',
      });
      document.getElementById('service-page-schema')?.remove();
      return;
    }
    updateSEOMetadata({
      title: `${service.title} in Pune`,
      description: service.shortDescription,
      ogImage: service.portfolioExamples?.[0] || undefined,
      canonicalUrl,
    });
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'service-page-schema';
    schema.textContent = JSON.stringify(getServiceSchema({
      title: service.title,
      description: service.shortDescription,
      url: canonicalUrl,
      price: service.startingPrice,
    }));
    document.getElementById('service-page-schema')?.remove();
    document.head.appendChild(schema);
    return () => document.getElementById('service-page-schema')?.remove();
  }, [service, slug, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!service || !isPublicServiceEnabled(service)) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-2xl text-brand-green-dark mb-4">Service not found</h2>
        <p className="font-sans text-sm text-brand-charcoal/70 mb-6">The service you are looking for does not exist.</p>
        <Link to="/services">
          <Button variant="primary">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/917040496065?text=Hi%20Pradnya%2C%20I%27d%20like%20to%20inquire%20about%20the%20${encodeURIComponent(service.title)}%20package.`;

  return (
    <div className="bg-brand-ivory min-h-screen pb-24">
      
      {/* Back Button Bar */}
      <div className="bg-brand-beige/50 border-b border-brand-gold/15 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center space-x-2 text-xs font-sans font-bold text-brand-green hover:text-brand-green-dark uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>All Services</span>
          </Link>
        </div>
      </div>

      {/* Service Banner / Top Frame */}
      <section className="bg-brand-green-dark text-brand-ivory py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-luxury-texture pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
            <span className="text-brand-gold font-sans text-xs uppercase tracking-widest font-bold">
              {service.category} Speciality
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-brand-ivory leading-tight">
              {service.title}
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-brand-ivory/80 leading-relaxed max-w-2xl">
              {service.detailedDescription}
            </p>

            <div className="flex flex-wrap gap-6 pt-4 text-xs font-sans text-brand-ivory/90">
              <div className="flex items-center space-x-2 bg-brand-green-light/20 border border-brand-gold/20 px-4 py-2 rounded">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>Duration: {service.duration}</span>
              </div>
              <div className="flex items-center space-x-2 bg-brand-green-light/20 border border-brand-gold/20 px-4 py-2 rounded">
                <IndianRupee className="w-4 h-4 text-brand-gold" />
                <span>Price: from ₹{service.startingPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-80 h-96 rounded-t-full border-4 border-brand-gold/30 overflow-hidden shadow-2xl">
              {service.portfolioExamples?.[0] ? (
                <img src={service.portfolioExamples[0]} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-ivory/10 px-6 text-center">
                  <span className="font-sans text-xs uppercase tracking-widest text-brand-gold">Image coming soon</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Service Core Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Benefits & Process */}
        <div className="lg:col-span-8 flex flex-col space-y-12 text-left">
          
          {/* Benefits */}
          <div>
            <h2 className="font-serif text-2xl text-brand-green-dark font-bold tracking-wide mb-6">
              Why Choose Our {service.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-brand-charcoal/80 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Timeline */}
          <div>
            <h2 className="font-serif text-2xl text-brand-green-dark font-bold tracking-wide mb-8">
              The Service Process
            </h2>
            <div className="space-y-6">
              {service.process.map((step: ServiceProcessStep, index: number) => (
                <div key={index} className="flex items-start gap-4 p-5 rounded bg-brand-beige/20 border border-brand-gold/15">
                  <div className="w-10 h-10 rounded-full bg-brand-green-dark text-brand-gold flex items-center justify-center font-serif text-sm font-bold shrink-0">
                    {step.step || index + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-brand-green font-bold">{step.title}</h3>
                    <p className="font-sans text-xs text-brand-charcoal/70 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Previews */}
          {service.portfolioExamples && service.portfolioExamples.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-brand-green-dark font-bold tracking-wide mb-6">
                Portfolio Showcase
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.portfolioExamples.map((url: string, i: number) => (
                  <div key={i} className="rounded border border-brand-gold/15 overflow-hidden shadow aspect-[4/3]">
                    <img src={url} alt={`${service.title} portfolio image ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Booking Inquiry Panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <GlassCard className="bg-brand-beige/10 border-brand-gold/25 text-left p-8">
              <h3 className="font-serif text-xl text-brand-green-dark font-bold mb-2">Book This Service</h3>
              <p className="font-sans text-xs text-brand-charcoal/70 leading-relaxed mb-6">
                Interested in booking {service.title} for your big day? Check availability or talk to us directly on WhatsApp.
              </p>
              
              <div className="space-y-3">
                <Link to="/availability" className="block w-full">
                  <Button variant="primary" className="w-full justify-center shadow">
                    Check Date Availability
                  </Button>
                </Link>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded bg-[#25D366] text-white uppercase text-xs tracking-widest font-semibold hover:bg-[#20ba5a] transition-all duration-300 shadow"
                >
                  <MessageCircle className="w-4.5 h-4.5 fill-current" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </GlassCard>

            {/* Service FAQ Mini Accordion */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="space-y-4 text-left">
                <h4 className="font-serif text-lg text-brand-green font-bold">Service FAQs</h4>
                {service.faqs.map((faq: ServiceFaq, i: number) => (
                  <div key={i} className="p-4 rounded border border-brand-gold/15 bg-brand-ivory shadow-sm">
                    <p className="font-serif text-sm text-brand-green font-semibold">{faq.question}</p>
                    <p className="font-sans text-xs text-brand-charcoal/70 mt-1.5 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
};
export default ServiceDetail;
