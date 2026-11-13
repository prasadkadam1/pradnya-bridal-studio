const TEMPORARY_IMAGE_HOSTS = ['images.pexels.com', 'images.unsplash.com'];

export const isTemporaryPortfolioImage = (url?: string) => {
  if (!url) return false;

  try {
    return TEMPORARY_IMAGE_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
};

export const hasPortfolioImage = (url?: string) => Boolean(url) && !isTemporaryPortfolioImage(url);
