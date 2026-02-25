import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    
    if (sectionId === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === '/gallery') {
      navigate('/gallery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navItems = [
    { id: '/', label: 'HOME' },
    { id: '/gallery', label: 'GALLERY' },
    { id: 'team', label: 'TEAM' },
    { id: 'services', label: 'SERVICES' },
    { id: 'contact', label: 'CONTACT' }
  ];

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
            <img 
              src="/logo.jpg" 
              alt="Harrtz Concepts" 
              className="logo-img"
            />
          </Link>

          {/* Navigation Links */}
          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            {navItems.map(item => (
              <li key={item.id}>
                <span 
                  onClick={() => handleNavClick(item.id)}
                  style={{ cursor: 'pointer' }}
                  className={location.pathname === item.id ? 'active' : ''}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;