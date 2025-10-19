import React from 'react';
import './HapasLogo.scss';

/**
 * HAPAS Logo Component
 * 
 * Custom logo component matching HAPAS.VN branding:
 * - Clean, minimalist design
 * - Responsive sizing
 * - Fallback text logo if image fails
 * - Optimized for Vietnamese brand identity
 */
export default function HapasLogo({ themeConfig }) {
  const logoConfig = themeConfig?.brand?.logo || {};
  const brandName = themeConfig?.brand?.name || 'HAPAS';
  const tagline = themeConfig?.brand?.tagline || 'Điều bình thường tươi đẹp';

  // Logo configuration with defaults
  const logoSrc = logoConfig.src || '/themes/hapas/assets/logo/hapas-logo.svg';
  const logoAlt = logoConfig.alt || `${brandName} Logo`;
  const logoWidth = logoConfig.width || 120;
  const logoHeight = logoConfig.height || 40;

  const handleImageError = (e) => {
    // Hide image and show text logo on error
    e.target.style.display = 'none';
    const textLogo = e.target.nextElementSibling;
    if (textLogo) {
      textLogo.style.display = 'block';
    }
  };

  return (
    <a href="/" className="hapas-logo" title={`${brandName} - ${tagline}`}>
      {/* Image Logo */}
      <img
        src={logoSrc}
        alt={logoAlt}
        width={logoWidth}
        height={logoHeight}
        className="logo-image"
        onError={handleImageError}
        loading="eager"
      />
      
      {/* Fallback Text Logo */}
      <div className="logo-text" style={{ display: 'none' }}>
        <span className="brand-name vietnamese-text">{brandName}</span>
        <span className="brand-tagline vietnamese-text">{tagline}</span>
      </div>
    </a>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'logo',
  sortOrder: 1
};

// GraphQL query to get theme configuration
export const query = `
  query getThemeConfig {
    themeConfig {
      brand {
        name
        tagline
        logo {
          src
          alt
          width
          height
        }
      }
    }
  }
`;
