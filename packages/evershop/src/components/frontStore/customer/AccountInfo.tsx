import Area from '@components/common/Area.js';
import {
  useCustomer,
  useCustomerDispatch
} from '@components/frontStore/customer/customerContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { toast } from 'react-toastify';

interface AccountInfoProps {
  title?: string;
}
export default function AccountInfo({ title }: AccountInfoProps) {
  const { customer: account } = useCustomer();
  const { logout } = useCustomerDispatch();
  return (
    <div className="account__details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {_('Họ và tên')}
          </label>
          <input
            type="text"
            value={account?.fullName || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {_('Email')}
          </label>
          <input
            type="email"
            value={account?.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
