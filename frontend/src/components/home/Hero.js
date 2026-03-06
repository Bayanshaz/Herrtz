import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Array of 4 local images from public folder
  const backgroundImages = [
    '/images/hero2.jpeg',
    '/images/hero1.jpeg',
    '/images/hero3.jpeg',
    '/images/hero4.jpeg'
  ];

  // Auto slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleTransitionComplete = () => {
    setCurrentImageIndex(nextImageIndex);
    setIsTransitioning(false);
  };

  return (
    <section className="hero" id="home">
      {/* Current Background Image */}
      <div 
        className="hero-bg-image current"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImages[currentImageIndex]})`,
          zIndex: 1
        }}
      />

      {/* Next Background Image with Zoom Effect */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={nextImageIndex}
            className="hero-bg-image next"
            initial={{ scale: 1.2, x: '-10%', opacity: 0 }}
            animate={{ scale: 1, x: '0%', opacity: 1 }}
            onAnimationComplete={handleTransitionComplete}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImages[nextImageIndex]})`,
              zIndex: 2
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Your content here */}
        </motion.div>
      </div>

      {/* Image indicators */}
      <div className="slider-indicators" style={{ zIndex: 3 }}>
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
            onClick={() => {
              setIsTransitioning(true);
              setNextImageIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;