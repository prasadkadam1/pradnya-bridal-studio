import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddInquiry } from '../hooks/useFirestore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/ui/GlassCard';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactFormInputs {
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: string;
  numberOfPeople: number;
  message: string;
}

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const addInquiryMutation = useAddInquiry();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>({
    defaultValues: {
      name: '',
      phone: '',
      whatsappNumber: '',
      email: '',
      eventType: 'Bridal Mehendi & Makeup Combo',
      eventDate: '',
      location: '',
      budget: '20,000 - 35,000',
      numberOfPeople: 1,
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      await addInquiryMutation.mutateAsync(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    }
  };

  const eventOptions = [
    { value: 'Bridal Mehendi & Makeup Combo', label: 'Bridal Mehendi & Makeup Combo' },
    { value: 'Bridal Makeup Only', label: 'Bridal Makeup Only' },
    { value: 'Bridal Mehendi Only', label: 'Bridal Mehendi Only' },
    { value: 'Engagement Makeup/Mehendi', label: 'Engagement Makeup/Mehendi' },
    { value: 'Family Mehendi/Makeup', label: 'Family Mehendi/Makeup' },
    { value: 'Reception/Party Glam', label: 'Reception/Party Glam' }
  ];

  const budgetOptions = [
    { value: 'Under 10,000', label: 'Under ₹10,000' },
    { value: '10,000 - 20,000', label: '₹10,000 - ₹20,000' },
    { value: '20,000 - 35,000', label: '₹20,000 - ₹35,000' },
    { value: '35,000 - 50,000', label: '₹35,000 - ₹50,000' },
    { value: 'Above 50,000', label: 'Above ₹50,000 (Custom Pack)' }
  ];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Connect With Us</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Get In Touch
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Fill out our bridal intake form to reserve your wedding date consultation.
          </p>
          <Divider variant="simple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Contact Cards & Google Maps */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <h2 className="font-serif text-2xl text-brand-green-dark font-bold mb-4">
              Information
            </h2>
            
            <div className="grid grid-cols-1 gap-5 sm:gap-6">
              
              <div className="flex items-start space-x-4 p-5 rounded border border-brand-gold/15 bg-brand-beige/10">
                <MapPin className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-base text-brand-green font-bold">Studio & Service Areas</h4>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-1.5 leading-relaxed">
                    <span className="font-semibold text-brand-charcoal">Studio:</span> Siddharth Heights, opposite Balgandharva, J.M. Road, Shivajinagar, Pune - 411005
                  </p>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-2 leading-relaxed">
                    <span className="font-semibold text-brand-charcoal">We serve brides across:</span> entire Pune, PCMC (Pimpri-Chinchwad), Talegaon Dabhade, Hinjewadi, Wakad, Baner, Chakan, Nigdi, Kothrud, Koregaon Park, and all nearby wedding locations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded border border-brand-gold/15 bg-brand-beige/10">
                <Phone className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-brand-green font-bold">Studio Contact</h4>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-1">
                    For privacy, the owner&apos;s personal number is not displayed publicly.<br />
                    Please use WhatsApp or the consultation form to reach the studio.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded border border-brand-gold/15 bg-brand-beige/10">
                <Mail className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-brand-green font-bold">Inquiries & Support</h4>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-1">
                    <a href="mailto:pradnyakadam8027@gmail.com" className="hover:underline">pradnyakadam8027@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded border border-brand-gold/15 bg-brand-beige/10">
                <MessageSquare className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-brand-green font-bold">WhatsApp Booking</h4>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-1 leading-relaxed">
                    Fastest for date checks, package questions, and consultation confirmations.
                  </p>
                  <a
                    href="https://wa.me/917040496065?text=Hi%20Pradnya%20Studio%2C%20I%20would%20like%20to%20book%20a%20bridal%20consultation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-3 text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-gold transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded border border-brand-gold/15 bg-brand-beige/10">
                <Clock className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-brand-green font-bold">Working Hours</h4>
                  <p className="font-sans text-xs text-brand-charcoal/80 mt-1">
                    Monday to Sunday: 9:00 AM – 7:00 PM <br />
                    (Consultations by pre-scheduled appointments only)
                  </p>
                </div>
              </div>

            </div>

            {/* Google Map Embed */}
            <div className="rounded overflow-hidden border border-brand-gold/20 shadow-md aspect-[4/3] sm:aspect-[16/10]">
              <iframe
                title="Pradnya Bridal Studio Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.080517551042!2d73.84439061489283!3d18.525287687405234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07be1555555%3A0xe5cdcdad22b7a9de!2sShivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <GlassCard className="bg-brand-beige/20 border border-brand-gold/20 p-8 text-left">
              
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-brand-gold flex items-center justify-center mb-6 shadow-md border border-brand-gold/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-serif text-2xl text-brand-green-dark font-bold mb-3">
                    Thank You, Bride-to-be!
                  </h3>
                  
                  <p className="font-sans text-sm text-brand-charcoal/80 max-w-md mx-auto leading-relaxed mb-8">
                    We have successfully received your bridal inquiry. Our studio coordination team will review dates and send your next steps through WhatsApp or email within 24 hours.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setSubmitted(false)}
                      className="border-brand-green text-brand-green"
                    >
                      Submit Another Inquiry
                    </Button>
                    <a
                      href="https://wa.me/917040496065?text=Hi%20Pradnya%20Studio%20Team%2C%20I%20just%20submitted%20my%20bridal%20intake%20form%20online%20and%20would%20love%20to%20speed%20up%20confirmation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 py-3.5 px-6 rounded bg-[#25D366] text-white uppercase text-xs tracking-widest font-semibold hover:bg-[#20ba5a] transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  <h3 className="font-serif text-2xl text-brand-green-dark font-bold mb-4 border-b border-brand-gold/15 pb-3">
                    Bridal Intake Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="Full Name"
                      error={errors.name?.message}
                      {...register('name', { required: 'Full name is required' })}
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      error={errors.email?.message}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="Mobile Phone Number"
                      type="tel"
                      error={errors.phone?.message}
                      {...register('phone', { 
                        required: 'Phone number is required',
                        minLength: { value: 10, message: 'Phone must be at least 10 digits' }
                      })}
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
                      label="Select Event Type"
                      as="select"
                      options={eventOptions}
                      {...register('eventType')}
                    />

                    <Input
                      label="Event Date"
                      type="date"
                      error={errors.eventDate?.message}
                      {...register('eventDate', { required: 'Please specify the event date' })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <Input
                        label="Event Location / Venue"
                        placeholder="e.g. JW Marriott, Baner, Kothrud"
                        error={errors.location?.message}
                        {...register('location', { required: 'Venue location is required' })}
                      />
                    </div>
                    
                    <Input
                      label="No. of Guests"
                      type="number"
                      error={errors.numberOfPeople?.message}
                      {...register('numberOfPeople', { 
                        required: 'Required',
                        min: { value: 1, message: 'Min 1' }
                      })}
                    />
                  </div>

                  <Input
                    label="Estimate Budget Bracket"
                    as="select"
                    options={budgetOptions}
                    {...register('budget')}
                  />

                  <Input
                    label="Special Design Requests or Notes"
                    as="textarea"
                    placeholder="Describe your design inspirations, doli portrait requirements, or makeup concerns..."
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full justify-center shadow-lg mt-4 py-4"
                    loading={addInquiryMutation.isPending}
                  >
                    Submit Booking Inquiry
                  </Button>
                </form>
              )}

            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Contact;
