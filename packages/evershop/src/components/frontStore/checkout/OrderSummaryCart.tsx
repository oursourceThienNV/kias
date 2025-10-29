import React from "react";
import { CartTotalSummary } from "../cart/CartTotalSummary.js";
const OrderSummaryCart = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-0 min-h-[200px] flex flex-col justify-between">
      <h2 className="text-base font-bold mb-4">Tóm tắt đơn hàng</h2>
      <CartTotalSummary />
    </div>
  );
};
export default OrderSummaryCart;
