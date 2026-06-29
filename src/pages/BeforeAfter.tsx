import React, { useState, useRef, useEffect } from 'react';
import { Divider } from '../components/common/Divider';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, MoveHorizontal } from 'lucide-react';

interface Transformation {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  details: string[];
}

const TRANSFORMATIONS: Transformation[] = [
  {
    id: "t-1",
    title: "Traditional Maharashtrian Bride",
    category: "Bridal Makeup",
    description: "Creating a flawless, glowing base with traditional Nauvari nath highlight and classical hair bun.",
    beforeImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", // placeholder
    afterImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    details: [
      "Skin corrected with Estée Lauder Double Wear foundation for long-duration stay.",
      "Custom gold-shimmer eye shadow matched with traditional Nauvari outfit.",
      "Intricate nosepin (Nath) setting and traditional fresh flower (Gajra) hairstyling.",
      "Lashes added for volume and photo definition."
    ]
  },
  {
    id: "t-2",
    title: "Dewy Evening Reception Glamour",
    category: "Reception Makeup",
    description: "Sleek evening look with smoky eyes and high-gloss highlight for a night ceremony.",
    beforeImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    details: [
      "Dewy finish base with high hydration serum prep.",
      "Glitter charcoal eyeshadow and bold winged eyeliner.",
      "Nude-rose lipstick using Charlotte Tilbury Matte Revolution.",
      "Messy chic updo hairstyle to suit designer wedding gown."
    ]
  }
];

export const BeforeAfter: React.FC = () => {
  const [activeId, setActiveId] = useState(TRANSFORMATIONS[0].id);
  const activeTransform = TRANSFORMATIONS.find(t => t.id === activeId) || TRANSFORMATIONS[0];
  
  // Slider State (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Reset slider position on transformation swap
  useEffect(() => {
    const resetSlider = window.requestAnimationFrame(() => {
      setSliderPosition(50);
    });

    return () => window.cancelAnimationFrame(resetSlider);
  }, [activeId]);

  // Handle Drag / Move events
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStart = () => {
    isDragging.current = true;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  // Add global mouseup listeners to prevent sticking when mouse releases outside the widget
  useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Transformations</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Before & After
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Drag the gold slider handle to view the stunning cosmetic transitions of our brides.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Tab Selection */}
        <div className="flex justify-start md:justify-center gap-3 overflow-x-auto pb-3 mb-12">
          {TRANSFORMATIONS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-5 py-2.5 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 border ${
                activeId === t.id
                  ? 'bg-brand-green text-brand-ivory border-brand-green'
                  : 'bg-transparent text-brand-green-dark/80 border-brand-gold/30 hover:border-brand-gold'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Dynamic Comparison Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Custom Slider Widget */}
          <div className="lg:col-span-7 flex justify-center">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] aspect-[4/5] rounded-t-full border-4 border-brand-gold/40 shadow-2xl overflow-hidden select-none cursor-ew-resize"
            >
              {/* After Image (Full width base) */}
              <img 
                src={activeTransform.afterImage} 
                alt="After Makeup Glam" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute bottom-4 right-4 bg-brand-green-dark/80 text-brand-gold text-[10px] tracking-widest px-3 py-1 uppercase font-semibold rounded font-sans">
                After
              </div>

              {/* Before Image (Cropped overlay) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={activeTransform.beforeImage} 
                  alt="Before Makeup" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] tracking-widest px-3 py-1 uppercase font-semibold rounded font-sans pointer-events-none">
                Before
              </div>

              {/* Slider Line Divider */}
              <div 
                className="absolute inset-y-0 w-1 bg-brand-gold pointer-events-none shadow"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* Slider Handle Knob */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-green text-brand-gold border-2 border-brand-gold flex items-center justify-center pointer-events-none shadow-lg slider-handle"
                style={{ left: `${sliderPosition}%` }}
              >
                <MoveHorizontal className="w-5 h-5" />
              </div>

            </div>
          </div>

          {/* Right: Custom Specs/Details */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col space-y-6 items-center lg:items-start">
            <div className="space-y-2">
              <span className="text-xs font-sans font-bold text-brand-gold uppercase tracking-widest block">
                {activeTransform.category} Specs
              </span>
              <h2 className="font-serif text-3xl text-brand-green-dark font-bold tracking-wide">
                {activeTransform.title}
              </h2>
              <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed mt-2">
                {activeTransform.description}
              </p>
            </div>

            <div className="w-full border-t border-b border-brand-gold/15 py-6">
              <h3 className="font-serif text-lg text-brand-green font-bold mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span>Transformation Styling Steps:</span>
              </h3>
              <ul className="space-y-3.5 text-xs font-sans text-brand-charcoal/80">
                {activeTransform.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-brand-gold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2 w-full">
              <Link to="/availability" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full justify-center shadow">
                  Book Makeup consultation
                </Button>
              </Link>
              
              <a 
                href={`https://wa.me/917040496065?text=Hi%20Pradnya%2C%20I%20saw%20your%20Before/After%20transformation%20for%20"${encodeURIComponent(activeTransform.title)}"%20and%20would%20love%20to%20get%20a%20similar%20look%20for%20my%20wedding.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 rounded border border-[#25D366] text-[#25D366] uppercase text-xs tracking-widest font-semibold hover:bg-green-50/5 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default BeforeAfter;
