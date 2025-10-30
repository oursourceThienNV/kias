import React from "react";
import { CartItems } from "@components/frontStore/cart/CartItems.js";
import { CartSummaryItemsList } from "@components/frontStore/cart/CartSummaryItems.js";

const CartCheckout = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-0 min-h-[160px] flex flex-col justify-between">
      <h2 className="text-base font-bold mb-4">Giỏ hàng</h2>
      <CartItems>
        {({ items, loading, onIncreaseItem, onDecreaseItem, onRemoveItem }) => (
          <CartSummaryItemsList 
            items={items} 
            loading={loading}
            onIncreaseItem={onIncreaseItem}
            onDecreaseItem={onDecreaseItem}
            onRemoveItem={onRemoveItem}
          />
        )}
      </CartItems>
    </div>
  );
};

export default CartCheckout;
