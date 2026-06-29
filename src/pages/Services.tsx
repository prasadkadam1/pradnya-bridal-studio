import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useFirestore';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Divider } from '../components/common/Divider';
import { Clock } from 'lucide-react';

export const Services: React.FC = () => {
  const { data: services, isLoading } = useServices();
  const [activeCategory, setActiveCategory] = useState<'all' | 'mehendi' | 'makeup' | 'styling'>('all');

  const filteredServices = services?.filter(s => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  }) || [];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Our Offerings</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Signature Services
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Custom styling for modern brides, wedding guests, and festive ceremonies.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {(['all', 'mehendi', 'makeup', 'styling'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-brand-green text-brand-ivory border-brand-green'
                  : 'bg-transparent text-brand-green-dark/80 border-brand-gold/30 hover:border-brand-gold hover:bg-brand-beige/25'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Service Grid Loader */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredServices.map((service) => (
              <GlassCard 
                key={service.id} 
                className="bg-brand-beige/20 border border-brand-gold/20 flex flex-col sm:flex-row gap-6 p-6 sm:p-8"
                hoverEffect={true}
              >
                {/* Image Section */}
                <div className="w-full sm:w-48 h-56 shrink-0 rounded overflow-hidden border border-brand-gold/15 relative">
                  <img 
                    src={service.portfolioExamples?.[0] || "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=400&q=80"} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-brand-green-dark/90 text-brand-gold text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">
                    {service.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow">
                  <h2 className="font-serif text-2xl text-brand-green-dark font-bold mb-2">
                    {service.title}
                  </h2>

                  <div className="flex items-center space-x-4 text-xs font-sans text-brand-charcoal/60 mb-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{service.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="text-brand-green font-semibold">
                      Starting ₹{service.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-brand-charcoal/80 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-gold/10">
                    <Link to={`/services/${service.id}`}>
                      <Button variant="outline" className="text-brand-green border-brand-green py-2 px-4">
                        Details & FAQ
                      </Button>
                    </Link>

                    <Link to="/availability">
                      <Button variant="primary" className="py-2 px-4 shadow">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Global Saree Draping & Hair styling note (non dynamic but needed per master prompt list) */}
        <div className="mt-20 p-8 rounded bg-brand-green-dark text-brand-ivory border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-5 bg-luxury-texture pointer-events-none" />
          
          <div className="max-w-2xl relative z-10 text-left">
            <h3 className="font-serif text-2xl text-brand-gold font-bold">Looking for Saree Draping & Hair Styling?</h3>
            <p className="font-sans text-sm text-brand-ivory/80 mt-2 leading-relaxed">
              We provide elegant Nauvari draping, Gujarati saree drapes, and modern cocktail drapes, along with luxury hair buns, curls, and floral braids. These can be booked individually or added to any makeup packages.
            </p>
          </div>

          <Link to="/contact" className="shrink-0 relative z-10">
            <Button variant="primary" className="bg-brand-gold text-brand-green-dark font-bold hover:bg-brand-gold-champagne">
              Inquire Now
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Services;
