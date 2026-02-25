import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Building Construction Services In Kerala</h1>
          <h2>Build Your Dream with Quality & Precision</h2>
          <p>At Harrtz Concepts, we turn your vision into reality with top-notch construction services. Whether it's a residential home, commercial space, or industrial project, we ensure durable structures, modern aesthetics, and seamless project execution.</p>
          <a href="#contact" className="btn">Get Started</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;