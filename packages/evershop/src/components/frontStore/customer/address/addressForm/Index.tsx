import { CustomerAddressForm } from '@components/frontStore/customer/address/addressForm/AddressForm.js';
import { AddressFormLoadingSkeleton } from '@components/frontStore/customer/address/addressForm/AddressFormLoadingSkeleton.js';
import { CustomerAddressGraphql } from '@evershop/evershop/types/customerAddress.js';
import React from 'react';
import { useQuery } from 'urql';

const CountriesQuery = `
  query Country {
    allowedCountries  {
      value: code
      label: name
      provinces {
        label: name
        value: code
      }
    }
  }
`;

interface IndexProps {
  address?: CustomerAddressGraphql;
  areaId?: string;
  fieldNamePrefix?: string;
}

export default function Index({
  address = {},
  areaId = 'customerAddressForm',
  fieldNamePrefix = 'address'
}: IndexProps) {
  const [result] = useQuery({
    query: CountriesQuery
  });

  const { data, fetching, error } = result;

  if (fetching) return <AddressFormLoadingSkeleton />;
  if (error || !data || !data.allowedCountries || data.allowedCountries.length === 0) {
    // fallback options nếu không có dữ liệu
    const fallbackCountries = [
      {
        value: 'VN',
        label: 'Vietnam',
        provinces: [
          { value: 'SG', label: 'Hồ Chí Minh' },
          { value: 'HN', label: 'Hà Nội' },
          { value: 'DN', label: 'Đà Nẵng' }
        ]
      },
      {
        value: 'US',
        label: 'United States',
        provinces: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' }
        ]
      }
    ];
    return (
      <CustomerAddressForm
        address={address}
        areaId={areaId}
        allowCountries={fallbackCountries}
        fieldNamePrefix={fieldNamePrefix}
      />
    );
  }

  return (
    <CustomerAddressForm
      address={address}
      areaId={areaId}
      allowCountries={data.allowedCountries}
      fieldNamePrefix={fieldNamePrefix}
    />
  );
}
