// Helper function to get optimized Cloudinary images
export const getOptimizedImage = (url, options = {}) => {
  if (!url) return '/placeholder-image.jpg';
  
  // If it's already a Cloudinary URL, we can add transformations
  if (url.includes('cloudinary.com')) {
    // You can add transformation parameters here
    // For example, to resize: url.replace('/upload/', '/upload/w_500,h_500/')
    return url;
  }
  
  // If it's a local path or other URL, return as is
  return url;
};

// Get responsive image srcSet
export const getSrcSet = (url, widths = [320, 640, 960, 1280]) => {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  return widths
    .map(width => `${url.replace('/upload/', `/upload/w_${width}/`)} ${width}w`)
    .join(', ');
};