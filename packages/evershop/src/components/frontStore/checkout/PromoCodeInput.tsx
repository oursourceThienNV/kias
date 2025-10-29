import React, { useState } from "react";

const PromoCodeInput = () => {
  const [showCouponModal, setShowCouponModal] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-0 min-h-[90px] flex flex-col justify-between">
      <h2 className="text-base font-bold mb-4">Mã khuyến mãi</h2>
      <div className="flex flex-col gap-3">
        {/* Box chọn mã */}
        <button
          type="button"
          className="flex items-center w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 text-base font-normal justify-between hover:border-black transition"
          onClick={() => setShowCouponModal(true)}
        >
          <span className="flex items-center gap-2">
            {/* Coupon/Voucher icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="4" fill="#E5E7EB" />
              <path
                d="M7 13l6-6M8 8a1 1 0 11-2 0 1 1 0 012 0zm6 6a1 1 0 11-2 0 1 1 0 012 0z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Chọn mã
          </span>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 6l6 6-6 6"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Modal chọn mã khuyến mãi */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl mx-auto p-0 overflow-hidden relative">
              <button
                className="absolute left-4 top-4 text-gray-400 hover:text-gray-700"
                onClick={() => setShowCouponModal(false)}
                aria-label="Đóng"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="flex items-center justify-center border-b px-6 py-4">
                <span className="font-bold text-base w-full text-center">
                  Chọn mã khuyến mãi
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-10 px-6">
                <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" rx="4" fill="#E5E7EB" />
                  <path
                    d="M7 13l6-6M8 8a1 1 0 11-2 0 1 1 0 012 0zm6 6a1 1 0 11-2 0 1 1 0 012 0z"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="text-gray-500 text-base text-center mt-10 mb-2">
                  Không có mã khuyến mãi phù hợp
                </div>
              </div>
              <div className="border-t px-6 py-4">
                <button
                  className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 transition"
                  onClick={() => setShowCouponModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Nhập mã và nút áp dụng */}
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nhập mã khuyến mãi"
          />
          <button
            type="button"
            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
export default PromoCodeInput;
