import React, { useState, useEffect } from 'react';
import { Area } from '@evershop/evershop/src/components/common/Area';
import './HapasHeader.scss';

/**
 * HAPAS Header Component
 * 
 * Custom header matching HAPAS.VN design:
 * - Centered logo
 * - Vietnamese navigation menu
 * - Account/Cart actions on right
 * - Sticky header with blur effect
 * - Mobile responsive
 */
export default function HapasHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vietnamese menu items matching HAPAS.VN structure
  const menuItems = [
    { label: 'MỚI', url: '/moi', description: 'Sản phẩm mới nhất' },
    { label: 'SET BỘ', url: '/set-bo', description: 'Bộ sưu tập set đồ' },
    { label: 'VÁY & ĐẦM', url: '/vay-dam', description: 'Váy và đầm thời trang' },
    { label: 'QUẦN', url: '/quan', description: 'Quần các loại' },
    { label: 'ÁO', url: '/ao', description: 'Áo thời trang' }
  ];

  return (
    <header className={`hapas-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Left Section - Navigation (Desktop) */}
          <div className="header-left">
            <nav className="main-navigation desktop-only">
              <ul className="nav-menu">
                {menuItems.slice(0, 2).map((item, index) => (
                  <li key={index} className="nav-item">
                    <a 
                      href={item.url} 
                      className="nav-link vietnamese-text"
                      title={item.description}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-toggle mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Center Section - Logo */}
          <div className="header-center">
            <Area id="logo" className="logo-area" />
          </div>

          {/* Right Section - Navigation + Actions */}
          <div className="header-right">
            <nav className="main-navigation desktop-only">
              <ul className="nav-menu">
                {menuItems.slice(2).map((item, index) => (
                  <li key={index} className="nav-item">
                    <a 
                      href={item.url} 
                      className="nav-link vietnamese-text"
                      title={item.description}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Header Actions */}
            <div className="header-actions">
              <Area id="headerActions" className="actions-area" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-navigation ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <ul className="mobile-nav-menu">
              {menuItems.map((item, index) => (
                <li key={index} className="mobile-nav-item">
                  <a 
                    href={item.url} 
                    className="mobile-nav-link vietnamese-text"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                    <span className="nav-description">{item.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'header',
  sortOrder: 1
};
