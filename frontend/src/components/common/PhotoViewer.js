import React, { useEffect, useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoViewer = ({ images, currentIndex, onClose, onPrev, onNext }) => {
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

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed');
    }
  };

  const getDisplayImage = () => {
    if (!images?.length) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (imageErrors[currentIndex]) return 'https://via.placeholder.com/800x600?text=Error+Loading+Image';
    return images[currentIndex];
  };

  if (!images?.length) return null;

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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="photo-viewer-header">
            <div className="photo-counter">{currentIndex + 1} / {images.length}</div>
            <div className="photo-actions">
              <button onClick={handleDownload} title="Download"><FiDownload /></button>
              <button onClick={onClose} className="close-btn" title="Close"><FiX /></button>
            </div>
          </div>
          
          <div className="photo-viewer-body">
            {images.length > 1 && (
              <>
                <button className="photo-nav-btn prev" onClick={onPrev} title="Previous"><FiChevronLeft /></button>
                <button className="photo-nav-btn next" onClick={onNext} title="Next"><FiChevronRight /></button>
              </>
            )}
            <div className="photo-wrapper">
              <img 
                src={getDisplayImage()} 
                alt={`View ${currentIndex + 1}`}
                onError={() => setImageErrors(prev => ({ ...prev, [currentIndex]: true }))}
              />
            </div>
          </div>
          
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
                  src={img} 
                  alt={`Thumb ${idx + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=Error';
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoViewer;