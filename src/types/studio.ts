export type ServiceCategory = 'mehendi' | 'makeup' | 'styling';
export type PortfolioCategory =
  | 'bridal-mehendi'
  | 'arabic-mehendi'
  | 'traditional-mehendi'
  | 'engagement-mehendi'
  | 'bridal-makeup'
  | 'reception-makeup'
  | 'party-makeup';
export type TestimonialCategory = 'mehendi' | 'makeup' | 'both';
export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'archived';
export type AvailabilityStatus = 'available' | 'limited' | 'booked';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: 'admin' | 'staff';
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  detailedDescription: string;
  benefits: string[];
  process: ServiceProcessStep[];
  duration: string;
  startingPrice: number;
  portfolioExamples: string[];
  faqs: ServiceFaq[];
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  category: PortfolioCategory;
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
  category: TestimonialCategory;
  isFeatured: boolean;
  location: string;
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface BlogPost {
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
  status: InquiryStatus;
  createdAt: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  reminderNotes?: string;
  internalNotes?: string;
  preferredContactChannel?: 'whatsapp' | 'call' | 'email';
  lastContactMessage?: string;
}

export interface AvailabilityEntry {
  date: string;
  status: AvailabilityStatus;
  notes?: string;
  updatedAt?: string;
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

export interface QuickReplyTemplate {
  id: string;
  label: string;
  message: string;
}
