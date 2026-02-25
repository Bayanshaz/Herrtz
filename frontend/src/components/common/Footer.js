import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Harrtz Concepts</h3>
            <p>Building your dreams with quality and precision. We are committed to delivering exceptional construction services in Kerala.</p>
            <div className="social-links">
              <a href="#"><FiFacebook /></a>
              <a href="#"><FiTwitter /></a>
              <a href="#"><FiInstagram /></a>
              <a href="#"><FiLinkedin /></a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul className="footer-links">
              <li><a href="#">Residential Construction</a></li>
              <li><a href="#">Commercial Construction</a></li>
              <li><a href="#">Structural Engineering</a></li>
              <li><a href="#">Renovation & Remodeling</a></li>
              <li><a href="#">Sustainable Building</a></li>
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