import React from "react";
import {
  useCustomer,
  useCustomerDispatch,
} from "@components/frontStore/customer/customerContext.js";

export function IsLoginCustomer() {
  const { customer: account } = useCustomer();
  const { logout } = useCustomerDispatch();
  const loginUrl = "/account/login";
  const isLoggedIn = !!account;

  if (isLoggedIn && account) {
    return (
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold m-0">Tài khoản</h2>
            <button
              onClick={async () => {
                await logout();
                window.location.href = loginUrl;
              }}
              className="text-gray-500 hover:text-red-500 font-medium text-sm bg-transparent border-0 cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold mr-4">
              {/* Avatar ký tự đầu */}
              {account.fullName
                ? account.fullName
                    .split(" ")
                    .slice(-2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                : account.email[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900">
                {account.fullName || "Khách hàng"}
              </div>
              <div className="text-sm text-gray-500">{account.email}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện chưa đăng nhập giữ nguyên
  return (
    <div className="w-full">
      {/* Box đăng nhập */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <span className="text-sm text-gray-700">
          Đăng nhập để mua hàng tiện lợi và nhận nhiều ưu đãi hơn nữa
        </span>
        <a
          href={loginUrl}
          className="ml-4 px-5 py-2 bg-gray-100 rounded-lg text-base font-semibold text-gray-800 border border-gray-300 hover:bg-gray-200 transition"
        >
          Đăng nhập
        </a>
      </div>
    </div>
  );
}
