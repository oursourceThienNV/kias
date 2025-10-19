/**
 * CustomerIcon Component - Override Core EverShop CustomerIcon
 * 
 * This overrides packages/evershop/src/modules/customer/pages/frontStore/all/CustomerIcon.tsx
 * Returns empty to prevent duplicate with HapasHeaderActions
 */

import React from 'react';
import { ComponentLayout } from '@evershop/evershop';

export default function CustomerIcon() {
  // Return empty - handled by HapasHeaderActions
  return null;
}

export const layout: ComponentLayout = {
  areaId: 'headerMiddleRight',
  sortOrder: 10
};

export const query = `
  query Query {
    customer: currentCustomer {
      uuid
      fullName
      email
    }
    accountUrl: url(routeId: "account")
    loginUrl: url(routeId: "login")
  }
`;

