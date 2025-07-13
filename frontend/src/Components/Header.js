//reusable header section
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`grace-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">Grace</div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">Who are we?</Link>
          <Link to="/services">Services</Link>
        </nav>

        <div className="nav-button">
          <Button text="Get Started" />
        </div>
      </div>
    </header>
  );
}

export default Header;