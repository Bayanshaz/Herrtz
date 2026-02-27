import React, { useEffect, useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImage, PLACEHOLDER_IMAGE, debugImageUrl, isCloudinaryUrl } from '../../utils/imageUtils';

const PhotoViewer = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Log images array for debugging
    console.log('🖼️ PhotoViewer received images:', images);
    console.log('📊 Total images:', images?.length || 0);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onPrev, onNext, images]);

  // Update current image URL when index changes
  useEffect(() => {
    if (images && images.length > 0) {
      const url = images[currentIndex];
      console.log(`🔄 Loading image at index ${currentIndex}:`, url);
      debugImageUrl(url);
      setCurrentImageUrl(url);
    }
  }, [currentIndex, images]);

  const handleImageLoad = (index) => {
    console.log(`✅ Image loaded successfully at index ${index}`);
    setLoadedImages(prev => ({ ...prev, [index]: true }));
    // Clear error if previously set
    if (imageErrors[index]) {
      setImageErrors(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleImageError = (index) => {
    const failedUrl = images[index];
    console.error(`❌ Failed to load image at index ${index}:`, failedUrl);
    console.log('🔍 Failed URL details:', {
      url: failedUrl,
      type: typeof failedUrl,
      isEmpty: !failedUrl,
      isCloudinary: failedUrl?.includes('cloudinary.com') || false,
      isLocal: failedUrl?.startsWith('/uploads') || false,
      length: failedUrl?.length || 0
    });
    
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setLoadedImages(prev => ({ ...prev, [index]: false }));
  };

  const handleDownload = async () => {
    try {
      const imageUrl = images[currentIndex];
      console.log('📥 Downloading image:', imageUrl);
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download completed');
    } catch (error) {
      console.error('❌ Download failed:', error);
    }
  };

  // Get the current image URL with error handling
  const getCurrentDisplayImage = () => {
    if (!images || images.length === 0) {
      console.warn('⚠️ No images provided to PhotoViewer');
      return PLACEHOLDER_IMAGE;
    }

    if (imageErrors[currentIndex]) {
      console.log('🔄 Using placeholder due to error');
      return PLACEHOLDER_IMAGE;
    }

    const url = images[currentIndex];
    if (!url) {
      console.warn('⚠️ Empty URL at index', currentIndex);
      return PLACEHOLDER_IMAGE;
    }

    // Optimize Cloudinary URLs
    if (url.includes('cloudinary.com')) {
      return getOptimizedImage(url, { width: 1200 });
    }

    return url;
  };

  // Get thumbnail image URL
  const getThumbnailUrl = (url, index) => {
    if (!url || imageErrors[`thumb-${index}`]) {
      return PLACEHOLDER_IMAGE;
    }

    if (url.includes('cloudinary.com')) {
      return getOptimizedImage(url, { width: 100, height: 100, crop: 'fill' });
    }

    return url;
  };

  const handleThumbnailError = (index) => {
    console.warn(`⚠️ Thumbnail failed to load at index ${index}`);
    setImageErrors(prev => ({ ...prev, [`thumb-${index}`]: true }));
  };

  if (!images || images.length === 0) {
    console.error('❌ PhotoViewer: No images provided');
    return (
      <AnimatePresence>
        <motion.div 
          className="photo-viewer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="photo-viewer-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="photo-viewer-header">
              <div className="photo-counter">0 / 0</div>
              <div className="photo-actions">
                <button className="photo-action-btn close-btn" onClick={onClose} title="Close">
                  <FiX />
                </button>
              </div>
            </div>
            <div className="photo-viewer-body">
              <div className="photo-wrapper">
                <img 
                  src={PLACEHOLDER_IMAGE} 
                  alt="No images available"
                  className="photo-viewer-image loaded"
                />
                <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                  No images to display
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const displayImage = getCurrentDisplayImage();
  const totalImages = images.length;

  return (
    <AnimatePresence>
      <motion.div 
        className="photo-viewer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="photo-viewer-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="photo-viewer-header">
            <div className="photo-counter">
              {currentIndex + 1} / {totalImages}
            </div>
            <div className="photo-actions">
              <button 
                className="photo-action-btn" 
                onClick={handleDownload} 
                title="Download"
                disabled={imageErrors[currentIndex]}
              >
                <FiDownload />
              </button>
              <button 
                className="photo-action-btn close-btn" 
                onClick={onClose} 
                title="Close"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="photo-viewer-body">
            {totalImages > 1 && (
              <>
                <button 
                  className="photo-nav-btn prev" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onPrev(); 
                  }}
                  title="Previous"
                >
                  <FiChevronLeft />
                </button>
                <button 
                  className="photo-nav-btn next" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onNext(); 
                  }}
                  title="Next"
                >
                  <FiChevronRight />
                </button>
              </>
            )}
            
            <div className="photo-wrapper">
              {!loadedImages[currentIndex] && !imageErrors[currentIndex] && (
                <div className="image-loader">
                  <div className="loader"></div>
                  <p style={{ color: 'white', marginTop: '10px' }}>Loading image...</p>
                </div>
              )}
              <img 
                src={displayImage} 
                alt={`Project view ${currentIndex + 1}`}
                className={`photo-viewer-image ${loadedImages[currentIndex] ? 'loaded' : 'loading'}`}
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
                loading="lazy"
              />
              {imageErrors[currentIndex] && (
                <div className="image-error-message">
                  <p>Failed to load image</p>
                  <button 
                    onClick={() => {
                      setImageErrors(prev => ({ ...prev, [currentIndex]: false }));
                      // Force reload by toggling URL
                      setCurrentImageUrl(prev => prev + '?reload=' + Date.now());
                    }}
                    className="retry-btn"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {totalImages > 1 && (
            <div className="photo-thumbnails">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                const thumbnailUrl = getThumbnailUrl(img, idx);
                
                return (
                  <div 
                    key={idx}
                    className={`thumbnail-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      const diff = idx - currentIndex;
                      if (diff > 0) {
                        for (let i = 0; i < diff; i++) onNext();
                      } else {
                        for (let i = 0; i < Math.abs(diff); i++) onPrev();
                      }
                    }}
                  >
                    <img 
                      src={thumbnailUrl} 
                      alt={`Thumbnail ${idx + 1}`}
                      onError={() => handleThumbnailError(idx)}
                    />
                    {imageErrors[`thumb-${idx}`] && (
                      <div className="thumbnail-error">
                        <FiX />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Add CSS for error states */}
      <style jsx>{`
        .image-error-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          background: rgba(0, 0, 0, 0.7);
          padding: 20px;
          border-radius: 10px;
          z-index: 10;
        }

        .retry-btn {
          background: var(--secondary);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 5px;
          margin-top: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-btn:hover {
          background: #b8945f;
          transform: scale(1.05);
        }

        .thumbnail-error {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .photo-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .photo-action-btn:disabled:hover {
          background: transparent;
          transform: none;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default PhotoViewer;