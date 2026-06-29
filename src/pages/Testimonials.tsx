import React, { useState } from 'react';
import { useTestimonials } from '../hooks/useFirestore';
import { GlassCard } from '../components/ui/GlassCard';
import { Divider } from '../components/common/Divider';
import { Star, Quote, MessageSquare, Calendar } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const [filter, setFilter] = useState<'all' | 'mehendi' | 'makeup' | 'both'>('all');

  const filteredReviews = testimonials?.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  }) || [];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Bridal Stories</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Client Experiences
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Read stories of love and transformation from the brides we have had the honor of styling.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Aggregate Ratings Banner */}
        <div className="max-w-3xl mx-auto bg-brand-beige/35 rounded border border-brand-gold/25 p-6 sm:p-8 mb-16 grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center">
          <div className="flex flex-col">
            <span className="font-serif text-5xl font-bold text-brand-green-dark">5.0</span>
            <div className="flex justify-center space-x-0.5 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
            </div>
            <span className="font-sans text-[10px] uppercase text-brand-charcoal/50 mt-1">Average Star Rating</span>
          </div>

          <div className="md:border-l md:border-r border-brand-gold/15 py-4 flex flex-col justify-center">
            <span className="font-serif text-3xl font-bold text-brand-green-dark">1,200+</span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-brand-charcoal/65 mt-1">Happy Couples</span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-serif text-3xl font-bold text-brand-green-dark">100%</span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-brand-charcoal/65 mt-1">Verified Stain Stain</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['all', 'mehendi', 'makeup', 'both'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 border ${
                filter === cat
                  ? 'bg-brand-green text-brand-ivory border-brand-green'
                  : 'bg-transparent text-brand-green-dark/75 border-brand-gold/25 hover:border-brand-gold'
              }`}
            >
              {cat === 'all' ? 'All Reviews' : cat === 'both' ? 'Combo Clients' : `${cat} only`}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-brand-gold/30 rounded bg-brand-beige/5">
            <p className="font-serif text-lg text-brand-green">No reviews found for this selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
            {filteredReviews.map((review) => (
              <GlassCard 
                key={review.id} 
                className="flex flex-col bg-brand-beige/10 border border-brand-gold/15 p-8"
                hoverEffect={true}
              >
                {/* Quote Icon */}
                <div className="text-brand-gold/20 mb-4 self-start">
                  <Quote className="w-8 h-8 fill-current" />
                </div>

                {/* Rating */}
                <div className="flex space-x-0.5 mb-4">
                  {[...Array(review.starRating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-sans text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed flex-grow italic mb-6">
                  "{review.reviewText}"
                </p>

                {/* Client Profile */}
                <div className="pt-4 border-t border-brand-gold/10 mt-auto">
                  <h4 className="font-serif text-base text-brand-green-dark font-bold">
                    {review.clientName}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-sans text-brand-charcoal/50 mt-1">
                    <span>{review.location}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(review.weddingDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="font-sans text-xs text-brand-charcoal/70 mb-4">
            Styled by Pradnya Kadam recently? Share your feedback with us!
          </p>
          <a
            href="https://wa.me/917040496065?text=Hi%20Pradnya%2C%20I%27d%20like%20to%20send%20my%20wedding%20review%2Fphotos%21"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 py-3 px-6 rounded text-brand-green border border-brand-green text-xs uppercase tracking-widest font-semibold hover:bg-brand-green/5 transition-all"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-current" />
            <span>Send Feedback via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
export default Testimonials;
