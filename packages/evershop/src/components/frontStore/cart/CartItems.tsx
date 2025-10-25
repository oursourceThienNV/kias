import Area from "@components/common/Area.js";
import { Image } from "@components/common/Image.js";
import {
  useCartState,
  useCartDispatch,
} from "@components/frontStore/cart/cartContext.js";
import { ItemQuantity } from "@components/frontStore/cart/ItemQuantity.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React, { useState } from "react";

export interface ItemProps {
  id: string;
  name: string;
  url: string;
  sku: string;
  variantOptions: {
    attributeCode: string;
    attributeName: string;
    optionText: string;
  }[];
  thumbnail?: string;
  price: string;
  qty: number;
  lineTotal: string;
  errors: string[];
}

const SkeletonImage: React.FC = () => (
  <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
);

// Skeleton for individual values that preserves layout
const SkeletonValue: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}> = ({ children, loading = false, className = "" }) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <span className={`relative ${className}`}>
      <span className="opacity-0">{children}</span>
      <span className="absolute inset-0 bg-gray-200 rounded animate-pulse" />
    </span>
  );
};

export const SkeletonCartItem: React.FC = () => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start space-x-4">
      <SkeletonImage />
      <div className="flex-1">
        <div className="space-y-2 mb-4">
          <SkeletonValue loading={true}>
            <span className="font-medium text-[15px]">
              Sample Product Name Here
            </span>
          </SkeletonValue>
          <SkeletonValue loading={true}>
                  <span className="text-sm text-gray-500">Size: </span>
          </SkeletonValue>
          <SkeletonValue loading={true}>
            <span className="text-sm text-gray-500">Color: White</span>
          </SkeletonValue>
        </div>

        <div className="flex items-center justify-end gap-8">
          <div className="flex items-center border rounded">
            <span className="px-3 py-2">−</span>
            <SkeletonValue loading={true}>
              <span className="px-4 py-2 min-w-[3rem] text-center">1</span>
            </SkeletonValue>
            <span className="px-3 py-2">+</span>
          </div>

          <SkeletonValue loading={true}>
            <span className="font-medium">1,000,000đ</span>
          </SkeletonValue>

          <div className="w-6 h-6 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Reusable cart table header component
const CartTableHeader: React.FC = () => (
  <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm text-gray-700 uppercase tracking-wide">
    <div>{_("PRODUCT")}</div>
    <Area id="cartTableHeaderColumns" noOuter />
    <div className="text-center">{_("PRICE")}</div>
    <div className="text-center">{_("QUANTITY")}</div>
    <div className="text-center">{_("TOTAL")}</div>
  </div>
);

const CartItemComponent: React.FC<{
  item: ItemProps;
  loading?: boolean;
  onRemoveItem?: (itemId: string) => Promise<void>;
}> = ({ item, loading = false, onRemoveItem }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setShowConfirm(false);
    if (onRemoveItem) {
      setRemoving(true);
      await onRemoveItem(item.id);
      setRemoving(false);
    }
  };

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
    <div>
      <Area id="cartItemBefore" item={item} noOuter />
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 border-b py-4">
        <div className="w-[100px] flex-shrink-0">
          {item.thumbnail ? (
            <img
              src={
                "https://cdn.shopify.com/s/files/1/0456/5070/6581/files/cach-phan-biet-giay-sneaker-chinh-hang_600x600.jpg?v=1663556399"
              }
              alt={item.name}
              className="w-[100px] h-[100px] object-cover"
            />
          ) : (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">{_("No Image")}</span>
            </div>
          )}
        </div>

        <Area id="cartItemAfterImage" item={item} noOuter />

        <div className="flex-1 min-w-[200px] max-w-full md:max-w-[300px]">
          <div className="mb-2">
            {item.url ? (
              <a
                href={item.url}
                className="text-[15px] font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
              >
                {item.name}
              </a>
            ) : (
              <h3 className="text-[15px] font-medium text-gray-900 line-clamp-2">
                {item.name}
              </h3>
            )}
          </div>
          <div>
            {item.price && (
              <div className="text-sm text-black">
                <span className="text-sm font-semibold">
                  {formatVnPrice(item.price)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 ml-auto">
          <ItemQuantity
            initialValue={item.qty}
            cartItemId={item.id}
            min={1}
            max={99}
          >
            {({ quantity, increase, decrease }) => (
              <div className="flex items-center border">
                <button
                  onClick={decrease}
                  disabled={loading || quantity <= 1}
                  className="flex items-center justify-center text-gray-600 px-3 py-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex items-center justify-center px-4 py-2 text-gray-900 min-w-[3rem] text-center border-l border-r">
                  {quantity}
                </span>
                <button
                  onClick={increase}
                  disabled={loading}
                  className="flex items-center justify-center text-gray-600 px-3 py-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </ItemQuantity>

          <div className="font-medium text-right min-w-[120px]">
            <SkeletonValue loading={loading}>
              {formatVnPrice(item.lineTotal) ?? ""}
            </SkeletonValue>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Remove item"
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

          {/* Confirm Remove Modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[90vw] text-center">
                <div className="mb-6 text-[14px] text-gray-900">Bạn chắc chắn muốn bỏ sản phẩm này ra khỏi giỏ hàng?</div>
                <div className="flex justify-center gap-4">
                  <button
                    className="w-[120px] px-6 py-2 rounded bg-black text-white font-bold text-[12px] hover:bg-gray-800 transition-colors"
                    onClick={() => setShowConfirm(false)}
                    disabled={removing}
                  >HỦY</button>
                  <button
                    className="w-[120px] px-6 py-2 rounded bg-[#EC0B0B] text-white font-bold text-[12px] hover:bg-red-700 transition-colors"
                    onClick={handleRemove}
                    disabled={removing}
                  >ĐỒNG Ý</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Area id="cartItemAfterQuantity" item={item} noOuter />
      <Area id="cartItemAfterPrice" item={item} noOuter />

      {!loading && item.errors && item.errors.length > 0 && (
        <div className="col-span-4 mt-2 text-sm text-red-600">
          {item.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <Area id="cartItemAfterErrors" item={item} noOuter />
      <Area id="cartItemAfter" item={item} noOuter />
    </div>
  );
};

const EmptyCart: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p className="text-lg">
        <SkeletonValue loading={loading}>
          {_("Your cart is empty")}
        </SkeletonValue>
      </p>
      <p className="text-sm mt-2">
        <SkeletonValue loading={loading}>
          {_("Add some items to get started")}
        </SkeletonValue>
      </p>
    </div>
  );
};

const DefaultCartItems: React.FC<{
  items: ItemProps[];
  loading: boolean;
  onRemoveItem: (itemId: string) => Promise<void>;
}> = ({ items, loading, onRemoveItem }) => {
  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        <SkeletonCartItem />
        <SkeletonCartItem />
        <SkeletonCartItem />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart loading={loading} />;
  }

  return (
    <div>
      {items.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          loading={loading}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

interface CartItemsProps {
  children?: (props: {
    items: ItemProps[];
    loading: boolean;
    isEmpty: boolean;
    totalItems: number;
    onRemoveItem: (itemId: string) => Promise<void>;
    SkeletonCartItem: React.FC;
    EmptyCart: React.FC<{ loading?: boolean }>;
    CartItemComponent: React.FC<{
      item: ItemProps;
      loading?: boolean;
      onRemoveItem?: (itemId: string) => Promise<void>;
    }>;
  }) => React.ReactNode;
}

function CartItems({ children }: CartItemsProps) {
  const {
    data: cart,
    loading,
    setting: { priceIncludingTax },
  } = useCartState();
  const { removeItem } = useCartDispatch();

  const items = (cart?.items || []).map((item) => ({
    id: item.cartItemId,
    name: item.productName,
    thumbnail: item.thumbnail,
    qty: item.qty,
    sku: item.productSku,
    url: item.productUrl,
    variantOptions: item.variantOptions || [],
    price: priceIncludingTax
      ? item.productPriceInclTax.text
      : item.productPrice.text,
    lineTotal: priceIncludingTax
      ? item.lineTotalInclTax.text
      : item.lineTotal.text,
    errors: item.errors || [],
  }));
  const isEmpty = items.length === 0;
  const totalItems = cart?.totalQty || 0;

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  return (
    <div className="cart-items">
      <Area id="cartItemsBefore" noOuter />
      {children ? (
        children({
          items,
          loading,
          isEmpty,
          totalItems,
          onRemoveItem: handleRemoveItem,
          SkeletonCartItem,
          EmptyCart,
          CartItemComponent,
        })
      ) : (
        <DefaultCartItems
          items={items}
          loading={loading}
          onRemoveItem={handleRemoveItem}
        />
      )}
      <Area id="cartItemsAfter" noOuter />
    </div>
  );
}

export {
  CartItems,
  DefaultCartItems,
  CartItemComponent,
  CartTableHeader,
  EmptyCart,
  SkeletonValue,
};
