/**
 * Cloudinary Image Utilities
 * Handles image optimization and transformations
 */

// Default placeholder image
export const PLACEHOLDER_IMAGE = '/placeholder-image.jpg';

/**
 * Check if URL is from Cloudinary
 * @param {string} url - Image URL
 * @returns {boolean} - True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url?.includes('cloudinary.com') || false;
};

/**
 * Get optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImage = (url, options = {}) => {
  // If no URL, return placeholder
  if (!url) {
    console.log('⚠️ No URL provided, using placeholder');
    return PLACEHOLDER_IMAGE;
  }
  
  // Log the URL for debugging
  console.log('🔍 Processing image URL:', url);

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    console.log('✅ Cloudinary URL detected');
    
    // Default transformations
    const defaults = {
      quality: 'auto',
      fetchFormat: 'auto',
      width: options.width || null,
      height: options.height || null,
      crop: options.crop || 'limit'
    };
    
    // Build transformation string
    let transformations = [];
    if (defaults.quality) transformations.push(`q_${defaults.quality}`);
    if (defaults.fetchFormat) transformations.push(`f_${defaults.fetchFormat}`);
    if (defaults.width) transformations.push(`w_${defaults.width}`);
    if (defaults.height) transformations.push(`h_${defaults.height}`);
    if (defaults.crop) transformations.push(`c_${defaults.crop}`);
    
    // Apply transformations if any
    if (transformations.length > 0) {
      const transformationString = transformations.join(',');
      const optimizedUrl = url.replace('/upload/', `/upload/${transformationString}/`);
      console.log('✨ Optimized Cloudinary URL:', optimizedUrl);
      return optimizedUrl;
    }
    
    return url;
  }
  
  // Handle local paths (from old uploads) - these won't work
  if (url.startsWith('/uploads')) {
    console.warn('⚠️ Local image path detected (will not work in production):', url);
    return PLACEHOLDER_IMAGE;
  }
  
  // Handle relative paths
  if (url.startsWith('//')) {
    const fullUrl = `https:${url}`;
    console.log('🔗 Converted relative URL to HTTPS:', fullUrl);
    return fullUrl;
  }
  
  // Handle other URLs
  console.log('📎 Using URL as-is:', url);
  return url;
};

/**
 * Generate srcSet for responsive images
 * @param {string} url - Cloudinary URL
 * @param {Array} widths - Array of widths for srcSet
 * @returns {string} - srcSet string
 */
export const getSrcSet = (url, widths = [320, 640, 960, 1280]) => {
  if (!url || !url.includes('cloudinary.com')) return '';

  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImage(url, { width, crop: 'scale' });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Get blur-up placeholder (low quality image placeholder)
 * @param {string} url - Cloudinary URL
 * @returns {string} - Low quality placeholder URL
 */
export const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return PLACEHOLDER_IMAGE;
  
  return getOptimizedImage(url, {
    width: 20,
    quality: 10,
    crop: 'scale'
  });
};

/**
 * Get image dimensions based on usage context
 */
export const imageDimensions = {
  thumbnail: { width: 150, height: 150, crop: 'fill' },
  gallery: { width: 400, height: 300, crop: 'limit' },
  projectMain: { width: 1024, height: 768, crop: 'limit' },
  projectGrid: { width: 300, height: 200, crop: 'limit' },
  teamMember: { width: 500, height: 500, crop: 'fill', gravity: 'face' },
  hero: { width: 1920, height: 1080, crop: 'limit' }
};

/**
 * Debug function to check image URL
 * @param {string} url - Image URL to check
 */
export const debugImageUrl = (url) => {
  console.log('🔍 Debugging image URL:', {
    url: url,
    type: typeof url,
    isEmpty: !url,
    isCloudinary: url?.includes('cloudinary.com') || false,
    isLocal: url?.startsWith('/uploads') || false,
    length: url?.length || 0
  });
  return url;
};