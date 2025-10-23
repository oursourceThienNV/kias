import {
  MiniCartSuggestionList,
} from "./MiniCartSuggestionList.js";
/* eslint-disable react/prop-types */
import Area from "@components/common/Area.js";
import { Image } from "@components/common/Image.js";
import { ProductNoThumbnail } from "@components/common/ProductNoThumbnail.js";
import {
  useCartState,
  CartData,
  CartSyncTrigger,
} from "@components/frontStore/cart/cartContext.js";
import {
  CartItems,
  ItemProps,
  SkeletonValue,
} from "@components/frontStore/cart/CartItems.js";
import { CartTotalSummary } from "@components/frontStore/cart/CartTotalSummary.js";
import { ItemQuantity } from "@components/frontStore/cart/ItemQuantity.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useCallback, useState, useEffect, useRef } from "react";
import "./MiniCart.scss";

interface MiniCartProps {
  cartUrl?: string;
  dropdownPosition?: "left" | "right";
  showItemCount?: boolean;
  renderCartIcon?: (props: {
    totalQty: number;
    onClick: () => void;
    isOpen: boolean;
  }) => ReactNode;
  renderCartDropdown?: (props: {
    cart: CartData | null;
    onClose: () => void;
    cartUrl?: string;
  }) => ReactNode;
  renderCartItems?: (props: {
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
  }) => ReactNode;
  renderEmptyCart?: () => ReactNode;
  onItemRemove?: (itemId: string) => Promise<void> | void;
  className?: string;
  disabled?: boolean;
}

const CartItemComponent: React.FC<{
  item: ItemProps;
  loading?: boolean;
  onRemoveItem?: (itemId: string) => Promise<void>;
}> = ({ item, loading = false, onRemoveItem }) => {
  const handleRemove = async () => {
    if (onRemoveItem) {
      await onRemoveItem(item.id);
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
    <div className="relative flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 bg-white">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.thumbnail ? (
          <Image
            src={
              "https://cdn.shopify.com/s/files/1/0456/5070/6581/files/cach-phan-biet-giay-sneaker-chinh-hang_600x600.jpg?v=1663556399"
            }
            alt={item.name}
            className="object-cover rounded-md"
            width={100}
            height={100}
          />
        ) : (
          <ProductNoThumbnail width={100} height={100} />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 pr-8 justify-center items-center">
        {/* Product Name */}
        <div className="mb-1">
          {item.url ? (
            <a
              href={item.url}
              className="font-normal text-[13px] text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors leading-tight"
            >
              {item.name}
            </a>
          ) : (
            <h3 className="font-normal text-[13px] text-gray-900 line-clamp-2 leading-tight">
              {item.name}
            </h3>
          )}
        </div>

        {/* Variant Options */}
        {item.variantOptions && item.variantOptions.length > 0 && (
          <div className="text-[11px] text-gray-500 mb-2">
            {item.variantOptions.map((option) => (
              <div key={option.attributeCode}>{option.optionText}</div>
            ))}
          </div>
        )}

        {/* Price and Quantity Row */}
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div>
            <span className="text-[13px] font-medium text-gray-900">
              <SkeletonValue>{formatVnPrice(item.price) ?? ""}</SkeletonValue>
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center">
            <ItemQuantity
              initialValue={item.qty}
              cartItemId={item.id}
              min={1}
              max={99}
            >
              {({ quantity, increase, decrease }) => (
                <div className="flex items-center">
                  <button
                    onClick={decrease}
                    disabled={loading || quantity <= 1}
                    className="text-gray-600 text-lg px-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 text-gray-900 text-[13px] min-w-[1.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increase}
                    disabled={loading}
                    className="text-gray-600 text-lg px-2 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
            </ItemQuantity>
          </div>
        </div>

        {/* Remove Icon */}
        <button
          onClick={handleRemove}
          disabled={loading}
          className="absolute top-2 right-1 text-gray-400 hover:text-gray-700 disabled:opacity-50 transition-colors"
          aria-label="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const DefaultCartItems = ({
  items,
  loading,
  isEmpty,
  onRemoveItem,
}: {
  items: ItemProps[];
  loading: boolean;
  isEmpty: boolean;
  totalItems: number;
  onRemoveItem: (itemId: string) => Promise<void>;
}) => {
  if (isEmpty) {
    return null; // The main MiniCart component will handle the empty state
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

export function MiniCart({
  cartUrl = "/cart",
  dropdownPosition = "right",
  showItemCount = true,
  renderCartIcon,
  renderCartDropdown,
  renderCartItems,
  renderEmptyCart,
  className = "",
  disabled = false,
}: MiniCartProps) {
  const { data: cartData, syncStatus } = useCartState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const cart = cartData;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCartClick = useCallback(() => {
    if (disabled) return;

    if (!isDropdownOpen) {
      // Opening
      setIsClosing(false);
      setIsDropdownOpen(true);
      // Prevent body scroll
    } else {
      // Start closing animation
      setIsClosing(true);
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set new timer
      timerRef.current = setTimeout(() => {
        // Only hide the dropdown after animation completes
        setIsDropdownOpen(false);
        setIsClosing(false);
        // Restore body scroll
      }, 400); // Give extra time for animation to complete
    }
  }, [disabled, isDropdownOpen]);

  const handleDropdownClose = useCallback(() => {
    // Start closing animation
    setIsClosing(true);
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Set new timer with enough time for animation
    timerRef.current = setTimeout(() => {
      // Only hide after animation completes
      setIsDropdownOpen(false);
      setIsClosing(false);
      // Restore body scroll
    }, 400); // Give extra time for animation to complete
  }, []);

  // Allow manual opening via a global custom event for reliability
  useEffect(() => {
    const openHandler = () => {
      setIsDropdownOpen(true);
      setIsClosing(false);
    };
    window.addEventListener("openMiniCart", openHandler);
    return () => window.removeEventListener("openMiniCart", openHandler);
  }, []);

  // Auto-open cart when item is added
  useEffect(() => {
    if (syncStatus.synced && syncStatus.trigger === CartSyncTrigger.ADD_ITEM) {
      setIsDropdownOpen(true);
      setIsClosing(false);
    }
  }, [syncStatus.synced, syncStatus.trigger]);

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

  // Default cart icon renderer
  const defaultCartIcon = (props: {
    totalQty: number;
    onClick: () => void;
    isOpen: boolean;
  }) => (
    <button
      type="button"
      onClick={props.onClick}
      disabled={disabled}
      className={`mini-cart-icon relative ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${props.isOpen ? "active" : ""}`}
      aria-label={`Shopping cart with ${props.totalQty} items`}
    >
      {syncStatus.syncing ? (
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-700"></div>
        </div>
      ) : (
        <ShoppingBagIcon
          width={24}
          height={24}
          className="text-gray-700 hover:text-gray-900 transition-colors"
        />
      )}
      {showItemCount && props.totalQty > 0 && !syncStatus.syncing && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {props.totalQty > 99 ? "99+" : props.totalQty}
        </span>
      )}
    </button>
  );

  // Default empty cart renderer
  const defaultEmptyCart = () => (
    <div className="flex flex-col items-center justify-center h-full py-16 px-8">
      <Area id="miniCartEmptyBefore" noOuter />

      {/* Empty Cart Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
        <ShoppingBagIcon
          width={80}
          height={80}
          className="relative text-gray-300 mx-auto"
        />
      </div>

      {/* Empty Message */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {_("Giỏ hàng trống")}
      </h3>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
        {_(
          "Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy khám phá và thêm sản phẩm yêu thích!"
        )}
      </p>

      {/* Continue Shopping Button */}
      <button
        type="button"
        onClick={handleDropdownClose}
        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        {_("Tiếp tục mua sắm")}
      </button>

      <Area id="miniCartEmptyAfter" noOuter />
    </div>
  );

  const defaultCartDropdown = (props: {
    cart: CartData | null;
    onClose: () => void;
    cartUrl?: string;
  }) => {
    const totalQty = props.cart?.totalQty || 0;

    return (
      <>
        {/* Backdrop Overlay */}
        <button
          type="button"
          className={`fixed inset-0 bg-black z-40 cart-backdrop ${
            isClosing ? "closing" : ""
          }`}
          onClick={props.onClose}
          style={{ pointerEvents: isClosing ? "none" : "auto" }}
          aria-label="Close cart overlay"
        />

        {/* Cart Drawer */}
        <div
          className={`minicart__dropdown cart-drawer fixed top-0 bottom-0 w-full sm:w-[400px] md:w-[450px] lg:w-[480px] bg-white shadow-2xl z-50 ${
            isClosing ? "closing" : ""
          }`}
          style={{ right: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="text-[15px] font-medium text-gray-900">
              {_("Giỏ hàng của bạn")}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[13px] text-gray-500">
                {totalQty} sản phẩm
              </div>
              <button
                type="button"
                onClick={props.onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {totalQty === 0 ? (
            renderEmptyCart ? (
              renderEmptyCart()
            ) : (
              defaultEmptyCart()
            )
          ) : (
            <div className="flex flex-col h-full min-h-0">
              <Area id="miniCartItemsBefore" noOuter />
              {/* Cart Items scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 pb-12">
                <CartItems>{renderCartItems || DefaultCartItems}</CartItems>
              </div>
              <Area id="miniCartItemsAfter" noOuter />
              {/* Suggestion and Footer sticky at bottom */}
              <div className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
                <div className="px-4 pt-4">
                  <MiniCartSuggestionList
                    products={[
                      {
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRArp-xEmjBy4UMgoXPNwZhtdxgVjZDqCtZKA&s",
                        name: "TDV Hobo Dây Vuông Love Charm Sz 23 - Den",
                        price: "1,007,190đ",
                        oldPrice: "1,083,000đ",
                        discount: "Giảm 7%",
                      },
                      {
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4r1CqesB33sTYX7ndZvl9wRSNWalQnMVv1g&s",
                        name: "TDV Hobo Dây Vuông Love Charm Sz 23 - Jean",
                        price: "1,007,190đ",
                        oldPrice: "1,083,000đ",
                        discount: "Giảm 7%",
                      },
                      {
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSjJragGoIG3LMp2UhiX06H4_DY2WddJeCrA&s",
                        name: "TDV Hobo Dây Vuông Love Charm Sz 23 - Cam",
                        price: "1,007,190đ",
                        oldPrice: "1,083,000đ",
                        discount: "Giảm 7%",
                      },
                      {
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFtACwvJNSAAAgXw7s6br9EPc0kmneV0b7QQ&s",
                        name: "TDV Hobo Dây Vuông Love Charm Sz 23 - Xanh Lá",
                        price: "1,007,190đ",
                        oldPrice: "1,083,000đ",
                        discount: "Giảm 7%",
                      },
                      {
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS8BTXFgaIAjGTH1C_tS4-HvmrIUfgw9tF9A&s",
                        name: "TDV Hobo Dây Vuông Love Charm Sz 23 - Xanh Lá",
                        price: "1,007,190đ",
                        oldPrice: "1,083,000đ",
                        discount: "Giảm 7%",
                      },
                    ]}
                  />
                </div>
                <div className="px-4 pb-4">
                  <Area id="miniCartSummaryBefore" noOuter />
                  <CartTotalSummary>
                    {({ total }) => (
                      <div className="space-y-3">
                        {/* Tổng tiền thanh toán */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-[13px] text-gray-700">
                            {_("Tổng tiền thanh toán")}:
                          </span>
                          <span className="text-[16px] font-semibold text-gray-900">
                            {formatVnPrice(total) || "0"}
                          </span>
                        </div>
                        {/* Action Buttons - 2 nút cùng hàng */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={props.onClose}
                            className="flex-1 border border-black text-black bg-white py-2.5 px-4 text-[13px] font-semibold uppercase tracking-wide rounded hover:bg-gray-50 transition-colors"
                          >
                            {_("Tiếp tục mua hàng")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (props.cartUrl) {
                                window.location.href = props.cartUrl;
                              }
                            }}
                            className="flex-1 bg-black text-white py-2.5 px-4 text-[13px] font-semibold uppercase tracking-wide rounded hover:bg-gray-800 transition-colors"
                          >
                            {_("Giỏ hàng")}
                          </button>
                        </div>
                      </div>
                    )}
                  </CartTotalSummary>
                  <Area id="miniCartSummaryAfter" noOuter />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className={`mini__cart__wrapper relative ${className}`}>
        {renderCartIcon
          ? renderCartIcon({
              totalQty: cart?.totalQty || 0,
              onClick: handleCartClick,
              isOpen: isDropdownOpen,
            })
          : defaultCartIcon({
              totalQty: cart?.totalQty || 0,
              onClick: handleCartClick,
              isOpen: isDropdownOpen,
            })}
      </div>

      {isDropdownOpen &&
        (renderCartDropdown
          ? renderCartDropdown({
              cart,
              onClose: handleDropdownClose,
              cartUrl,
            })
          : defaultCartDropdown({
              cart,
              onClose: handleDropdownClose,
              cartUrl,
            }))}
    </>
  );
}
