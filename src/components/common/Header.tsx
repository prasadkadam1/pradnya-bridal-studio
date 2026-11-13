import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Brush, ChevronRight, Menu, MessageCircle, Phone, X } from 'lucide-react';
import studioLogo from '../../assets/studio-logo.png';
import { MEHENDI_ENABLED } from '../../config/siteFeatures';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/before-after', label: 'Transformations' },
  { path: '/packages', label: 'Packages' },
  { path: '/about', label: 'About' },
  { path: '/testimonials', label: 'Reviews' },
  { path: '/contact', label: 'Contact' },
];

const callHref = 'tel:+917040496065';
const whatsappHref = 'https://wa.me/917040496065?text=Hi%20Pradnya,%20I%20would%20like%20to%20book%20a%20consultation.';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative inline-flex items-center justify-center whitespace-nowrap px-0.5 py-2 text-[11px] font-sans font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
      isActive ? 'text-brand-green-dark' : 'text-brand-charcoal/70 hover:text-brand-green-dark'
    }`;

  const closeDrawer = () => setIsOpen(false);

  const logoBlock = (className: string, iconClassName: string, titleClassName: string, subtitleClassName: string) => (
    <Link to="/" onClick={closeDrawer} className={`flex min-w-0 items-center gap-3 ${className}`}>
      <span className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-gold/35 bg-brand-beige shadow-[0_6px_16px_rgba(20,53,37,0.08)]" aria-hidden="true">
        {MEHENDI_ENABLED ? <img src={studioLogo} alt="" className="h-full w-full object-cover" /> : <Brush className={`text-brand-gold ${iconClassName}`} />}
      </span>

      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className={`truncate font-serif font-bold tracking-[0.24em] text-brand-green-dark ${titleClassName}`}>
          PRADNYA
        </span>
        <span className={`mt-1 truncate font-sans uppercase text-brand-gold ${subtitleClassName}`}>
          {MEHENDI_ENABLED ? 'Bridal Beauty Studio' : 'Bridal Makeup Studio'}
        </span>
      </span>
    </Link>
  );

  const actionButtons = (
    <div className="flex min-w-0 items-center justify-end gap-2">
      <a
        href={callHref}
        className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 text-brand-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold/10 hover:shadow-[0_10px_20px_rgba(184,155,29,0.12)]"
        title="Call Studio"
        aria-label="Call Studio"
      >
        <Phone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand-gold/20 px-4 text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold/35 hover:shadow-[0_10px_20px_rgba(20,53,37,0.08)]"
      >
        <MessageCircle className="h-4 w-4" />
        <span>WhatsApp</span>
      </a>

      <Link
        to="/availability"
        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-brand-ivory gold-luxury-button shadow-[0_10px_24px_rgba(184,155,29,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(184,155,29,0.22)]"
      >
        Book Consultation
      </Link>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-brand-gold/15 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-ivory/90 shadow-[0_14px_40px_rgba(20,53,37,0.08)] backdrop-blur-xl'
          : 'bg-brand-ivory/96 shadow-[0_8px_24px_rgba(20,53,37,0.05)] backdrop-blur-xl'
      }`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 lg:hidden">
          {logoBlock('min-w-0', 'h-6 w-6', 'text-[1rem]', 'text-[8px] tracking-[0.3em]')}

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-ivory text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-beige/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="hidden lg:flex xl:hidden h-20 items-center justify-between gap-4">
          {logoBlock('min-w-0', 'h-6 w-6', 'text-[1.08rem]', 'text-[9px] tracking-[0.28em]')}

          <div className="flex items-center gap-3">
            <a
              href={callHref}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/25 text-brand-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-gold/10"
              aria-label="Call Studio"
              title="Call Studio"
            >
              <Phone className="h-4 w-4" />
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-brand-gold/20 px-4 text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold/35"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>

            <Link
              to="/availability"
              className="inline-flex h-11 items-center justify-center rounded-full px-4 text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-brand-ivory gold-luxury-button shadow-[0_10px_24px_rgba(184,155,29,0.18)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Consultation
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-ivory text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-beige/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-4 py-4 xl:py-5">
          <div className="flex items-center justify-between gap-6">
            {logoBlock('min-w-0', 'h-8 w-8', 'text-[1.18rem] 2xl:text-[1.26rem]', 'text-[10px] 2xl:text-[11px] tracking-[0.34em]')}
            {actionButtons}
          </div>

          <nav className="flex items-center justify-center">
            <div className="flex max-w-full items-center justify-center gap-1.5 overflow-x-auto rounded-full border border-brand-gold/15 bg-brand-ivory/75 px-4 py-2 shadow-[0_8px_24px_rgba(20,53,37,0.04)] backdrop-blur-sm">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                  {({ isActive }) => (
                    <span className="relative inline-flex items-center">
                      <span>{item.label}</span>
                      <span
                        className={`absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 origin-center rounded-full bg-brand-gold transition-transform duration-300 ease-out ${
                          isActive
                            ? 'scale-x-100 opacity-100'
                            : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                        }`}
                      />
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-black xl:hidden"
            />

            <motion.div
              id="mobile-navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-[94vw] max-w-[24rem] flex-col overflow-hidden rounded-l-[2rem] border-l border-brand-gold/15 bg-brand-ivory shadow-[0_24px_60px_rgba(0,0,0,0.2)] lg:hidden xl:hidden"
            >
              <div className="shrink-0 flex items-start justify-between gap-4 border-b border-brand-gold/15 px-6 py-6">
                {logoBlock(
                  'min-w-0',
                  'h-7 w-7',
                  'text-[1.02rem]',
                  'text-[9px] tracking-[0.3em]'
                )}

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/15 text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-beige/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="shrink-0 border-b border-brand-gold/10 px-6 py-5">
                <p className="max-w-[16rem] font-sans text-[11px] leading-5 text-brand-charcoal/65">
                  Bridal makeup, hair styling, and saree draping for Pune brides.
                </p>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-2.5">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeDrawer}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-2xl border px-4 py-4 font-sans text-[14px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${
                          isActive
                            ? 'border-brand-gold/35 bg-brand-beige/45 text-brand-green-dark shadow-[0_8px_22px_rgba(20,53,37,0.06)]'
                            : 'border-transparent text-brand-charcoal/80 hover:border-brand-gold/15 hover:bg-brand-beige/20'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{item.label}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isActive ? 'translate-x-1 text-brand-gold' : 'text-brand-gold/70'
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </nav>

              <div className="shrink-0 border-t border-brand-gold/15 px-5 py-5">
                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={callHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-gold/25 px-5 text-xs font-sans font-semibold tracking-[0.22em] uppercase text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-gold/5"
                  >
                    <Phone className="h-4 w-4" />
                    Call Studio
                  </a>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-gold/20 px-5 text-xs font-sans font-semibold tracking-[0.22em] uppercase text-brand-green-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(184,155,29,0.16)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Inquiry
                  </a>

                  <Link
                    to="/availability"
                    onClick={closeDrawer}
                    className="inline-flex h-12 items-center justify-center rounded-full px-5 text-xs font-sans font-semibold tracking-[0.22em] uppercase text-brand-ivory gold-luxury-button shadow-[0_10px_24px_rgba(184,155,29,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
