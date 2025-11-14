/**
 * CustomerIcon Component - Override Core EverShop CustomerIcon
 * 
 * This overrides packages/evershop/src/modules/customer/pages/frontStore/all/CustomerIcon.tsx
 * Returns empty to prevent duplicate with HapasHeaderActions
 */

import React from 'react';

export default function CustomerIcon() {
  return null;
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 10
};

export const query = `
  query Query {
    customer: currentCustomer { uuid }
  }
`;

