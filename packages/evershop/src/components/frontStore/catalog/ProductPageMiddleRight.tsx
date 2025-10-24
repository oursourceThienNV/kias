import React, { useState } from "react";
import { useProduct } from "@components/frontStore/catalog/productContext.js";

export const ProductPageMiddleRight = () => {
  const { price = 983000, colors, sizes } = useProduct() || {};
  // Dữ liệu mẫu nếu không có từ graphQL
  const colorOptions = colors || [
    { label: "Xanh", value: "blue", color: "#A9B7C6" },
    { label: "Đen", value: "black", color: "#000000" },
    { label: "Trắng", value: "white", color: "#FFFFFF" },
  ];
  const sizeOptions = sizes || [
    { label: "24", value: "24" }
  ];

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0].value);
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      {/* Giá sản phẩm */}
      <div className="mt-2 mb-4">
        <div className="text-pink-500 text-2xl font-semibold mb-2">
          {price.toLocaleString("vi-VN")}₫
        </div>
        <hr className="my-4" />
      </div>

      {/* Màu sắc */}
      <div className="mb-4">
        <div className="mb-2 font-medium">Màu sắc:</div>
        <div className="flex gap-3">
          {colorOptions.map((c) => (
            <button
              key={c.value}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedColor === c.value ? "border-black" : "border-gray-300"}`}
              style={{ background: c.color }}
              onClick={() => setSelectedColor(c.value)}
              aria-label={c.label}
            >
              {selectedColor === c.value && (
                <span className="w-3 h-3 rounded-full border border-white bg-white opacity-40"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Kích thước */}
      <div className="mb-4">
        <div className="mb-2 font-medium">Kích thước:</div>
        <div className="flex gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s.value}
              className={`w-16 h-10 border rounded flex items-center justify-center ${selectedSize === s.value ? "border-black" : "border-gray-300"} text-gray-500`}
              onClick={() => setSelectedSize(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Số lượng */}
      <div className="mb-4 flex items-center">
        <span className="mr-4 font-medium">Số lượng:</span>
        <button
          className="w-8 h-8 border rounded bg-gray-50 text-lg"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
        >-</button>
        <span className="mx-2 w-8 h-8 flex items-center justify-center border rounded bg-gray-50">{quantity}</span>
        <button
          className="w-8 h-8 border rounded bg-gray-50 text-lg"
          onClick={() => setQuantity(q => q + 1)}
        >+</button>
        <a href="#" className="ml-auto underline text-sm">Tìm cửa hàng còn hàng</a>
      </div>

      <hr className="my-4" />
    </div>
  );
};