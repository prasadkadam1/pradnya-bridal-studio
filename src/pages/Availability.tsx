import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAvailability, useAddInquiry } from '../hooks/useFirestore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/ui/GlassCard';
import { CalendarDays, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

interface AvailabilityFormInputs {
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
}

export const Availability: React.FC = () => {
  const { data: availabilityList } = useAvailability();
  const addInquiryMutation = useAddInquiry();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [dateChecked, setDateChecked] = useState(false);
  const [statusMessage, setStatusMessage] = useState<'available' | 'limited' | 'booked' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<AvailabilityFormInputs>({
    defaultValues: {
      name: '',
      phone: '',
      whatsappNumber: '',
      email: '',
      eventType: 'Bridal Mehendi & Makeup Combo',
      eventDate: '',
      location: '',
      message: ''
    }
  });

  const checkDateAvailability = (dateStr: string) => {
    if (!dateStr) return;
    
    // Find matching date item
    const matched = availabilityList?.find(item => item.date === dateStr);
    
    if (matched) {
      setStatusMessage(matched.status);
      setNotes(matched.notes || '');
    } else {
      // Default fallback
      setStatusMessage('available');
      setNotes('No bookings recorded yet. You have high availability!');
    }
    
    setValue('eventDate', dateStr);
    setDateChecked(true);
  };

  const onSubmit = async (data: AvailabilityFormInputs) => {
    try {
      // Create inquiry lead profile
      await addInquiryMutation.mutateAsync({
        ...data,
        budget: 'Not Specified',
        numberOfPeople: 1
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Failed to store availability inquiry:", err);
    }
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Booking Slots</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Check Availability
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Select your wedding date to see if Pradnya is available for bookings.
          </p>
          <Divider variant="simple" />
        </div>

        {submitted ? (
          <GlassCard className="bg-brand-beige/20 border-brand-gold/20 p-8 py-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-green text-brand-gold flex items-center justify-center mb-6 mx-auto shadow border border-brand-gold/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="font-serif text-2xl text-brand-green-dark font-bold mb-3">
              Request Received Successfully!
            </h3>
            
            <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed mb-8 max-w-md mx-auto">
              Thank you. We have received your request and will confirm availability shortly. Our studio coordinator will contact you directly on your WhatsApp number.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSubmitted(false);
                  setDateChecked(false);
                  setSelectedDate('');
                }}
                className="border-brand-green text-brand-green"
              >
                Check Another Date
              </Button>
              <a
                href="https://wa.me/917040496065?text=Hi%20Pradnya%20Studio%2C%20I%20just%20submitted%20an%20availability%20check%20request%20online%20for%20my%20wedding%20date."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-3.5 px-6 rounded bg-[#25D366] text-white uppercase text-xs tracking-widest font-semibold hover:bg-[#20ba5a] transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-8">
            
            {/* Step 1: Pick Date */}
            <GlassCard className="bg-brand-beige/25 border-brand-gold/20 p-8 max-w-2xl mx-auto text-left">
              <h3 className="font-serif text-xl text-brand-green-dark font-bold mb-4 flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-brand-gold" />
                <span>Step 1: Choose Your Ceremony Date</span>
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow">
                  <label className="font-sans text-xs uppercase tracking-wider text-brand-green/80 font-bold block mb-1.5">
                    Ceremony / Wedding Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-gold/30 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded focus:outline-none font-sans text-sm"
                  />
                </div>
                <Button 
                  onClick={() => checkDateAvailability(selectedDate)}
                  disabled={!selectedDate}
                  variant="primary"
                  className="w-full sm:w-auto py-3.5"
                >
                  Verify Date
                </Button>
              </div>

              {/* Status Display */}
              {dateChecked && (
                <div className="mt-8 pt-6 border-t border-brand-gold/15 animate-fadeIn">
                  {statusMessage === 'available' && (
                    <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-serif text-base font-bold">Good News! Date is Available</p>
                        <p className="font-sans text-xs text-green-700/90 mt-1">We are currently accepting bookings for {new Date(selectedDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}. Fill out the form below to lock your slot.</p>
                      </div>
                    </div>
                  )}

                  {statusMessage === 'limited' && (
                    <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-serif text-base font-bold">Limited Slots Remaining</p>
                        <p className="font-sans text-xs text-yellow-700/90 mt-1">{notes || 'We have existing bookings for this date, but can accommodate 1 additional bride. Please submit details immediately.'}</p>
                      </div>
                    </div>
                  )}

                  {statusMessage === 'booked' && (
                    <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-serif text-base font-bold">Fully Booked / Reserved</p>
                        <p className="font-sans text-xs text-red-700/90 mt-1">We are fully booked for bridal packages on this date. However, you can submit your details below to join the waiting list or inquire for bridesmaids-only henna packages.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Step 2: Intake Form (Only shown if checked) */}
            {dateChecked && (
              <GlassCard className="bg-brand-beige/20 border-brand-gold/20 p-8 max-w-2xl mx-auto text-left animate-slideUp">
                <h3 className="font-serif text-xl text-brand-green-dark font-bold mb-6 border-b border-brand-gold/15 pb-3">
                  Step 2: Share Event Details
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      error={errors.name?.message}
                      {...register('name', { required: 'Name is required' })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      error={errors.email?.message}
                      {...register('email', { required: 'Email is required' })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Mobile Phone"
                      type="tel"
                      error={errors.phone?.message}
                      {...register('phone', { required: 'Phone is required' })}
                    />
                    <Input
                      label="WhatsApp Number"
                      type="tel"
                      error={errors.whatsappNumber?.message}
                      {...register('whatsappNumber', { required: 'WhatsApp number is required' })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Event Type"
                      as="select"
                      options={[
                        { value: 'Bridal Mehendi & Makeup Combo', label: 'Bridal Mehendi & Makeup Combo' },
                        { value: 'Bridal Makeup Only', label: 'Bridal Makeup Only' },
                        { value: 'Bridal Mehendi Only', label: 'Bridal Mehendi Only' },
                        { value: 'Engagement/Reception', label: 'Engagement/Reception Styling' }
                      ]}
                      {...register('eventType')}
                    />
                    
                    <Input
                      label="Venue Location"
                      placeholder="e.g. Shivajinagar, Baner, Hinjewadi"
                      error={errors.location?.message}
                      {...register('location', { required: 'Venue is required' })}
                    />
                  </div>

                  <Input
                    label="Notes / Special Motifs"
                    as="textarea"
                    placeholder="Provide details about your timings, guest count, or portrait requests..."
                    {...register('message')}
                  />

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full justify-center py-4"
                    loading={addInquiryMutation.isPending}
                  >
                    Send Reservation Inquiry
                  </Button>
                </form>
              </GlassCard>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
export default Availability;
