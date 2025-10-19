/**
 * Logo Component - Override Core EverShop Logo
 * 
 * This file overrides packages/evershop/src/modules/base/pages/frontStore/all/Logo.tsx
 * By having the same name, EverShop will use this theme version instead of core
 */

import React from 'react';
import { ComponentLayout } from '@evershop/evershop';

interface LogoConfig {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface LogoProps {
  themeConfig?: {
    logo?: LogoConfig;
  };
}

export default function Logo({ 
  themeConfig
}: LogoProps) {
  const [imageError, setImageError] = React.useState(false);
  const logoSrc = themeConfig?.logo?.src || '/logo.png';
  const logoAlt = themeConfig?.logo?.alt || 'HAPAS';

  return (
    <div className="flex items-center justify-center">
      <a 
        href="/" 
        className="flex items-center no-underline"
        aria-label="HAPAS E-commerce - Trang chủ"
      >
        {!imageError && logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt}
            width={themeConfig?.logo?.width || 120}
            height={themeConfig?.logo?.height || 40}
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

export const layout: ComponentLayout = {
  areaId: 'headerMiddleCenter',
  sortOrder: 10
};

export const query = `
  query query {
    themeConfig {
      logo {
        src
        alt
        width
        height
      }
    }
  }
`;

