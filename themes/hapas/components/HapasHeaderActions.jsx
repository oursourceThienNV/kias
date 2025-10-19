import React, { useState } from 'react';
import './HapasHeaderActions.scss';

/**
 * HAPAS Header Actions Component
 * 
 * Header action buttons matching HAPAS.VN design:
 * - Search toggle
 * - User account
 * - Shopping cart with badge
 * - Clean, minimalist icons
 * - Mobile responsive
 */
export default function HapasHeaderActions({ cartCount = 0, isLoggedIn = false }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="hapas-header-actions">
      {/* Search Action */}
      <button 
        className="action-button search-button"
        onClick={toggleSearch}
        aria-label="Tìm kiếm sản phẩm"
        title="Tìm kiếm"
      >
        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      {/* User Account Action */}
      <a 
        href={isLoggedIn ? "/account" : "/login"}
        className="action-button account-button"
        aria-label={isLoggedIn ? "Tài khoản của tôi" : "Đăng nhập"}
        title={isLoggedIn ? "Tài khoản" : "Đăng nhập"}
      >
        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </a>

      {/* Shopping Cart Action */}
      <a 
        href="/cart"
        className="action-button cart-button"
        aria-label={`Giỏ hàng (${cartCount} sản phẩm)`}
        title="Giỏ hàng"
      >
        <div className="cart-icon-wrapper">
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
          </svg>
          
          {/* Cart Badge */}
          {cartCount > 0 && (
            <span className="cart-badge" aria-hidden="true">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
      </a>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <div className="search-form">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="search-input vietnamese-text"
                autoFocus
              />
              <button 
                type="submit"
                className="search-submit"
                aria-label="Tìm kiếm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
            
            <button 
              className="search-close"
              onClick={toggleSearch}
              aria-label="Đóng tìm kiếm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div 
            className="search-backdrop"
            onClick={toggleSearch}
          />
        </div>
      )}
    </div>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'headerActions',
  sortOrder: 1
};
