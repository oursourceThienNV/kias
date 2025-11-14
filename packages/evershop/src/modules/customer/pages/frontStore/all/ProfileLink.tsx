import React from 'react';

export default function ProfileLink() {
  return null;
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 12
};

export const query = `
  query {
    customer: currentCustomer { uuid }
  }
`;
