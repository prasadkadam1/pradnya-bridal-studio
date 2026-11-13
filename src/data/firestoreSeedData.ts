import { STUDIO_NAME } from '../config/siteFeatures';

export interface Service {
  id: string;
  title: string;
  category: 'mehendi' | 'makeup' | 'styling';
  shortDescription: string;
  detailedDescription: string;
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  duration: string;
  startingPrice: number;
  portfolioExamples: string[];
  faqs: { question: string; answer: string }[];
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientImage?: string;
  videoUrl?: string;
  starRating: number;
  reviewText: string;
  weddingDate: string;
  category: 'mehendi' | 'makeup' | 'both';
  isFeatured: boolean;
  location: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
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
  status: 'new' | 'contacted' | 'booked' | 'archived';
  createdAt: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  reminderNotes?: string;
  internalNotes?: string;
  preferredContactChannel?: 'whatsapp' | 'call' | 'email';
  lastContactMessage?: string;
}

export interface Availability {
  date: string; // YYYY-MM-DD
  status: 'available' | 'limited' | 'booked';
  notes?: string;
}

export interface StudioSettings {
  studioName: string;
  contactPhone: string;
  whatsappPhone: string;
  contactEmail: string;
  instagramUrl: string;
  address: string;
  googleMapsEmbedUrl: string;
  experienceYears: number;
  bridesServedCount: number;
}

export const DEFAULT_SETTINGS: StudioSettings = {
  studioName: STUDIO_NAME,
  contactPhone: "",
  whatsappPhone: "",
  contactEmail: "pradnyakadam8027@gmail.com",
  instagramUrl: "https://instagram.com/pradnyabridal",
  address: "Siddharth Heights, opposite Balgandharva, J.M. Road, Shivajinagar, Pune - 411005",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.080517551042!2d73.84439061489283!3d18.525287687405234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07be1555555%3A0xe5cdcdad22b7a9de!2sShivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
  experienceYears: 8,
  bridesServedCount: 1200
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "bridal-mehendi",
    title: "Bridal Mehendi",
    category: "mehendi",
    shortDescription: "Exquisite traditional full-hand and leg bridal mehendi telling your beautiful love story.",
    detailedDescription: "Our signature Bridal Mehendi service includes intricate customized figures, portraits of the bride and groom, marriage rituals (varmala, doli, shehnai), and personal motifs that depict your love story. The stain color is guaranteed to be rich and deep using our 100% natural, hand-prepared mehendi paste.",
    benefits: [
      "100% organic, chemical-free henna paste for dark long-lasting stains",
      "Custom storytelling motifs (doli, baraat, couple initials, portraits)",
      "In-home or venue services across Pune and PCMC areas",
      "Stain warranty - post-application care instructions and complimentary clove oil styling session"
    ],
    process: [
      { step: 1, title: "Design Consultation", description: "Select from traditional Rajasthani, lotus-mandala, or modern luxury-minimalist designs, and plan couple portraits." },
      { step: 2, title: "Henna Preparation", description: "We crush and blend premium Sojat henna leaves with pure eucalyptus and lavender oils 24 hours prior to application." },
      { step: 3, title: "Application Session", description: "Intricate application by the lead artist and assistants. Takes about 4 to 6 hours for a full heavy bridal set." },
      { step: 4, title: "Aftercare & Sealant", description: "Application of a special sugar-lemon glaze followed by steam activation to guarantee a deep rich mahogany stain." }
    ],
    duration: "4 - 6 Hours",
    startingPrice: 8500,
    portfolioExamples: [],
    faqs: [
      { question: "How long before the wedding should I apply bridal mehendi?", answer: "We recommend applying mehendi 2 days (48 hours) prior to the wedding event for the stain to reach its maximum peak color intensity." },
      { question: "Do you bring your own mehendi paste?", answer: "Yes, we prepare our own 100% organic mehendi fresh for every bride, using essential oils that are completely safe for all skin types." }
    ]
  },
  {
    id: "bridal-makeup",
    title: "Bridal Makeup",
    category: "makeup",
    shortDescription: "Flawless HD & Airbrush makeup designed to glow under photography and last all day.",
    detailedDescription: "High-definition bridal makeup tailored to match your skin tone, outfits, and wedding lighting. We utilize premium international brands (MAC, Huda Beauty, Charlotte Tilbury, Estée Lauder) to deliver a seamless, lightweight, water-resistant coverage that highlights your natural features.",
    benefits: [
      "HD and Airbrush techniques tailored for high-res wedding videography",
      "Pre-wedding skin analysis and customizable trial options",
      "Include premium false lashes and high-end setting sprays",
      "Complementary touch-up kit provided for the reception dinner"
    ],
    process: [
      { step: 1, title: "Skin Analysis & Prep", description: "Cleansing, toning, and intense hydration treatment depending on your skin type to create a smooth, glowing canvas." },
      { step: 2, title: "Color Correction", description: "Custom correcting of under-eyes and spots to achieve an even complexion before applying base makeup." },
      { step: 3, title: "Base & Eye Makeup", description: "Seamless foundation application using HD techniques, custom eyeshadow blending, and lash placement." },
      { step: 4, title: "Setting & Styling", description: "Locks in the look using premium setting sprays, adding finishing touches to high points of the face." }
    ],
    duration: "2 - 3 Hours",
    startingPrice: 15000,
    portfolioExamples: [],
    faqs: [
      { question: "Do you offer makeup trials?", answer: "Yes, we offer paid bridal trials. If you confirm your booking, a portion of the trial fee is adjusted in the final packages." },
      { question: "Will the makeup look heavy in person?", answer: "Not at all. We specialize in dynamic editorial styles that look incredibly natural and lightweight in person while showing up flawless in photography." }
    ]
  },
  {
    id: "arabic-mehendi",
    title: "Arabic Mehendi",
    category: "mehendi",
    shortDescription: "Elegant bold patterns, leafy vines, and floral paisleys with signature negative space layouts.",
    detailedDescription: "Stunning Arabic designs featuring bold outlines, shading, floral vines, and contemporary structures. Arabic mehendi looks very modern and highlights hands with negative-space geometry, making it a favorite for bridesmaids, family events, and festivals.",
    benefits: [
      "Modern minimalist styling with clean outlines",
      "Quick application - ideal for pre-wedding family gatherings",
      "Complements both ethnic and Indo-western wear",
      "Dark stain promise using premium organic henna"
    ],
    process: [
      { step: 1, title: "Design Matching", description: "Pick from classic Arabic trails, geometric vines, or heavy floral-shading designs." },
      { step: 2, title: "Direct Henna Sketching", description: "Freehand application highlighting bold floral and leafy motifs." },
      { step: 3, title: "Shading details", description: "Filling in leaves and petals with gradient dots and fine hatching lines." }
    ],
    duration: "1 - 2 Hours",
    startingPrice: 2500,
    portfolioExamples: [],
    faqs: [
      { question: "Is Arabic mehendi suitable for engagement ceremonies?", answer: "Absolutely. It's a highly recommended option if you want a classy, less dense design for your fingers and palms during your engagement." }
    ]
  },
  {
    id: "reception-makeup",
    title: "Reception Makeup",
    category: "makeup",
    shortDescription: "Glamorous and glowing look styled to shine under night-reception spotlights.",
    detailedDescription: "A slightly more dramatic, evening look featuring contouring, shimmer highlights, premium smokey or glitter eyes, and statement lips. Styled perfectly to complement heavy designer lehengas, gowns, and jewelry.",
    benefits: [
      "High-shine glass-skin finish suited for evening indoor/outdoor stages",
      "Lash styling and eye-contour enhancement",
      "Sweat and smudge resistant properties",
      "Complimentary hairstyle consultation"
    ],
    process: [
      { step: 1, title: "Cleansing & Priming", description: "Pore minimizing and mattifying primers to control oils under hot studio lights." },
      { step: 2, title: "Contour & Sculpt", description: "Highlighting facial features to ensure they pop in professional evening photography." },
      { step: 3, title: "Eyes & Lips Glam", description: "Applying metallics, glitters, or smoky shadows, matched with rich long-wear liquid lip colors." }
    ],
    duration: "2 Hours",
    startingPrice: 12000,
    portfolioExamples: [],
    faqs: [
      { question: "Can we change the hairstyle between the wedding and reception?", answer: "Yes. We offer combo styling packages where our hair stylist can do a quick transformation from a traditional wedding bun/braid to reception open-curls or an elegant updo." }
    ]
  }
];

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    imageUrl: "",
    category: "bridal-mehendi",
    title: "Royal Rajasthani Bridal Mehendi",
    description: "Detailed doli and couple portrait theme for our lovely bride from Koregaon Park.",
    tags: ["Bridal", "Rajasthani", "Full Hand", "Portraits"],
    isFeatured: true,
    createdAt: "2026-05-15T12:00:00Z"
  },
  {
    id: "p2",
    imageUrl: "",
    category: "arabic-mehendi",
    title: "Floral Vine Arabic Henna",
    description: "Elegant Arabic trail with negative space shading for bridesmaids.",
    tags: ["Arabic", "Vines", "Floral", "Bridesmaids"],
    isFeatured: true,
    createdAt: "2026-05-20T10:00:00Z"
  },
  {
    id: "p3",
    imageUrl: "",
    category: "traditional-mehendi",
    title: "Lotus Mandala Fusion",
    description: "Traditional Lotus circles merged with contemporary grid bands.",
    tags: ["Lotus", "Mandala", "Symmetrical"],
    isFeatured: false,
    createdAt: "2026-05-22T09:00:00Z"
  },
  {
    id: "p4",
    imageUrl: "",
    category: "bridal-makeup",
    title: "Flawless HD Maharashtrian Bride",
    description: "Warm glow base with traditional Nauvari draping and soft gold eye makeup.",
    tags: ["HD Makeup", "Maharashtrian Bride", "Nauvari", "Nath Look"],
    isFeatured: true,
    createdAt: "2026-05-10T14:00:00Z"
  },
  {
    id: "p5",
    imageUrl: "",
    category: "reception-makeup",
    title: "Dewy Reception Glamour",
    description: "Sleek high-contour layout with shimmering charcoal eyes for an evening reception in Hinjewadi.",
    tags: ["Reception", "Evening Glam", "Glitter Eyes", "Charlotte Tilbury"],
    isFeatured: true,
    createdAt: "2026-05-28T18:00:00Z"
  },
  {
    id: "p6",
    imageUrl: "",
    category: "party-makeup",
    title: "Sleek Party Look & Braided Hair",
    description: "Minimalist base makeup with clean winged liner and messy fishtail braid for a pre-wedding cocktail party.",
    tags: ["Party Makeup", "Hairstyling", "Messy Braid", "Cocktail"],
    isFeatured: false,
    createdAt: "2026-06-02T11:00:00Z"
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    clientName: "Neha Kulkarni",
    starRating: 5,
    reviewText: "Pradnya did my bridal makeup and mehendi, and I couldn't have been happier! The mehendi stain was an absolute dark blackish-red and got so many compliments. The makeup stayed fresh from 7 AM till the end of the reception. She is definitely the best in Pune!",
    weddingDate: "2026-04-18",
    category: "both",
    isFeatured: true,
    location: "Kothrud, Pune",
    createdAt: "2026-04-20T10:00:00Z"
  },
  {
    id: "t2",
    clientName: "Aishwarya Patil",
    starRating: 5,
    reviewText: "I booked Pradnya for my engagement mehendi and saree draping. The doli pattern she drew was so clean and precise. Her team is very professional, they arrived right on time at the Baner venue. Highly recommend!",
    weddingDate: "2026-05-02",
    category: "mehendi",
    isFeatured: true,
    location: "Baner, Pune",
    createdAt: "2026-05-04T12:00:00Z"
  },
  {
    id: "t3",
    clientName: "Priyanka Joshi",
    starRating: 5,
    reviewText: "The makeup was outstanding! I wanted a subtle, soft glow and Pradnya delivered exactly that. It didn't look cakey at all, and it felt like my own skin. The hair styling was also beautiful and sturdy.",
    weddingDate: "2026-05-25",
    category: "makeup",
    isFeatured: true,
    location: "Chinchwad, Pune",
    createdAt: "2026-05-27T16:00:00Z"
  }
];

export const DEFAULT_BLOGS: Blog[] = [
  {
    id: "bridal-mehendi-dark-stain-tips",
    title: "10 Secrets to Get a Rich, Dark Bridal Mehendi Stain",
    excerpt: "Want your wedding henna to look deep mahogany red? Check out these natural, proven tips from our top artists.",
    content: `
# 10 Secrets to Get a Rich, Dark Bridal Mehendi Stain

Every bride dreams of a deep, rich mehendi stain on her wedding day. In traditional Indian weddings, it's believed that a darker stain represents deep love and a strong bond. Beyond myths, getting a rich color is a science. Here are the 10 absolute secrets to ensuring your bridal henna stain is dark, vibrant, and long-lasting.

## 1. Avoid Washing Your Hands Before Application
Do not apply moisturizer, body oils, or lotion on your hands and feet before your mehendi session. These products create a barrier over your skin, preventing the henna from absorbing deeply.

## 2. Let It Dry Naturally
Avoid using hair dryers or waving your hands around. Fast drying can cause the henna to flake off before the dye molecules can bind with your skin. Natural drying is key.

## 3. Apply Lemon-Sugar Glaze
Once the mehendi is semi-dry, dab a mixture of sugar and lemon juice gently using a cotton ball. The sugar holds the henna paste to the skin, while the acid in the lemon helps release the dye.

## 4. Keep It On For 6 to 8 Hours
Leave the mehendi paste on your skin for as long as possible. We advise applying it in the late afternoon and leaving it on overnight (for 8-12 hours) if comfortable.

## 5. Harness the Power of Clove Steam
Heat a few cloves on an iron pan and hold your hands over the warm steam. Clove smoke contains active compounds that enhance the oxidation of henna dye, intensifying the dark shade.

## 6. NEVER Use Water to Scrap It Off
When removing dry mehendi, scrape it off gently with your butter knife or nails. Absolutely avoid using water for the first 24 hours, as water halts the oxidation process.

## 7. Apply Mustard Oil or Vicks
Immediately after scraping the dried henna, rub mustard oil or a thin layer of Vicks VapoRub on your hands. Vicks provides heat which activates the color, and mustard oil seals the stain.

## 8. Keep Warm
Henna stains develop much better on warm body temperatures. If you're sitting in a cold air-conditioned room, your stain might not develop as deeply. Wrap up in a shawl or stay warm.

## 9. Avoid Waxing or Manicures Post-Mehendi
Ensure all manicure, pedicure, waxing, and shaving treatments are completed at least 24-48 hours *before* your mehendi application. Doing them after will strip away the top layer of stained skin.

## 10. Start with Fresh, Organic Henna
The ultimate secret lies in the quality of the henna itself. Chemical cones from local markets may give quick color but contain harmful toxins that fade quickly and cause skin reactions. Always hire an artist who prepares fresh, organic, chemical-free henna paste from premium Sojat leaves.
    `,
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    tags: ["Mehendi Care", "Bridal Henna", "Stain Tips", "Pune Weddings"],
    author: "Pradnya K.",
    metaTitle: "How to Get Dark Bridal Mehendi Stain | Pro Tips from Pune Artist",
    metaDescription: "Follow these 10 tips to ensure your bridal henna stain is dark, rich and beautiful on your wedding day. Organic Sojat henna recommendations.",
    published: true,
    createdAt: "2026-06-01T08:00:00Z"
  },
  {
    id: "bridal-makeup-trends-pune-2026",
    title: "Top 5 Bridal Makeup Trends Dominating Pune Weddings in 2026",
    excerpt: "From dewy glass skin to bold traditional lip statements, discover what Pune brides are asking for this season.",
    content: `
# Top 5 Bridal Makeup Trends Dominating Pune Weddings in 2026

Indian bridal makeup has shifted dramatically over the past few seasons. The heavy, layered, cakey bridal masks of the past are officially out. Today's modern brides in Pune and PCMC want to look fresh, modern, and true to themselves while honoring their traditions.

Here are the top 5 makeup trends that are dominating the current wedding season.

## 1. The Glass Skin Finish
A radiant, dewy, transparent skin texture that reflects light beautifully. We achieve this with intense pre-makeup hydration serums, lightweight cream foundations, and liquid highlighters rather than heavy powders. It looks beautiful under natural sunlight and Pune's evening reception lights.

## 2. Monochromatic Rose & Nude Tones
Coordinating the eyes, cheeks, and lips in the same color family (soft peaches, dusty pinks, or warm nudes). This gives a very cohesive, editorial look that matches both heavy red lehengas and champagne pastel gowns.

## 3. Smudged Kohl Eyes with Metallic Halos
Instead of stark black graphic liners, brides are opting for smudged, smokey kohl liners paired with a pop of rose-gold or champagne metallic shimmer right in the center of the eyelid. This makes the eyes look large, romantic, and expressive.

## 4. Flushed, High-Placement Blush
Blush is no longer just for the apples of the cheeks. The current trend is placing a soft peach or rose liquid blush high on the cheekbones, blending it upwards towards the temples. This creates a natural, youthful, lifted look.

## 5. Semi-Matte Statement Lips
While glossy lips are great for bridesmaids, brides are choosing high-pigment, transfer-proof semi-matte lip colors. Classic deep reds, warm maroons, and toasted caramels remain top choices that survive the long wedding rituals and dining sessions.
    `,
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    tags: ["Bridal Makeup", "Trends 2026", "Pune Brides", "HD Makeup"],
    author: "Pradnya K.",
    metaTitle: "Bridal Makeup Trends in Pune 2026 | Glass Skin & Rose Tones",
    metaDescription: "Discover the latest bridal makeup styles trending in Pune. From dewy glass skin to monochromatic rose shades, stay ahead on your big day.",
    published: true,
    createdAt: "2026-06-10T09:00:00Z"
  }
];

export const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq1",
    name: "Roshni Deshmukh",
    phone: "+91 99999 88888",
    whatsappNumber: "919999988888",
    email: "roshni@gmail.com",
    eventType: "Bridal Mehendi & Makeup Combo",
    eventDate: "2026-11-20",
    location: "Koregaon Park, Pune",
    budget: "20,000 - 30,000",
    numberOfPeople: 5,
    message: "Looking for a full package for myself (bride) and Arabic designs for 4 bridesmaids. Please send packages.",
    status: "new",
    createdAt: "2026-06-20T14:30:00Z"
  },
  {
    id: "inq2",
    name: "Meera Shah",
    phone: "+91 98888 77777",
    whatsappNumber: "919888877777",
    email: "meera.shah@yahoo.com",
    eventType: "Reception Makeup",
    eventDate: "2026-12-05",
    location: "JW Marriott, Senapati Bapat Road, Pune",
    budget: "10,000 - 15,000",
    numberOfPeople: 1,
    message: "Need HD evening makeup and elegant updo hair style. Please let me know your availability.",
    status: "contacted",
    createdAt: "2026-06-21T10:00:00Z"
  }
];

export const QUICK_REPLY_TEMPLATES: Array<{
  id: string;
  label: string;
  message: string;
}> = [
  {
    id: 'initial-greeting',
    label: 'Initial greeting',
    message:
      'Hi {name}, thank you for reaching out to Pradnya Bridal Studio. Your wedding details are noted. I would love to confirm your requirements and share the best options for your date.'
  },
  {
    id: 'availability-followup',
    label: 'Availability follow-up',
    message:
      'Hi {name}, just checking in on your wedding date {eventDate}. We are reviewing availability for {eventType} and will confirm the next steps shortly.'
  },
  {
    id: 'package-share',
    label: 'Package share',
    message:
      'Hi {name}, I am sharing the best package options for your {eventType} booking. Let me know your preferred budget and I will suggest the most suitable bridal package.'
  },
  {
    id: 'trial-followup',
    label: 'Trial reminder',
    message:
      'Hi {name}, this is a gentle reminder about your bridal consultation/trial. Please share your convenient time so we can finalize the look and follow-up plan.'
  },
  {
    id: 'booking-confirmation',
    label: 'Booking confirmation',
    message:
      'Hi {name}, your booking is almost confirmed. Please review the details and let me know if you would like any final changes before we lock the date.'
  }
] as const;

export const DEFAULT_AVAILABILITY: Availability[] = [
  { date: "2026-11-20", status: "limited", notes: "1 bridal booking confirmed. Evening slot free." },
  { date: "2026-11-23", status: "booked", notes: "Fully booked for a major wedding in Pimpri." },
  { date: "2026-12-05", status: "available" }
];

