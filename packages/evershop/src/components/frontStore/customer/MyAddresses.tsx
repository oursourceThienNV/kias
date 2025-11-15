import { AddressSummary } from '@components/common/customer/address/AddressSummary.jsx';
import { CheckboxField } from '@components/common/form/CheckboxField.js';
import { Form } from '@components/common/form/Form.js';
import { Modal } from '@components/common/modal/Modal.js';
import { useModal } from '@components/common/modal/useModal.js';
import CustomerAddressForm from '@components/frontStore/customer/address/addressForm/Index.js';
import {
  ExtendedCustomerAddress,
  useCustomer,
  useCustomerDispatch
} from '@components/frontStore/customer/customerContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { toast } from 'react-toastify';

const Address: React.FC<{
  address: ExtendedCustomerAddress;
}> = ({ address }) => {
  const { updateAddress, deleteAddress } = useCustomerDispatch();
  const editModal = useModal();
  const viewModal = useModal();
  
  return (
    <div className={`border rounded p-4 ${address.isDefault ? 'border-blue-500' : 'border-gray-300'}`}>
      {address.isDefault && (
        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2">
          {_('Mặc định')}
        </span>
      )}
      <AddressSummary address={address} />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => editModal.open()}
          className="flex-1 px-3 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
        >
          {_('Sửa')}
        </button>
        <button
          onClick={async () => {
            if (window.confirm(_('Bạn có chắc muốn xóa địa chỉ này?'))) {
              try {
                await deleteAddress(address.addressId);
                toast.success(_('Xóa địa chỉ thành công!'));
              } catch (error) {
                toast.error(error.message);
              }
            }
          }}
          className="flex-1 px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
        >
          {_('Xóa')}
        </button>
      </div>

      {/* View Modal - Disabled Form */}
      <Modal title={_('Xem địa chỉ')} onClose={viewModal.close} isOpen={viewModal.isOpen}>
        <div className="view-address-form">
          <CustomerAddressForm address={address} fieldNamePrefix="" />
        </div>
        <style>{`
          .view-address-form input,
          .view-address-form select,
          .view-address-form textarea {
            pointer-events: none !important;
            background-color: #f3f4f6 !important;
            color: #6b7280 !important;
            opacity: 1 !important;
          }
        `}</style>
      </Modal>

      {/* Edit Modal */}
      <Modal title={_('Sửa thông tin địa chỉ')} onClose={editModal.close} isOpen={editModal.isOpen}>
        <Form
          id="customerAddressForm"
          method="PATCH"
          onSubmit={async (data) => {
            try {
              await updateAddress(address.addressId, data);
              editModal.close();
              toast.success(_('Cập nhật địa chỉ thành công!'));
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          <CustomerAddressForm address={address} fieldNamePrefix="" />
          <CheckboxField
            label={_('Đặt làm mặc định')}
            checked={!!address.isDefault}
            name="is_default"
          />
        </Form>
      </Modal>
    </div>
  );
};

export function MyAddresses({ title }: { title?: string }) {
  const { customer } = useCustomer();
  const { addAddress } = useCustomerDispatch();
  const modal = useModal();
  if (!customer) {
    return null;
  }
  return (
    <div>
      {title && (
        <div className="border-b mb-5 border-gray-200">
          <h2>{_('Thông tin địa chỉ')}</h2>
        </div>
      )}
      {customer.addresses.length === 0 && (
        <div className="order-history-empty">
          {_('Bạn chưa có địa chỉ nào')}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer.addresses.map((address) => (
          <Address key={address.uuid} address={address} />
        ))}
      </div>
      {customer.addresses.length === 0 && (
        <>
          <div className="mt-4">
            <button
              onClick={() => modal.open()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {_('Thêm địa chỉ mới')}
            </button>
          </div>
          <Modal
            title={_('Thêm địa chỉ mới')}
            onClose={modal.close}
            isOpen={modal.isOpen}
          >
            <Form
              id="customerAddressForm"
              method={'POST'}
              onSubmit={async (data) => {
                try {
                  await addAddress(data as ExtendedCustomerAddress);
                  toast.success(_('Thêm địa chỉ thành công!'));
                  modal.close();
                } catch (error) {
                  toast.error(error.message);
                }
              }}
            >
              <CustomerAddressForm address={undefined} fieldNamePrefix="" />
              <CheckboxField
                label={_('Đặt làm mặc định')}
                defaultChecked={false}
                name="is_default"
              />
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}
