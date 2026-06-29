/**
 * Dynamic SEO Meta Injections
 */

interface MetaData {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const updateSEOMetadata = ({
  title,
  description,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  canonicalUrl = window.location.href
}: MetaData) => {
  // Update Title
  document.title = `${title} | Pradnya Bridal Studio Pune`;

  // Update Description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    document.head.appendChild(metaDescription);
  }

  // Update OG:Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Update OG:Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  // Update OG:Type
  let ogTypeTag = document.querySelector('meta[property="og:type"]');
  if (!ogTypeTag) {
    ogTypeTag = document.createElement('meta');
    ogTypeTag.setAttribute('property', 'og:type');
    document.head.appendChild(ogTypeTag);
  }
  ogTypeTag.setAttribute('content', ogType);

  // Update OG:Image
  let ogImg = document.querySelector('meta[property="og:image"]');
  if (!ogImg) {
    ogImg = document.createElement('meta');
    ogImg.setAttribute('property', 'og:image');
    document.head.appendChild(ogImg);
  }
  ogImg.setAttribute('content', ogImage);

  // Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);
};
export default updateSEOMetadata;
