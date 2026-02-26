import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      // For home page sections (team, services, contact)
      if (location.pathname !== '/') {
        // If not on home page, navigate to home first
        navigate('/');
        // Wait for navigation to complete then scroll
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navItems = [
    { id: '/', label: 'HOME', type: 'link' },
    { id: '/gallery', label: 'GALLERY', type: 'link' },
    { id: 'team', label: 'TEAM', type: 'scroll' },
    { id: 'services', label: 'SERVICES', type: 'scroll' },
    { id: 'contact', label: 'CONTACT', type: 'scroll' }
  ];

  const isActive = (item) => {
    if (item.type === 'link') {
      return location.pathname === item.id;
    }
    return false;
  };

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
                {item.type === 'link' ? (
                  <Link 
                    to={item.id}
                    onClick={() => setIsOpen(false)}
                    className={isActive(item) ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    onClick={() => handleNavClick(item.id)}
                    className={location.pathname === '/' && document.getElementById(item.id) ? 'scroll-link' : 'scroll-link'}
                  >
                    {item.label}
                  </span>
                )}
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