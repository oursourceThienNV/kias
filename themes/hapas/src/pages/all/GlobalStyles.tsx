/**
 * Global Styles Component
 * Import global SCSS once for entire application
 */

import React from 'react';
import { ComponentLayout } from '@evershop/evershop';
import '../../styles/theme.scss'; // Import global styles ONCE

export default function GlobalStyles() {
  // This component doesn't render anything visible
  return <></>;
}

export const layout: ComponentLayout = {
  areaId: 'head',
  sortOrder: 1
};

