import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React, { useEffect, useState } from "react";

export function OrderNote() {

  return (
    <div className="w-full">
      {/* Box thông tin giao hàng */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79192A] resize-none"
          rows={1}
          placeholder="Ghi chú đơn hàng"
        />
      </div>
    </div>
  );
}
