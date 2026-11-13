import React from 'react';
import { Divider } from '../components/common/Divider';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { Check, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { MEHENDI_ENABLED } from '../config/siteFeatures';

interface Package {
  name: string;
  price: string;
  desc: string;
  inclusions: string[];
  exclusions: string[];
  isPopular?: boolean;
}

const MEHENDI_PACKAGES: Package[] = [
  {
    name: "Classic Bridal",
    price: "₹18,000",
    desc: "Essential styling for traditional wedding ceremonies.",
    inclusions: [
      "Traditional Bridal Mehendi (wrist length)",
      "Bridal HD Makeup (1 ceremony)",
      "Standard Hair Bun styling",
      "Saree Draping (1 drape)",
      "Organic Mehendi cones aftercare kit"
    ],
    exclusions: [
      "Makeup Trial session",
      "Hairstyle changes",
      "Second artist touch-up",
      "Outstation travel charges"
    ]
  },
  {
    name: "Royal Celebration",
    price: "₹35,000",
    desc: "Complete luxury care for Mehendi & Wedding Makeup.",
    isPopular: true,
    inclusions: [
      "Intricate Bridal Mehendi (forearm length + feet)",
      "Storytelling motifs (Doli/Baraat couples)",
      "Premium HD Makeup (Wedding + Reception)",
      "Luxury Hair Styling with extensions/flowers",
      "Saree Draping (Nauvari/Traditional)",
      "1 Makeup Trial session (at studio)",
      "On-site Touch-up support before Reception"
    ],
    exclusions: [
      "Second assistant mehendi artist",
      "Travel costs outside Pune district"
    ]
  },
  {
    name: "Empress Signature",
    price: "₹55,000",
    desc: "The ultimate bridal treatment including all ceremonies.",
    inclusions: [
      "Custom Portrait Bridal Mehendi (elbow length + leg motifs)",
      "Assistant mehendi artists for family (up to 10 guests)",
      "Airbrush Bridal Makeup (Wedding + Reception + Haldi)",
      "3 custom Hairstyles with floral accents/hair jewels",
      "Saree / Lehenga draping for bride & mother of the bride",
      "1 Complementary Makeup Trial session",
      "Premium Touch-up kit (Mac/Huda lip gloss + blotting sheets)",
      "Travel allowance included within Pune/PCMC limits"
    ],
    exclusions: []
  }
];

const MAKEUP_PACKAGES: Package[] = [
  {
    name: 'Classic Bridal Look',
    price: 'Custom quote',
    desc: 'A polished makeup and hair look for one wedding ceremony.',
    inclusions: ['HD bridal makeup for one ceremony', 'Skin preparation and lash application', 'One bridal hairstyle', 'Saree or lehenga draping'],
    exclusions: ['Makeup trial', 'Additional event looks', 'Outstation travel charges'],
  },
  {
    name: 'Wedding & Reception',
    price: 'Custom quote',
    desc: 'Coordinated looks for your wedding ceremony and reception.',
    inclusions: ['HD makeup for wedding and reception', 'Bridal hair styling for both events', 'Makeup trial session', 'Reception touch-up support'],
    exclusions: ['Additional event looks', 'Outstation travel charges'],
  },
  {
    name: 'Signature Celebration',
    price: 'Custom quote',
    desc: 'A complete makeup and styling plan across your wedding celebrations.',
    inclusions: ['Airbrush or HD makeup for up to three events', 'Custom hairstyle for each event', 'Makeup trial session', 'Premium touch-up kit', 'Saree or lehenga draping'],
    exclusions: ['Outstation travel charges'],
  },
];

const PACKAGES = MEHENDI_ENABLED ? MEHENDI_PACKAGES : MAKEUP_PACKAGES;

export const Packages: React.FC = () => {
  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Investments</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            {MEHENDI_ENABLED ? 'Bridal Packages' : 'Bridal Makeup Packages'}
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Compare makeup and styling options for your celebrations. Final pricing depends on your event schedule and location.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-20">
          {PACKAGES.map((pkg, idx) => (
            <GlassCard
              key={idx}
              className={`flex flex-col h-full bg-brand-beige/25 p-6 sm:p-8 relative ${
                pkg.isPopular 
                  ? 'border-2 border-brand-gold/70 shadow-xl lg:-translate-y-4 bg-brand-beige/35' 
                  : 'border border-brand-gold/20'
              }`}
              hoverEffect={!pkg.isPopular} // don't wobble the featured card
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-green-dark text-[10px] tracking-widest uppercase font-bold px-4 py-1.5 rounded-full shadow-md font-sans">
                  Most Requested Tier
                </div>
              )}

              <div className="text-center pb-6 border-b border-brand-gold/15 mb-6 text-left">
                <h3 className="font-serif text-2xl text-brand-green-dark font-bold">
                  {pkg.name}
                </h3>
                <p className="font-sans text-[11px] text-brand-charcoal/60 mt-1 leading-normal">
                  {pkg.desc}
                </p>
                <div className="mt-4 flex justify-start items-baseline flex-wrap gap-x-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-green">
                    {pkg.price}
                  </span>
                  <span className="font-sans text-xs text-brand-charcoal/50 ml-1.5">Package rate</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="flex-grow space-y-4 mb-8 text-left">
                <h4 className="font-sans text-[10px] uppercase tracking-wider text-brand-gold font-bold">
                  Inclusions:
                </h4>
                <ul className="space-y-3 font-sans text-xs text-brand-charcoal/85">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start space-x-2.5 text-brand-charcoal/45">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="line-through">{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-brand-gold/10 space-y-3">
                <Link to="/availability" className="block w-full">
                  <Button variant={pkg.isPopular ? "primary" : "outline"} className="w-full justify-center shadow">
                    Select & Book Package
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/917040496065?text=Hi%20Pradnya%2C%20I%20saw%20your%20"${encodeURIComponent(pkg.name)}"%20package%20pricing%20and%20would%20love%20to%20verify%20date%20availability.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded border border-[#25D366] text-[#25D366] uppercase text-[10px] tracking-widest font-semibold hover:bg-green-50/5 transition-all text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Custom package trust block */}
        <div className="max-w-3xl mx-auto rounded border border-brand-gold/30 bg-brand-green-dark p-8 text-brand-ivory relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-5 bg-luxury-texture pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-left">
            <div className="p-3 bg-brand-gold/15 rounded-full border border-brand-gold/20 text-brand-gold shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-brand-gold font-bold">Custom Wedding Bundles</h3>
              <p className="font-sans text-xs text-brand-ivory/80 mt-1 leading-relaxed">
                Have Sangeet, Haldi, engagement, or reception events across multiple dates? Contact us for a makeup and hair styling plan tailored to your schedule.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Packages;
