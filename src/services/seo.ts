import { STUDIO_NAME } from '../config/siteFeatures';

const SITE_NAME = STUDIO_NAME;
const SITE_URL = 'https://pradnyabridalstudio.com';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85';

interface MetaData {
  title: string;
  description: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

const ensureMeta = (selector: string, attribute: 'name' | 'property', key: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  return element;
};

export const getCanonicalUrl = (pathname = window.location.pathname) => {
  const cleanPath = `/${pathname.split('/').filter(Boolean).map(encodeURIComponent).join('/')}`;
  return cleanPath === '/' ? SITE_URL : `${SITE_URL}${cleanPath}`;
};

export const setRobotsDirectives = (content: string) => {
  ensureMeta('meta[name="robots"]', 'name', 'robots').content = content;
};

export const updateSEOMetadata = ({
  title,
  description,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl = getCanonicalUrl(),
  robots = 'index,follow,max-image-preview:large',
}: MetaData) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME} Pune`;
  document.title = fullTitle;

  ensureMeta('meta[name="description"]', 'name', 'description').content = description;
  ensureMeta('meta[property="og:title"]', 'property', 'og:title').content = fullTitle;
  ensureMeta('meta[property="og:description"]', 'property', 'og:description').content = description;
  ensureMeta('meta[property="og:type"]', 'property', 'og:type').content = ogType;
  ensureMeta('meta[property="og:url"]', 'property', 'og:url').content = canonicalUrl;
  ensureMeta('meta[property="og:site_name"]', 'property', 'og:site_name').content = SITE_NAME;
  const absoluteImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  ensureMeta('meta[property="og:image"]', 'property', 'og:image').content = absoluteImage;
  ensureMeta('meta[name="twitter:card"]', 'name', 'twitter:card').content = 'summary_large_image';
  ensureMeta('meta[name="twitter:title"]', 'name', 'twitter:title').content = fullTitle;
  ensureMeta('meta[name="twitter:description"]', 'name', 'twitter:description').content = description;
  ensureMeta('meta[name="twitter:image"]', 'name', 'twitter:image').content = absoluteImage;
  setRobotsDirectives(robots);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
};

export default updateSEOMetadata;
