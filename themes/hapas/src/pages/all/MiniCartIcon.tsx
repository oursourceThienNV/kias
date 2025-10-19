/**
 * MiniCartIcon Component - Override Core EverShop MiniCartIcon
 * 
 * This overrides packages/evershop/src/modules/checkout/pages/frontStore/all/MiniCartIcon.tsx
 * Returns empty to prevent duplicate with HapasHeaderActions
 */

import React from 'react';
import { ComponentLayout } from '@evershop/evershop';

export default function MiniCartIcon() {
  // Return empty - cart handled by HapasHeaderActions
  return null;
}

export const layout: ComponentLayout = {
  areaId: 'headerMiddleRight',
  sortOrder: 20
};

export const query = `
  query Query {
    cartUrl: url(routeId: "cart"),
  }
`;

