import React from 'react';
import { useTestimonials, useAddTestimonial, useDeleteTestimonial } from '../../hooks/useFirestore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Star, Trash2, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface TestimonialFormInputs {
  clientName: string;
  starRating: number;
  reviewText: string;
  weddingDate: string;
  category: 'mehendi' | 'makeup' | 'both';
  isFeatured: boolean;
  location: string;
}

export const ManageTestimonials: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const addTestimonialMutation = useAddTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonialFormInputs>({
    defaultValues: {
      clientName: '',
      starRating: 5,
      reviewText: '',
      weddingDate: '',
      category: 'both',
      isFeatured: true,
      location: ''
    }
  });

  const onSubmit = async (data: TestimonialFormInputs) => {
    try {
      await addTestimonialMutation.mutateAsync({
        ...data,
        starRating: Number(data.starRating)
      });
      reset();
      alert("Review added successfully!");
    } catch (err) {
      console.error("Failed to add testimonial:", err);
      alert("Failed to save review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteTestimonialMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
    }
  };

  return (
    <div className="space-y-10 text-left">
      
      {/* Title */}
      <div className="border-b border-brand-gold/15 pb-6">
        <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Reviews Manager</h1>
        <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Manage client testimonies and star ratings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center space-x-2 border-b border-brand-gold/15 pb-3">
              <Heart className="w-5 h-5 text-brand-gold" />
              <span>Add Client Review</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <Input
                label="Client Name"
                placeholder="e.g. Shraddha Deshpande"
                error={errors.clientName?.message}
                {...register('clientName', { required: 'Name is required' })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Star Rating"
                  as="select"
                  options={[
                    { value: '5', label: '5 Stars' },
                    { value: '4', label: '4 Stars' },
                    { value: '3', label: '3 Stars' }
                  ]}
                  {...register('starRating')}
                />
                
                <Input
                  label="Wedding Date"
                  type="date"
                  error={errors.weddingDate?.message}
                  {...register('weddingDate', { required: 'Date is required' })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Client Location"
                  placeholder="e.g. Baner, Pune"
                  error={errors.location?.message}
                  {...register('location', { required: 'Location is required' })}
                />
                
                <Input
                  label="Category Type"
                  as="select"
                  options={[
                    { value: 'both', label: 'Combo (Both)' },
                    { value: 'mehendi', label: 'Mehendi only' },
                    { value: 'makeup', label: 'Makeup only' }
                  ]}
                  {...register('category')}
                />
              </div>

              <Input
                label="Review Text"
                as="textarea"
                placeholder="Paste review notes, messages, or comments here..."
                rows={4}
                error={errors.reviewText?.message}
                {...register('reviewText', { required: 'Review text is required' })}
              />

              {/* Feature checkbox */}
              <div className="flex items-center space-x-2.5 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  {...register('isFeatured')}
                  className="h-4 w-4 rounded border-brand-gold/30 text-brand-green focus:ring-brand-gold"
                />
                <label htmlFor="isFeatured" className="font-sans text-xs uppercase tracking-wider font-semibold text-brand-green/80 cursor-pointer">
                  Feature on Homepage Carousel
                </label>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full justify-center shadow-lg pt-3.5"
                disabled={addTestimonialMutation.isPending}
              >
                <span>Save Testimony</span>
              </Button>

            </form>
          </GlassCard>
        </div>

        {/* Right Column: Listing */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl text-brand-green-dark font-bold">Verified Reviews</h3>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !testimonials || testimonials.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
              <p className="font-serif text-base text-brand-charcoal/50">No verified reviews set up yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((test) => (
                <div 
                  key={test.id} 
                  className="p-5 rounded border border-brand-gold/15 bg-brand-ivory flex items-center justify-between gap-6 shadow-sm"
                >
                  <div className="text-left font-sans text-xs flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="text-[8px] bg-brand-beige text-brand-green-dark font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {test.category}
                      </span>
                      {test.isFeatured && (
                        <span className="text-[8px] bg-brand-gold text-brand-green-dark font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-serif text-base text-brand-green font-bold mt-2">{test.clientName}</h4>
                    <p className="text-[10px] text-brand-charcoal/50 mt-0.5">{test.location} • {new Date(test.weddingDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                    
                    <div className="flex space-x-0.5 mt-1.5 mb-2">
                      {[...Array(test.starRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>

                    <p className="text-brand-charcoal/80 leading-relaxed italic">"{test.reviewText}"</p>
                  </div>

                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 transition-colors shrink-0"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default ManageTestimonials;
