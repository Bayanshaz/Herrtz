import React, { useEffect, useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImage, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';

const PhotoViewer = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onPrev, onNext]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const currentImage = imageErrors[currentIndex] 
    ? PLACEHOLDER_IMAGE 
    : images[currentIndex];

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
              {currentIndex + 1} / {images.length}
            </div>
            <div className="photo-actions">
              <button className="photo-action-btn" onClick={handleDownload} title="Download">
                <FiDownload />
              </button>
              <button className="photo-action-btn close-btn" onClick={onClose} title="Close">
                <FiX />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="photo-viewer-body">
            {images.length > 1 && (
              <>
                <button 
                  className="photo-nav-btn prev" 
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  title="Previous"
                >
                  <FiChevronLeft />
                </button>
                <button 
                  className="photo-nav-btn next" 
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
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
                </div>
              )}
              <img 
                src={getOptimizedImage(currentImage, { width: 1200 })} 
                alt={`Project view ${currentIndex + 1}`}
                className={`photo-viewer-image ${loadedImages[currentIndex] ? 'loaded' : 'loading'}`}
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
                loading="lazy"
              />
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="photo-thumbnails">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`thumbnail-item ${idx === currentIndex ? 'active' : ''}`}
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
                    src={getOptimizedImage(img, { width: 100, height: 100, crop: 'fill' })} 
                    alt={`Thumbnail ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoViewer;