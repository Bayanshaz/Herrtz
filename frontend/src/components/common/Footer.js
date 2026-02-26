import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const navigate = useNavigate();

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  const handleNavClick = (sectionId) => {
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleServiceClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Harrtz Concepts</h3>
            <p>Building your dreams with quality and precision. We are committed to delivering exceptional construction services in Kerala.</p>
            <div className="social-links">
              <button 
                onClick={() => handleSocialClick('https://facebook.com')}
                className="social-btn"
                aria-label="Facebook"
              >
                <FiFacebook />
              </button>
              <button 
                onClick={() => handleSocialClick('https://twitter.com')}
                className="social-btn"
                aria-label="Twitter"
              >
                <FiTwitter />
              </button>
              <button 
                onClick={() => handleSocialClick('https://instagram.com')}
                className="social-btn"
                aria-label="Instagram"
              >
                <FiInstagram />
              </button>
              <button 
                onClick={() => handleSocialClick('https://linkedin.com')}
                className="social-btn"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </button>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/gallery" onClick={() => window.scrollTo(0, 0)}>Gallery</Link></li>
              <li>
                <button 
                  onClick={() => handleNavClick('team')}
                  className="link-btn"
                >
                  Team
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('services')}
                  className="link-btn"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="link-btn"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={handleServiceClick}
                  className="link-btn"
                >
                  Residential Construction
                </button>
              </li>
              <li>
                <button 
                  onClick={handleServiceClick}
                  className="link-btn"
                >
                  Commercial Construction
                </button>
              </li>
              <li>
                <button 
                  onClick={handleServiceClick}
                  className="link-btn"
                >
                  Structural Engineering
                </button>
              </li>
              <li>
                <button 
                  onClick={handleServiceClick}
                  className="link-btn"
                >
                  Renovation & Remodeling
                </button>
              </li>
              <li>
                <button 
                  onClick={handleServiceClick}
                  className="link-btn"
                >
                  Sustainable Building
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Info</h3>
            <ul className="contact-info-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Pathanamthitta, Kerala, India</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+91 8281621295</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@harrtzconcepts.com</span>
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