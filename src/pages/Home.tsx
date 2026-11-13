import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  Heart,
  MessageCircle,
  Instagram,
} from "lucide-react";
import {
  useServices,
  usePortfolio,
  usePublicTestimonials,
} from "../hooks/useFirestore";
import { Divider } from "../components/common/Divider";
import { Button } from "../components/common/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { hasPortfolioImage } from '../utils/portfolioImages';
import { DEFAULT_EVENT_TYPE, isPublicPortfolioEnabled, isPublicServiceEnabled, isPublicTestimonialEnabled, MEHENDI_ENABLED } from '../config/siteFeatures';

export const Home: React.FC = () => {
  const { data: services } = useServices();
  const { data: portfolio } = usePortfolio();
  const { data: testimonials } = usePublicTestimonials();

  const featuredPortfolio =
    portfolio?.filter((item) => item.isFeatured && isPublicPortfolioEnabled(item)).slice(0, 3) || [];
  const featuredTestimonials =
    testimonials?.filter((item) => item.isFeatured && isPublicTestimonialEnabled(item)).slice(0, 3) || [];

  const faqs = [
    {
      q: MEHENDI_ENABLED ? "How far in advance should I book my bridal makeup and mehendi?" : "How far in advance should I book my bridal makeup?",
      a: "We recommend booking 6 to 12 months in advance, especially for peak wedding seasons in Maharashtra (November to May). Dates fill up extremely quickly.",
    },
    {
      q: "Do you travel to the wedding venue outside Pune?",
      a: "Yes, we travel across Maharashtra and nearby states for bridal bookings. Travel and accommodation charges are applicable depending on the location.",
    },
    ...(MEHENDI_ENABLED ? [{
        q: "Do you prepare your own mehendi paste?",
        a: "Absolutely. We prepare fresh, 100% organic henna paste using pure eucalyptus and lavender oils, ensuring a deep stain and absolute skin safety.",
      }] : []),
    {
      q: "Can I book a trial session for my bridal makeup?",
      a: "Yes! We offer paid trial sessions for bridal makeup. During the trial, we finalize your look, skin tone match, and hairstyle, which is then recorded for the wedding day.",
    },
  ];

  const journeySteps = [
    {
      step: "01",
      title: "Inquiry",
      desc: "Share your date, location, and guest details via our online availability form or WhatsApp.",
    },
    {
      step: "02",
      title: "Consultation",
      desc: "Discuss your outfit styles, jewelry, color preferences, and design inspirations.",
    },
    {
      step: "03",
      title: "Trial Session",
      desc: MEHENDI_ENABLED ? "Experience a hands-on makeup trial and select custom henna portrait drawings." : "Experience a hands-on makeup trial and finalize your bridal look, products, and hairstyle.",
    },
    {
      step: "04",
      title: "Booking Confirmation",
      desc: "Secure your wedding date in our calendar with a token advance payment.",
    },
    {
      step: "05",
      title: "Wedding Day",
      desc: "Relax as we bring your dream look to life at your venue with flawless precision.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[auto] lg:min-h-[90vh] flex items-center bg-brand-green-dark text-brand-ivory py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle Decorative Background Layer */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green to-brand-green-dark" />

        <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay bg-luxury-texture pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 rounded-full self-center lg:self-start"
            >
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
              <span className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-brand-gold font-bold">
                Pune Bridal Makeup Artist
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-wide leading-tight text-brand-ivory max-w-4xl mx-auto lg:mx-0"
            >
              Luxury Bridal <br />
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-champagne via-brand-gold to-brand-gold-champagne font-serif italic">
                {MEHENDI_ENABLED ? 'Mehendi & Makeup' : 'Bridal Makeup'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-sm sm:text-base text-brand-ivory/80 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              {MEHENDI_ENABLED
                ? 'Helping modern brides look their best with customized mehendi artistry and radiant, high-definition makeup.'
                : 'Helping modern brides feel their best with camera-ready bridal makeup, refined hair styling, and a look tailored to every celebration.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 w-full sm:w-auto"
            >
              <Link to="/availability" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full justify-center">
                  Book Consultation
                </Button>
              </Link>
              {/* <Link to="/portfolio" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-full border-brand-gold/50 bg-brand-ivory/5 px-7 py-3.5 text-brand-gold shadow-[0_10px_24px_rgba(20,53,37,0.10)] backdrop-blur-sm hover:-translate-y-0.5 hover:bg-brand-gold/12 hover:border-brand-gold/70 hover:shadow-[0_14px_28px_rgba(184,155,29,0.18)]"
                  >
                    View Portfolio
                  </Button>
                </Link> */}
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="
      group
      relative
      w-full
      justify-center
      overflow-hidden
      rounded-full
      border
      border-brand-gold/40
      bg-white/70
      px-8
      py-3.5
      text-[11px]
      font-semibold
      uppercase
      tracking-[0.22em]
      text-brand-green-dark
      backdrop-blur-md
      transition-all
      duration-500
      hover:border-brand-gold
      hover:bg-white
    "
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <span className="relative flex items-center gap-3">
                    View Portfolio
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
              <a
                href={`https://wa.me/917040496065?text=${encodeURIComponent(`Hi Pradnya, I'm interested in ${DEFAULT_EVENT_TYPE}. Please send me the details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-3.5 px-6 rounded border border-green-500 text-green-400 text-xs uppercase tracking-widest font-semibold hover:bg-green-500/10 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Inquiry</span>
              </a>
            </motion.div>
          </div>

          {/* Hero Right Image Frame */}
          <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[320px] sm:max-w-[380px] lg:w-80 h-[360px] sm:h-[440px] lg:h-[480px] rounded-t-full border-4 border-brand-gold/40 overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
                alt="Bridal makeup look with refined eye makeup and glowing skin"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/45 to-transparent" />
            </motion.div>

            {/* Absolute Badges */}
            <div className="hidden sm:block absolute -bottom-4 -left-4 sm:left-2 bg-brand-gold/90 text-brand-green-dark p-4 rounded shadow-lg border border-brand-ivory/20 max-w-[160px] text-center backdrop-blur-sm">
              <p className="font-serif text-2xl font-bold leading-none">
                1,200+
              </p>
              <p className="font-sans text-[10px] tracking-wider uppercase font-semibold mt-1">
                Brides Styled
              </p>
            </div>
            <div className="hidden sm:block absolute top-1/4 -right-4 bg-brand-green/95 text-brand-gold p-4 rounded shadow-lg border border-brand-gold/30 max-w-[150px] text-center backdrop-blur-sm">
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-brand-gold text-brand-gold"
                  />
                ))}
              </div>
              <p className="font-sans text-[10px] tracking-wider uppercase font-semibold text-brand-ivory">
                5.0 Star Rated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators Bar */}
      <section className="bg-brand-beige py-8 border-b border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-bold text-brand-green-dark">
                8+ Years
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-brand-charcoal/70 mt-1">
                Elite Experience
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-bold text-brand-green-dark">
                1,200+
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-brand-charcoal/70 mt-1">
                Brides Served
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-bold text-brand-green-dark">
                {MEHENDI_ENABLED ? '100%' : 'HD + Airbrush'}
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-brand-charcoal/70 mt-1">
                {MEHENDI_ENABLED ? 'Organic Henna' : 'Bridal Makeup Techniques'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-bold text-brand-green-dark">
                Pune & PCMC
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-brand-charcoal/70 mt-1">
                Prime Locations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Services */}
      <section className="py-24 bg-brand-ivory relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green-dark tracking-wide font-bold">
              Our Bridal Specialities
            </h2>
            <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
              Meticulously crafted services designed to give you a flawless look
              for each ceremony.
            </p>
            <Divider variant="simple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services?.filter(isPublicServiceEnabled).slice(0, 4).map((service) => (
              <GlassCard
                key={service.id}
                className="flex flex-col h-full bg-brand-beige/20"
                hoverEffect={true}
              >
                <div className="relative h-48 w-full rounded overflow-hidden mb-6 border border-brand-gold/15">
                  {service.portfolioExamples?.[0] ? (
                    <img src={service.portfolioExamples[0]} alt={service.title} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-green-dark/5 px-4 text-center">
                      <span className="font-sans text-[9px] uppercase tracking-widest text-brand-green-dark/55">Image coming soon</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-brand-green-dark text-brand-gold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-sans font-bold shadow-md">
                    {service.category}
                  </div>
                </div>

                <h3 className="font-serif text-xl text-brand-green-dark font-bold mb-2">
                  {service.title}
                </h3>

                <p className="font-sans text-xs text-brand-charcoal/80 leading-relaxed mb-6 flex-grow">
                  {service.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-brand-gold/15">
                  <div>
                    <span className="text-[10px] font-sans text-brand-charcoal/50 uppercase block">
                      Starting from
                    </span>
                    <span className="font-serif text-base font-bold text-brand-green">
                      ₹{service.startingPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    to={`/services/${service.id}`}
                    className="flex items-center space-x-1.5 text-xs font-sans font-bold text-brand-gold hover:text-brand-gold-dark uppercase tracking-wider transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green/5"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Portfolio Preview */}
      <section className="py-24 bg-brand-beige/35 border-y border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green-dark tracking-wide font-semibold">
              Recent Masterpieces
            </h2>
            <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
              Explore bridal makeup looks, reception glam, and real transformations created for Pune brides.
            </p>
            <Divider variant="simple" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {featuredPortfolio.map((item) => (
              <div
                key={item.id}
                className="group relative rounded overflow-hidden shadow-lg border border-brand-gold/20 bg-brand-ivory aspect-[9/16]"
              >
                {hasPortfolioImage(item.imageUrl) ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-green-dark/5 px-4 text-center"><span className="font-sans text-[10px] uppercase tracking-widest text-brand-green-dark/55">Image coming soon</span></div>
                )}

                {/* Gold Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/85 via-brand-green-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-brand-ivory translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[9px] font-sans text-brand-gold-champagne uppercase tracking-widest font-bold">
                    {item.category.replace("-", " ")}
                  </span>
                  <h3 className="font-serif text-lg font-bold mt-1 text-brand-gold">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-brand-ivory/80 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="primary">Explore Makeup Portfolio</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Bridal Journey */}
      <section className="py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green-dark tracking-wide font-bold">
              Your Bridal Journey
            </h2>
            <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
              We make booking and styling seamless. Here is how we craft your
              wedding look:
            </p>
            <Divider variant="simple" />
          </div>

          <div className="relative">
            {/* Horizontal Timeline Connector Line */}
            <div className="hidden lg:block absolute top-[44px] left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center px-4 relative"
                >
                  {/* Step Circle */}
                  <div className="w-20 h-20 rounded-full border border-brand-gold bg-brand-beige flex items-center justify-center font-serif text-xl font-bold text-brand-green-dark mb-6 shadow-md relative z-10 transition-transform duration-300 hover:scale-105">
                    {step.step}
                  </div>

                  <h3 className="font-serif text-lg text-brand-green-dark font-semibold mb-2">
                    {step.title}
                  </h3>

                  <p className="font-sans text-xs text-brand-charcoal/70 leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 bg-brand-green-dark text-brand-ivory relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-15 bg-luxury-texture pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-brand-gold text-brand-gold mb-6">
            <Heart className="w-5 h-5 fill-brand-gold" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-brand-gold tracking-wide font-bold mb-12">
            Words From Real Brides
          </h2>

          <div className="space-y-12">
            {featuredTestimonials.length > 0 ? (
              featuredTestimonials.map((t) => (
                <div key={t.id} className="flex flex-col items-center">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(t.starRating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-brand-gold text-brand-gold"
                      />
                    ))}
                  </div>

                  <blockquote className="font-serif text-lg sm:text-xl italic leading-relaxed text-brand-ivory/90 max-w-3xl">
                    "{t.reviewText}"
                  </blockquote>

                  <cite className="font-sans text-xs uppercase tracking-wider text-brand-gold font-semibold mt-4 block">
                    — {t.clientName}, {t.location} (Wedded on{" "}
                    {new Date(t.weddingDate).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                    )
                  </cite>
                </div>
              ))
            ) : (
              <p className="font-sans text-sm text-brand-ivory/60">
                Loading guest experiences...
              </p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/testimonials">
              <Button
                variant="outline"
                className="border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10"
              >
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 bg-brand-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green-dark tracking-wide font-bold">
              Frequently Asked Questions
            </h2>
            <Divider variant="simple" />
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <GlassCard
                key={index}
                className="bg-brand-beige/25 border border-brand-gold/15"
                hoverEffect={false}
              >
                <h3 className="font-serif text-base sm:text-lg text-brand-green font-bold flex items-center justify-between">
                  <span>{faq.q}</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-brand-charcoal/80 mt-2.5 leading-relaxed">
                  {faq.a}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Feed Mockup */}
      <section className="py-16 bg-brand-beige/20 border-t border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">
              Follow Our Artistry
            </p>
            <h2 className="font-serif text-2xl text-brand-green-dark mt-1 font-bold">
              @pradnyabridal
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80",
            ].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/pradnyabridal"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-[9/16] rounded overflow-hidden border border-brand-gold/10 block group shadow-sm"
              >
                <img
                  src={img}
                  alt="Instagram Post"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-green-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-brand-gold">
                  <Instagram className="w-6 h-6" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-green-dark to-brand-green text-brand-ivory relative overflow-hidden border-t border-brand-gold/30">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-luxury-texture pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <span className="font-serif text-brand-gold italic text-xl sm:text-2xl mb-2 block">
            Begin Your Bridal Styling Experience
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-ivory tracking-wide font-bold mb-6">
            Book Your Consultation Today
          </h2>

          <p className="font-sans text-sm sm:text-base text-brand-ivory/80 leading-relaxed max-w-xl mb-8">
            Plan your bridal makeup, hair styling, and occasion looks with Pradnya Bridal Makeup Studio in Pune.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Link to="/availability" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full shadow-lg">
                Check Booking Availability
              </Button>
            </Link>
            <a
              href="tel:+917040496065"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3.5 px-6 rounded border border-brand-gold/40 text-brand-gold uppercase text-xs tracking-widest font-semibold hover:bg-brand-gold/15 transition-all"
            >
              <span>Call Studio</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
