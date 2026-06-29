# Pradnya Bridal Studio - Implementation Deliverables

This document summarizes the remaining production deliverables for the bridal beauty studio website and admin panel.

## 1. Complete Folder Structure

```text
src/
  assets/
  components/
    common/
    layout/
    ui/
  config/
  context/
  hooks/
  pages/
    admin/
  services/
  utils/
public/
docs/
```

## 2. Firestore Schema

### Collections

- `users`
- `services`
- `portfolio`
- `testimonials`
- `blogs`
- `inquiries`
- `availability`
- `settings`
- `media`
- `analytics`

### Suggested Document Shapes

- `users/{uid}`: `{ role, displayName, email, createdAt }`
- `services/{slug}`: `{ title, category, shortDescription, detailedDescription, benefits, process, duration, startingPrice, portfolioExamples, faqs, published }`
- `portfolio/{id}`: `{ title, category, description, imageUrl, videoUrl, tags, isFeatured, createdAt }`
- `testimonials/{id}`: `{ clientName, starRating, reviewText, weddingDate, category, location, isFeatured, createdAt }`
- `blogs/{slug}`: `{ title, excerpt, content, coverImage, tags, author, metaTitle, metaDescription, published, createdAt }`
- `inquiries/{id}`: `{ name, phone, whatsappNumber, email, eventType, eventDate, location, budget, numberOfPeople, message, status, createdAt }`
- `availability/{YYYY-MM-DD}`: `{ status, notes, updatedAt }`
- `settings/studio-config`: `{ studioName, contactPhone, whatsappPhone, contactEmail, instagramUrl, address, googleMapsEmbedUrl, experienceYears, bridesServedCount }`

### Relationships

- `inquiries` reference `services` by `eventType` or service slug.
- `portfolio` items can be tagged to one or more `services`.
- `blogs` can link to `services` or local SEO topics.
- `availability` is keyed by date for fast lookups.

### Indexes

- `inquiries(createdAt desc)`
- `inquiries(status, createdAt desc)`
- `blogs(published, createdAt desc)`
- `portfolio(category, createdAt desc)`
- `testimonials(category, createdAt desc)`
- `availability(status, date asc)`

### Scalability Notes

- Keep the `settings` document single-row.
- Use slugs as IDs for blog and service pages.
- Store media metadata separately when portfolio grows large.
- Consider Firestore pagination for admin lists after 100+ records.

## 3. Security Rules

The current rules support:

- Public reads for portfolio, services, testimonials, blogs, settings, and availability.
- Public inquiry creation.
- Admin-only write access via `users/{uid}.role == "admin"`.

Recommended hardening:

- Validate `request.resource.data` shape for each collection.
- Restrict `inquiries` updates to status fields only.
- Restrict storage uploads to authenticated admin users.
- Add server-side validation if Cloud Functions are introduced later.

## 4. Route Structure

### Public Routes

- `/`
- `/services`
- `/services/:slug`
- `/portfolio`
- `/before-after`
- `/packages`
- `/about`
- `/testimonials`
- `/blog`
- `/blog/:slug`
- `/contact`
- `/availability`

### Admin Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/leads`
- `/admin/portfolio`
- `/admin/services`
- `/admin/blogs`
- `/admin/testimonials`
- `/admin/availability`

## 5. Component Architecture

### Layout Layer

- `AppLayout`
- `AdminLayout`

### Common UI

- `Button`
- `Input`
- `Divider`
- `Header`
- `Footer`

### Reusable Surface Components

- `GlassCard`
- `FloatingCTA`

### Data Layer

- `useFirestore`
- `useStorage`
- `useAuth`
- `dbService`

## 6. Reusable Component Library

- Hero buttons with primary, outline, and WhatsApp variants.
- Premium card shell with glass / gold border treatment.
- Form field primitives for input, select, textarea, and error state.
- Trust metrics strip.
- SEO CTA blocks for inquiry, WhatsApp, and consultation.
- Mobile floating CTA buttons.

## 7. Design System

### Colors

- Primary: deep mehendi green
- Secondary: antique gold
- Accent: champagne gold
- Background: ivory and soft beige
- Text: rich charcoal

### Typography

- Headings: elegant serif
- Body: modern sans serif

### Motion

- Gentle fade in
- Soft hover scale
- Scroll reveal
- Calm transitions only

### Visual Language

- Subtle mandala textures
- Floral and paisley accents
- Fine gold dividers
- Luxury editorial spacing

## 8. UI Screens

- Luxury home page
- Portfolio masonry gallery
- Before/after transformations
- Services detail pages
- Packages comparison page
- About / artist story page
- Testimonials page
- Blog listing and article page
- Contact page
- Availability / inquiry page
- Admin dashboard
- Admin leads manager
- Admin portfolio manager
- Admin services manager
- Admin blog manager
- Admin testimonials manager
- Admin availability manager

## 9. Page Wireframes

### Home

- Hero
- Trust bar
- Featured services
- Portfolio preview
- Bridal journey
- Testimonials
- FAQ
- Instagram preview
- Final CTA

### Portfolio

- Title
- Filter row
- Search
- Masonry gallery
- Lightbox

### Service Detail

- Hero banner
- Benefits
- Process timeline
- Portfolio examples
- FAQ
- CTA panel

### Contact / Availability

- Studio info cards
- Map
- Lead capture form
- Confirmation state

## 10. Admin Panel Architecture

- Protected route gate through Firebase auth.
- Role check on `users/{uid}`.
- Dashboard metrics for leads, portfolio, reviews, and monthly activity.
- CRUD operations for services, portfolio, blogs, testimonials, and availability.
- CSV export for inquiries.

## 11. Firebase Setup

### Required Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Services Used

- Authentication
- Firestore
- Storage
- Hosting

### Recommended Setup

- Seed a single admin user document in `users`.
- Deploy Firestore rules before public launch.
- Use Storage rules for media uploads.

## 12. SEO Strategy

- Route-level meta titles and descriptions.
- Local business schema.
- Breadcrumb schema.
- Sitemap and robots file.
- Keyword clusters for Pune, PCMC, Wakad, Baner, Hinjewadi, Chakan, Nigdi, and Talegaon Dabhade.
- Blog topics targeting bridal intent and local search.
- Canonical URLs for all indexable pages.

## 13. Deployment Guide

- Run build locally with `npm run build`.
- Deploy static assets to Firebase Hosting.
- Publish Firestore and Storage rules first.
- Verify `/admin/login` and protected routes in production.
- Test inquiry flow, upload flow, and availability flow after deployment.

## 14. Future Scaling Plan

- Add pagination and server filters to admin lists.
- Introduce Cloud Functions for validation and notifications.
- Add email or WhatsApp notifications for new inquiries.
- Move analytics events into a dedicated dashboard.
- Add multi-language support if the business expands beyond Pune.

## 15. Full Production-Ready Implementation Plan

### Phase 1

- Finish route coverage and SEO wiring.
- Stabilize admin CRUD.
- Confirm Firestore rules and auth.

### Phase 2

- Add richer portfolio media support.
- Improve lead management workflows.
- Expand blog publishing and internal linking.

### Phase 3

- Add analytics and conversion tracking.
- Add automated notifications and CRM sync.
- Optimize performance and bundle size.

