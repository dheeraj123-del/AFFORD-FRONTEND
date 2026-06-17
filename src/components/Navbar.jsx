import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, LayoutDashboard, Key, Home, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [tokenActive, setTokenActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check token status periodically
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('affordmed_token');
      setTokenActive(!!token);
    };
    checkToken();
    const interval = setInterval(checkToken, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`glass ${styles.navbar}`}>
      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <Link to="/" className={styles.brand} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.logoIcon}>
            <ShoppingBag size={24} className={styles.logoSvg} />
          </div>
          <span className={styles.brandName}>
            Top<span className="gradient-text">Products</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.desktopNav}>
          <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/login" className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}>
            <Key size={18} />
            <span>API Registration</span>
          </Link>

          <div className={styles.divider}></div>

          {/* Token Indicator */}
          <div className={`${styles.statusBadge} ${tokenActive ? styles.activeBadge : styles.inactiveBadge}`}>
            <span className={styles.statusDot}></span>
            <span>{tokenActive ? 'API Active' : 'Offline / Mock'}</span>
          </div>

          {/* Theme Toggle */}
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className={styles.mobileActions}>
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            className={styles.menuBtn} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`glass ${styles.mobileMenu} animate-fade-in`}>
          <Link to="/" className={`${styles.mobileLink} ${isActive('/') ? styles.mobileActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className={`${styles.mobileLink} ${isActive('/dashboard') ? styles.mobileActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/login" className={`${styles.mobileLink} ${isActive('/login') ? styles.mobileActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Key size={20} />
            <span>API Registration</span>
          </Link>
          <div className={styles.mobileDivider}></div>
          <div className={styles.mobileStatus}>
            <span className={`${styles.statusDot} ${tokenActive ? styles.dotActive : ''}`}></span>
            <span>{tokenActive ? 'API Credentials Verified' : 'Demo Mode (Mock API Active)'}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
