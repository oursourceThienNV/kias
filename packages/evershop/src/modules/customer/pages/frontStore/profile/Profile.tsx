import Area from '@components/common/Area.js';
import AccountInfo from '@components/frontStore/customer/AccountInfo.js';
import { MyAddresses } from '@components/frontStore/customer/MyAddresses.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

export default function Profile() {
  return (
    <div className="page-width py-8">
      <h1 className="text-2xl font-bold mb-6">{_('Thông tin cá nhân')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-gray-200 rounded">
            <h2 className="text-lg font-semibold mb-4">{_('Thông tin tài khoản')}</h2>
            <AccountInfo />
          </div>
        </div>

        {/* Address Book */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 border border-gray-200 rounded">
            <h2 className="text-lg font-semibold mb-4">{_('Thông tin địa chỉ')}</h2>
            <MyAddresses />
            <Area id="profilePageAddressBook" noOuter />
          </div>
        </div>
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
