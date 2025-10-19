/**
 * SearchBox Component - Theme Override
 *
 * Purpose: Disable core SearchBox rendering because we use HapasHeaderActions
 * in the same area. Keeping this override avoids duplicates while following
 * EverShop's component override pattern.
 */

import React from 'react';
import { ComponentLayout } from '@evershop/evershop';

export default function SearchBox() {
  return null;
}

export const layout: ComponentLayout = {
  areaId: 'headerMiddleRight',
  sortOrder: 5
};

export const query = `
  query Query {
    searchPageUrl: url(routeId: "catalogSearch")
  }
`;

