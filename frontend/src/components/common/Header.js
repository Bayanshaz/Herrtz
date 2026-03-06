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
      setScrolled(window.scrollY > 50);
      // Close menu when scrolling starts
      if (window.scrollY > 50) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
    { id: '/', label: 'HOME', type: 'link' },
    { id: '/gallery', label: 'GALLERY', type: 'link' },
    { id: 'team', label: 'TEAM', type: 'scroll' },
    { id: 'services', label: 'SERVICES', type: 'scroll' },
    { id: 'contact', label: 'CONTACT', type: 'scroll' }
  ];

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <nav className="navbar">
          {/* Logo on left */}
          <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
            <img src="/logo.png" alt="Harrtz Concepts" className="logo-img" />
          </Link>

          {/* Horizontal Navigation - visible on desktop when NOT scrolled */}
          {!scrolled && window.innerWidth > 992 && (
            <ul className="nav-links horizontal-nav">
              {navItems.map(item => (
                <li key={item.id}>
                  {item.type === 'link' ? (
                    <Link 
                      to={item.id} 
                      onClick={() => {
                        if (item.id === '/gallery') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={location.pathname === item.id ? 'active' : ''}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span onClick={() => handleNavClick(item.id)}>
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Menu Icon - visible on mobile OR when scrolled on desktop */}
          {(window.innerWidth <= 992 || scrolled) && (
            <div className="menu-icon-container" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX /> : <FiMenu />}
            </div>
          )}

          {/* Dropdown Menu - appears when icon is clicked */}
          {isOpen && (
            <div className="dropdown-menu">
              {navItems.map(item => (
                <div key={item.id} className="dropdown-item">
                  {item.type === 'link' ? (
                    <Link 
                      to={item.id} 
                      onClick={() => {
                        setIsOpen(false);
                        if (item.id === '/gallery') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={location.pathname === item.id ? 'active' : ''}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span onClick={() => handleNavClick(item.id)}>
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;