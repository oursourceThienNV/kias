/**
 * HAPAS Logo Component
 * 
 * - Centered logo matching hapas.vn layout
 * - Responsive sizing
 * - Fallback text logo if image fails
 * - Optimized for Vietnamese brand identity
 */

import React from 'react';

interface LogoConfig {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface HapasLogoProps {
  logoConfig?: LogoConfig;
}

export default function HapasLogo({ 
  logoConfig = {
    src: '/logo.png',
    alt: 'HAPAS E-commerce',
    width: 120,
    height: 40
  }
}: HapasLogoProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="flex items-center justify-center">
      <a 
        href="/" 
        className="flex items-center no-underline"
        aria-label="HAPAS E-commerce - Trang chủ"
      >
        {!imageError && logoConfig.src ? (
          <img
            src={logoConfig.src}
            alt={logoConfig.alt || 'HAPAS'}
            width={logoConfig.width || 120}
            height={logoConfig.height || 40}
            className="max-w-full h-auto object-contain"
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-900 tracking-wider">
            HAPAS
          </span>
        )}
      </a>
    </div>
  );
}

export const layout = {
  areaId: 'headerMiddleCenter',
  sortOrder: 1  // Lower than core Logo (sortOrder: 10) to render first
};
