import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    if (window.location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <section className="cta">
      <div className="container">
        <h2>Start Your Construction Journey with Us!</h2>
        <p>Let's bring your dream project to life.</p>
        <button onClick={handleContactClick} className="btn">Contact Us Today</button>
      </div>
    </section>
  );
};

export default CTA;