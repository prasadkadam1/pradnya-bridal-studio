import React, { useState } from 'react';
import { usePortfolio } from '../hooks/useFirestore';
import { Divider } from '../components/common/Divider';
import { Search, X, MessageSquare, ZoomIn, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioItem } from '../types/studio';
import { hasPortfolioImage } from '../utils/portfolioImages';
import { isPublicPortfolioEnabled, isPublicPortfolioCategoryEnabled, MEHENDI_ENABLED } from '../config/siteFeatures';

const ALL_CATEGORIES = [
  { value: 'all', label: 'All Work' },
  { value: 'bridal-mehendi', label: 'Bridal Mehendi' },
  { value: 'arabic-mehendi', label: 'Arabic Mehendi' },
  { value: 'traditional-mehendi', label: 'Traditional Mehendi' },
  { value: 'bridal-makeup', label: 'Bridal Makeup' },
  { value: 'reception-makeup', label: 'Reception Makeup' },
  { value: 'party-makeup', label: 'Party Makeup' }
];
const CATEGORIES = ALL_CATEGORIES.filter((category) =>
  isPublicPortfolioCategoryEnabled(category.value as PortfolioItem['category'] | 'all'),
);

export const Portfolio: React.FC = () => {
  const { data: portfolioItems, isLoading } = usePortfolio();
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  // Filter items based on Category & Search Query
  const filteredItems = portfolioItems?.filter(item => {
    if (!isPublicPortfolioEnabled(item)) return false;
    const matchesCategory = selectedCat === 'all' || item.category === selectedCat;
    
    const searchText = `${item.title} ${item.description} ${item.tags?.join(' ')}`.toLowerCase();
    const matchesSearch = searchText.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Our Gallery</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Bridal Makeup Portfolio
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            {MEHENDI_ENABLED ? 'A visual anthology of our mehendi artistry and customized makeup looks.' : 'Explore bridal makeup, reception glam, and occasion looks created for modern Pune brides.'}
          </p>
          <Divider variant="simple" />
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-brand-gold/15 pb-8">
          
          {/* Scrollable Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap overflow-x-auto pb-3 md:pb-0 scrollbar-thin flex-grow max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCat(cat.value)}
                className={`px-4 py-2 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 whitespace-nowrap border shrink-0 ${
                  selectedCat === cat.value
                    ? 'bg-brand-green text-brand-ivory border-brand-green'
                    : 'bg-transparent text-brand-green-dark/75 border-brand-gold/25 hover:border-brand-gold'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gold">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search e.g. Portrait, HD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-brand-ivory border border-brand-gold/30 rounded focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-sans text-xs"
            />
          </div>

        </div>

        {/* Pinterest style columns layout */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-brand-beige/10 border border-dashed border-brand-gold/30 rounded">
            <p className="font-serif text-lg text-brand-green">No portfolio items found</p>
            <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="relative aspect-[9/16] rounded border border-brand-gold/20 bg-brand-ivory shadow group overflow-hidden cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                {/* Image */}
                {hasPortfolioImage(item.imageUrl) ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-green-dark/5 px-4 text-center"><span className="font-sans text-[10px] uppercase tracking-widest text-brand-green-dark/55">Image coming soon</span></div>
                )}

                {/* Dark Hover overlay */}
                <div className="absolute inset-0 bg-brand-green-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <div className="absolute top-4 right-4 text-brand-gold p-1 bg-brand-green-dark rounded-full border border-brand-gold/35">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  
                  <span className="text-[8px] font-sans text-brand-gold-champagne uppercase tracking-widest font-bold">
                    {item.category.replace('-', ' ')}
                  </span>
                  
                  <h3 className="font-serif text-base font-bold text-brand-gold mt-1">
                    {item.title}
                  </h3>
                  
                  <p className="font-sans text-[11px] text-brand-ivory/80 mt-1 leading-normal">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-sans bg-brand-green-light/30 text-brand-ivory/80 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Full screen Lightbox Component */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          >
            {/* Click outside to close container */}
            <div className="absolute inset-0" onClick={() => setLightboxItem(null)} />

            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-brand-green text-brand-gold border border-brand-gold/30 hover:bg-brand-green-dark transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 max-w-5xl w-full bg-brand-green-dark text-brand-ivory border border-brand-gold/30 rounded shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh]"
            >
              
              {/* Image Pane */}
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[50vh] md:max-h-[80vh]">
                {hasPortfolioImage(lightboxItem.imageUrl) ? (
                  <img src={lightboxItem.imageUrl} alt={lightboxItem.title} className="max-w-full max-h-full object-contain" />
                ) : <span className="font-sans text-xs uppercase tracking-widest text-brand-gold">Image coming soon</span>}
              </div>

              {/* Text Pane */}
              <div className="w-full md:w-80 p-5 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-brand-gold/20 shrink-0 text-left bg-brand-green-dark/95">
                <div className="space-y-4">
                  <span className="text-[9px] font-sans text-brand-gold uppercase tracking-widest font-bold">
                    {lightboxItem.category.replace('-', ' ')}
                  </span>
                  
                  <h2 className="font-serif text-2xl text-brand-gold font-bold leading-tight">
                    {lightboxItem.title}
                  </h2>
                  
                  <p className="font-sans text-xs text-brand-ivory/80 leading-relaxed">
                    {lightboxItem.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {lightboxItem.tags?.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-sans bg-brand-green/80 text-brand-gold-champagne px-2 py-0.5 rounded border border-brand-gold/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 space-y-3">
                  <a
                    href={`https://wa.me/917040496065?text=Hi%20Pradnya%2C%20I%27m%20interested%20in%20a%20design%20similar%20to%20your%20portfolio%20item%20"${encodeURIComponent(lightboxItem.title)}"%20(${lightboxItem.id}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded bg-[#25D366] text-white uppercase text-xs tracking-widest font-semibold hover:bg-[#20ba5a] transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  
                  <button
                    onClick={() => {
                      setLightboxItem(null);
                      // Redirect to availability
                      window.location.hash = "/availability"; // fallback if React Router is hash-based or we programmatically push
                    }}
                    className="w-full py-3 rounded text-brand-green-dark text-xs uppercase tracking-widest font-bold gold-luxury-button hover:opacity-95 flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Check Date Availability</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Portfolio;
