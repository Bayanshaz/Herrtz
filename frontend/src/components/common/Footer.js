import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const navigate = useNavigate();

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  const handleSectionClick = (sectionId) => {
    if (window.location.pathname === '/') {
      // If already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* Company Info with Logo */}
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="Harrtz Concepts" className="footer-logo-img" />
            </div>
            <h3>Harrtz Concepts.</h3>
            <p className="footer-description">
             Building your harrtz  desires.
            </p>
            <div className="social-links">
              <button 
                onClick={() => handleSocialClick('https://www.instagram.com/harrtz_concepts?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==')} 
                aria-label="Instagram"
              >
                <FiInstagram />
              </button>
              <button 
                onClick={() => handleSocialClick('https://www.linkedin.com/in/er-h-adhil-ahemed-064744166/')} 
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" onClick={() => window.scrollTo(0, 0)}>
                  Gallery
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionClick('team')} 
                  className="link-btn"
                >
                  Team
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionClick('services')} 
                  className="link-btn"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionClick('contact')} 
                  className="link-btn"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-column">
            <h3>Contact</h3>
            <ul className="contact-info-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Pandalam, Pathanamthitta, Kerala</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+91 8281621295</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>harrtzconcepts@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Harrtz Concepts. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;