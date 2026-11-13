import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddTestimonial, usePublicTestimonials } from '../hooks/useFirestore';
import { GlassCard } from '../components/ui/GlassCard';
import { Divider } from '../components/common/Divider';
import { Star, Quote, Calendar, Send } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { isPublicTestimonialEnabled, MEHENDI_ENABLED } from '../config/siteFeatures';

interface ReviewFormInputs {
  clientName: string;
  starRating: number;
  reviewText: string;
  weddingDate: string;
  category: 'mehendi' | 'makeup' | 'both';
  location: string;
}

export const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading } = usePublicTestimonials();
  const addReviewMutation = useAddTestimonial();
  const [filter, setFilter] = useState<'all' | 'mehendi' | 'makeup' | 'both'>('all');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormInputs>({
    defaultValues: { clientName: '', starRating: 5, reviewText: '', weddingDate: '', category: MEHENDI_ENABLED ? 'both' : 'makeup', location: '' }
  });

  const onSubmitReview = async (data: ReviewFormInputs) => {
    setSubmitError('');
    try {
      await addReviewMutation.mutateAsync({
        ...data,
        clientName: data.clientName.trim(),
        reviewText: data.reviewText.trim(),
        location: data.location.trim(),
        starRating: Number(data.starRating),
        isFeatured: false,
        status: 'pending',
      });
      reset();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit your review. Please try again.');
    }
  };

  const publicReviews = testimonials?.filter(isPublicTestimonialEnabled) || [];
  const filteredReviews = publicReviews.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  }) || [];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Makeup Client Stories</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Client Experiences
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
              Read client stories about their bridal makeup and celebration looks.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Aggregate Ratings Banner */}
        <div className="max-w-3xl mx-auto bg-brand-beige/35 rounded border border-brand-gold/25 p-6 sm:p-8 mb-16 grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center">
          <div className="flex flex-col">
            <span className="font-serif text-5xl font-bold text-brand-green-dark">
              {testimonials?.length ? (testimonials.reduce((sum, review) => sum + review.starRating, 0) / testimonials.length).toFixed(1) : '—'}
            </span>
            <div className="flex justify-center space-x-0.5 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
            </div>
            <span className="font-sans text-[10px] uppercase text-brand-charcoal/50 mt-1">Average from approved reviews</span>
          </div>

          <div className="md:border-l md:border-r border-brand-gold/15 py-4 flex flex-col justify-center">
            <span className="font-serif text-3xl font-bold text-brand-green-dark">{testimonials?.length ?? '—'}</span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-brand-charcoal/65 mt-1">Published Reviews</span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-serif text-3xl font-bold text-brand-green-dark">{publicReviews.length}</span>
            <span className="font-sans text-[10px] tracking-wider uppercase text-brand-charcoal/65 mt-1">Makeup Client Stories</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(MEHENDI_ENABLED ? ['all', 'mehendi', 'makeup', 'both'] as const : ['all', 'makeup'] as const).map((cat) => (
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

        {/* Customer review submission */}
        <section className="mt-20 max-w-3xl mx-auto" aria-labelledby="review-form-heading">
          <GlassCard className="bg-brand-beige/20 border-brand-gold/20 p-6 sm:p-8" hoverEffect={false}>
            <div className="text-center mb-7">
              <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Your Story Matters</span>
              <h2 id="review-form-heading" className="font-serif text-2xl sm:text-3xl text-brand-green-dark font-bold mt-2">Share Your Experience</h2>
              <p className="font-sans text-sm text-brand-charcoal/70 mt-2">Reviews are checked by our team before they appear on the site.</p>
            </div>

            {submitted ? (
              <div role="status" className="rounded border border-green-200 bg-green-50 p-5 text-center text-sm text-green-800">
                Thank you for sharing your feedback. It has been received and will be published after review.
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Your Name" error={errors.clientName?.message} {...register('clientName', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter at least 2 characters' }, maxLength: { value: 80, message: 'Name must be 80 characters or fewer' } })} />
                  <Input label="Location" placeholder="e.g. Baner, Pune" error={errors.location?.message} {...register('location', { required: 'Please enter your location', maxLength: { value: 80, message: 'Location must be 80 characters or fewer' } })} />
                <Input label="Service" as="select" options={MEHENDI_ENABLED ? [{ value: 'both', label: 'Mehendi & Makeup' }, { value: 'mehendi', label: 'Mehendi' }, { value: 'makeup', label: 'Makeup' }] : [{ value: 'makeup', label: 'Bridal Makeup' }]} {...register('category', { required: true })} />
                  <Input label="Rating" as="select" options={[5, 4, 3, 2, 1].map((rating) => ({ value: String(rating), label: `${rating} ${rating === 1 ? 'Star' : 'Stars'}` }))} {...register('starRating', { valueAsNumber: true, required: true })} />
                  <Input label="Wedding Date" type="date" error={errors.weddingDate?.message} {...register('weddingDate', { required: 'Please select your wedding date' })} />
                </div>
                <Input label="Your Review" as="textarea" rows={5} placeholder="Tell us about your experience..." error={errors.reviewText?.message} {...register('reviewText', { required: 'Please write your review', minLength: { value: 10, message: 'Please enter at least 10 characters' }, maxLength: { value: 2000, message: 'Review must be 2,000 characters or fewer' } })} />
                {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
                <Button type="submit" variant="primary" className="w-full sm:w-auto justify-center" loading={addReviewMutation.isPending}>
                  <Send className="w-4 h-4 mr-2" /> Submit Review
                </Button>
              </form>
            )}
          </GlassCard>
        </section>

      </div>
    </div>
  );
};
export default Testimonials;
