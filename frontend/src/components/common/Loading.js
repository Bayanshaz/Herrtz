import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="loading-screen">
      <motion.div 
        className="loading-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loader-container">
          <div className="loader-ring"></div>
          <div className="loader-ring loader-ring-2"></div>
          <div className="loader-ring loader-ring-3"></div>
        </div>
        
        <motion.h1 
          className="loading-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="loading-harrtz">Harrtz</span>{' '}
          <span className="loading-concepts">Concepts.</span>
        </motion.h1>
        
        <motion.p 
          className="loading-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Building your harrtz  desires
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;