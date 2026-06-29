import React from 'react';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { Award, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: "Brides Adorned", val: "1,200+" },
    { label: "Years in Industry", val: "8+" },
    { label: "Positive Reviews", val: "100%" },
    { label: "Organic Cones Used", val: "15K+" }
  ];

  const values = [
    { title: "Artistic Customization", desc: "No two brides are identical. We design custom henna stories containing your portraits, wedding date, and motifs that match your unique love story." },
    { title: "Pure Organic Hygiene", desc: "We prepare our mehendi paste fresh using premium Rajasthani leaves, eucalyptus oil, and lavender oil. Zero chemical dyes, zero risk of allergies." },
    { title: "Flawless Punctuality", desc: "Wedding timelines are strict. Our team guarantees prompt arrival at your home or venue, ensuring makeup and hair styling finish well before the muhurat." }
  ];

  return (
    <div className="bg-brand-ivory min-h-screen">
      
      {/* Editorial Header Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Artist portrait frame (left) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:w-80 aspect-[4/5] rounded-t-full border-4 border-brand-gold/40 overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80" 
                alt="Lead Artist Pradnya in studio" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/40 to-transparent" />
            </div>
          </div>

          {/* Story text (right) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <span className="text-xs font-sans font-bold text-brand-gold uppercase tracking-widest block">
              Meet the Artist
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark font-bold tracking-wide">
              Pradnya Kadam
            </h1>
            <p className="font-serif text-lg italic text-brand-gold/80 font-medium">
              "Creating timeless bridal beauty is not just a profession; it is an act of love and devotion."
            </p>
            
            <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed space-y-4">
              For over eight years, I have had the privilege of helping brides across Pune, Talegaon, and PCMC walk down the aisle looking radiant. What started as a passion for fine art and sketching slowly evolved into Pune's premier luxury studio specializing in traditional henna storytelling designs and high-definition makeup.
            </p>
            
            <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed">
              We understand the nervousness that comes with your wedding preparations. That is why we focus on trial sessions, detailed consultation meetings, and high-end international cosmetics to ensure your confidence matches your look on the wedding stage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/availability" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full justify-center">
                  Book A Trial
                </Button>
              </Link>
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full justify-center text-brand-green border-brand-green hover:bg-brand-green/5">
                  See Our Creations
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-brand-beige py-12 border-y border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-serif text-4xl font-bold text-brand-green-dark">{stat.val}</span>
                <span className="font-sans text-[11px] uppercase tracking-wider text-brand-charcoal/65 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-brand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl text-brand-green-dark tracking-wide font-bold">Studio Foundations</h2>
            <p className="font-sans text-xs text-brand-charcoal/60 uppercase tracking-widest mt-2 font-bold">How We Work</p>
            <Divider variant="simple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((val, idx) => (
              <GlassCard key={idx} className="bg-brand-ivory text-left border-brand-gold/15 p-8" hoverEffect={true}>
                <div className="w-10 h-10 rounded-full bg-brand-green text-brand-gold flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-brand-green-dark font-bold mb-3">{val.title}</h3>
                <p className="font-sans text-xs text-brand-charcoal/85 leading-relaxed">{val.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications and Awards Grid */}
      <section className="py-24 bg-brand-ivory max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl text-brand-green-dark font-bold">Certifications & Accolades</h2>
          <Divider variant="simple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          
          <div className="p-6 rounded border border-brand-gold/15 flex items-start space-x-4 bg-brand-beige/10">
            <Award className="w-8 h-8 text-brand-gold shrink-0" />
            <div>
              <h4 className="font-serif text-base text-brand-green font-bold">Certified HD Makeup Master</h4>
              <p className="font-sans text-[11px] text-brand-charcoal/50 uppercase mt-0.5">International Makeup Academy</p>
              <p className="font-sans text-xs text-brand-charcoal/70 mt-2 leading-relaxed">Advanced certifications in Airbrush coverage, skin color-correcting matching, and lighting styling.</p>
            </div>
          </div>

          <div className="p-6 rounded border border-brand-gold/15 flex items-start space-x-4 bg-brand-beige/10">
            <Award className="w-8 h-8 text-brand-gold shrink-0" />
            <div>
              <h4 className="font-serif text-base text-brand-green font-bold">Pune Wedding Industry Awards</h4>
              <p className="font-sans text-[11px] text-brand-charcoal/50 uppercase mt-0.5">Winner - Best Bridal Mehendi 2024</p>
              <p className="font-sans text-xs text-brand-charcoal/70 mt-2 leading-relaxed">Recognized for delivering intricate storytelling couple figures and dark organic stain consistency.</p>
            </div>
          </div>

          <div className="p-6 rounded border border-brand-gold/15 flex items-start space-x-4 bg-brand-beige/10">
            <Award className="w-8 h-8 text-brand-gold shrink-0" />
            <div>
              <h4 className="font-serif text-base text-brand-green font-bold">Sajiri Mahotsav Accolade</h4>
              <p className="font-sans text-[11px] text-brand-charcoal/50 uppercase mt-0.5">Honored Guest Stylist</p>
              <p className="font-sans text-xs text-brand-charcoal/70 mt-2 leading-relaxed">Presented custom Nauvari saree draping masterclasses for local Pune makeup networks.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
export default About;
