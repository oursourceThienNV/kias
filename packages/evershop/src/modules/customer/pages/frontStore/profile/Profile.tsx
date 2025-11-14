import Area from '@components/common/Area.js';
import AccountInfo from '@components/frontStore/customer/AccountInfo.js';
import { MyAddresses } from '@components/frontStore/customer/MyAddresses.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export default function Profile() {
  return (
    <div className="page-width">
      <h1 className="text-center">{_('My Profile')}</h1>
      <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-7">
        <div className="col-span-1 md:col-span-2">
          {/* Add custom profile content here if needed */}
        </div>
        <div className="col-span-1">
          <AccountInfo title={_('Account Information')} showLogout />
        </div>
      </div>
      <div className="mt-7">
        <MyAddresses title={_('Address Book')} />
        <Area id="profilePageAddressBook" noOuter />
      </div>
    </div>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };

export const query = `
  query {
    customer: currentCustomer {
      uuid
      fullName
      email
    }
  }
`;
