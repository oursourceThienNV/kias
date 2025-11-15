import { ItemProps } from "@components/frontStore/cart/CartItems.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";

const CartSummarySkeleton: React.FC<{ rows?: number }> = ({ rows = 2 }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center py-6 animate-pulse">
          <div className="relative mr-4">
            <div className="w-16 h-16 bg-gray-200 rounded border p-2 box-border" />
            <span className="absolute -top-2 -right-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 text-sm">
              {i + 1}
            </span>
          </div>
          <div className="flex-1 min-w-0 items-start align-top">
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/5 mb-1" />
          </div>
          <div className="ml-auto text-right">
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </li>
      ))}
    </ul>
  );
};

const CartSummaryItemsList: React.FC<{
  items: ItemProps[];
  loading: boolean;
  onIncreaseItem?: (itemId: string) => void;
  onDecreaseItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
}> = ({ items, loading, onIncreaseItem, onDecreaseItem, onRemoveItem }) => {
  if (loading) {
    return <CartSummarySkeleton rows={items.length} />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-base">{_("Your cart is empty")}</p>
        <p className="text-sm mt-2">{_("Add some items to get started")}</p>
      </div>
    );
  }

  function formatVnPrice(input: any) {
    if (!input) return "";
    if (typeof input === "object" && input.value !== undefined) {
      return (
        Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
          input.value
        ) + "đ"
      );
    }
    const str =
      typeof input === "object" && input.text ? input.text : String(input);
    const match = str.match(/([0-9]{1,3}(?:[.,][0-9]{3})*)/);
    if (match) {
      const cleaned = match[1].replace(/[.,]/g, "");
      const num = parseInt(cleaned, 10);
      if (!isNaN(num)) {
        return (
          Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(num) +
          "đ"
        );
      }
    }
    return str;
  }

  return (
    <ul className="divide-y divide-gray-100 border-b mb-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center py-4 gap-3 relative">
          {/* Ảnh sản phẩm */}
          <div className="flex-shrink-0">
            {item.thumbnail ? (
              <img
                src={item.thumbnail} 
                alt={item.thumbnail}
                className="w-20 h-20 object-cover rounded-md border"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-md border" />
            )}
          </div>
          {/* Thông tin sản phẩm */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="font-normal text-[13px] text-gray-900 mb-1 line-clamp-2 leading-tight">
              {item.name}
            </div>
            {/* Thuộc tính dạng badge */}
            {item.variantOptions && item.variantOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {item.variantOptions.map((option) => (
                  <span
                    key={option.attributeCode}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md"
                  >
                    {option.optionText}
                  </span>
                ))}
              </div>
            )}
            {/* Giá */}
            <div className="text-[15px] font-semibold text-gray-900 mt-1">
              {formatVnPrice(item.lineTotal)}
            </div>
          </div>
          {/* Số lượng và nút xóa */}
          <div className="flex flex-col justify-between items-end gap-2 min-w-[70px]">
            <button
              className="text-gray-400 hover:text-gray-700 transition-colors p-1"
              aria-label="Remove item"
              onClick={() => onRemoveItem && onRemoveItem(item.id)}
              disabled={loading}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={() => onDecreaseItem && onDecreaseItem(item.id)}
                disabled={loading || item.qty <= 1}
                className="flex items-center justify-center text-gray-600 px-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="flex items-center justify-center px-2 text-gray-900 min-w-[3rem] text-center border-l border-r">
                {item.qty}
              </span>
              <button
                onClick={() => onIncreaseItem && onIncreaseItem(item.id)}
                disabled={loading}
                className="flex items-center justify-center text-gray-600 px-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export { CartSummaryItemsList };
