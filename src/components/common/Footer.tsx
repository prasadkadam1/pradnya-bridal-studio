import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Heart, MessageCircle } from 'lucide-react';
import { MEHENDI_ENABLED, STUDIO_NAME } from '../../config/siteFeatures';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-dark text-brand-ivory/90 border-t border-brand-gold/30 pt-16 pb-8 relative overflow-hidden">
      
      {/* Decorative Background Motif */}
      <div className="absolute right-0 bottom-0 w-80 h-80 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-brand-gold">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M50 10 A40 40 0 0 0 50 90 A40 40 0 0 0 50 10" />
          <path d="M10 50 A40 40 0 0 0 90 50 A40 40 0 0 0 10 50" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Studio Brand Intro */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-2xl tracking-wider text-brand-gold font-bold leading-none">
                PRADNYA
              </span>
              <span className="font-sans text-[10px] tracking-[0.3em] text-brand-gold/80 uppercase mt-0.5">
                {MEHENDI_ENABLED ? 'Bridal Beauty Studio' : 'Bridal Makeup Studio'}
              </span>
            </Link>
            <p className="font-sans text-sm text-brand-ivory/70 leading-relaxed">
              Bridal makeup, hair styling, and occasion looks crafted for modern Pune brides.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://instagram.com/pradnyabridal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-brand-green hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 hover:border-brand-gold transition-colors duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-brand-gold tracking-wide mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-gold transition-colors duration-300">Our Services</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-brand-gold transition-colors duration-300">Makeup Portfolio</Link>
              </li>
              <li>
                <Link to="/before-after" className="hover:text-brand-gold transition-colors duration-300">Transformations</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-brand-gold transition-colors duration-300">Packages</Link>
              </li>
              <li>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-serif text-lg text-brand-gold tracking-wide mb-6">Our Specialities</h3>
            <ul className="space-y-3 text-sm font-sans text-brand-ivory/80">
              {MEHENDI_ENABLED && <li><Link to="/services/bridal-mehendi" className="hover:text-brand-gold transition-colors duration-300">Traditional Bridal Mehendi</Link></li>}
              {MEHENDI_ENABLED && <li><Link to="/services/arabic-mehendi" className="hover:text-brand-gold transition-colors duration-300">Modern Arabic Henna</Link></li>}
              <li>
                <Link to="/services/bridal-makeup" className="hover:text-brand-gold transition-colors duration-300">HD Bridal Makeup</Link>
              </li>
              <li>
                <Link to="/services/reception-makeup" className="hover:text-brand-gold transition-colors duration-300">Reception Evening Glam</Link>
              </li>
              <li>
                <span className="text-brand-ivory/60">Professional Saree Draping</span>
              </li>
              <li>
                <span className="text-brand-ivory/60">Creative Hair Styling</span>
              </li>
            </ul>
          </div>

          {/* Contact Details & Local SEO Map Link */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif text-lg text-brand-gold tracking-wide mb-2">The Studio</h3>
            <ul className="space-y-4 text-sm font-sans text-brand-ivory/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Siddharth Heights, opposite Balgandharva, J.M. Road, Shivajinagar, Pune - 411005
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <a href="tel:+917040496065" className="hover:text-brand-gold transition-colors">
                  Call Studio
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-brand-gold shrink-0" />
                <a
                  href="https://wa.me/917040496065?text=Hi%20Pradnya%20Bridal%20Makeup%20Studio%2C%20I%20would%20like%20to%20book%20a%20bridal%20makeup%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                >
                  WhatsApp Inquiry
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <a href="mailto:pradnyakadam8027@gmail.com" className="hover:text-brand-gold transition-colors">
                  contact pradnyabridalstudio
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Local SEO Cities Tags */}
        <div className="border-t border-brand-gold/15 py-6 text-center text-xs font-sans text-brand-ivory/50">
          <p className="mb-2">
            Serving Brides across Pune • Talegaon Dabhade • Pimpri-Chinchwad • Hinjewadi • Baner • Wakad • Chakan • Nigdi • PCMC • Koregaon Park
          </p>
        </div>

        {/* Footer Bottom copyright */}
        <div className="border-t border-brand-gold/15 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-brand-ivory/60">
          <p>© {currentYear} {STUDIO_NAME}. All Rights Reserved.</p>
          <p className="flex items-center mt-4 sm:mt-0">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-gold fill-brand-gold mx-1" /> for Pune Brides.
          </p>
        </div>

      </div>
    </footer>
  );
};
