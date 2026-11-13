import type { PortfolioCategory, PortfolioItem, Service, Testimonial } from '../types/studio';

// Flip this to true to restore mehendi pages and content without rebuilding the data.
export const MEHENDI_ENABLED = false;
export const STUDIO_NAME = MEHENDI_ENABLED ? 'Pradnya Bridal Studio' : 'Pradnya Bridal Makeup Studio';
export const DEFAULT_EVENT_TYPE = MEHENDI_ENABLED ? 'Bridal Mehendi & Makeup Combo' : 'Bridal Makeup Only';

export const isPublicServiceEnabled = (service: Service) =>
  MEHENDI_ENABLED || service.category !== 'mehendi';

export const isPublicPortfolioEnabled = (item: PortfolioItem) =>
  MEHENDI_ENABLED || !item.category.includes('mehendi');

export const isPublicPortfolioCategoryEnabled = (category: PortfolioCategory | 'all') =>
  MEHENDI_ENABLED || category === 'all' || !category.includes('mehendi');

export const isPublicTestimonialEnabled = (testimonial: Testimonial) =>
  MEHENDI_ENABLED || testimonial.category === 'makeup';
