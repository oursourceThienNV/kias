import Area from "@components/common/Area.js";
import Button from "@components/common/Button.js";
import { useCartState } from "@components/frontStore/cart/cartContext.js";
import { CartItems } from "@components/frontStore/cart/CartItems.js";
import { CartTotalSummary } from "@components/frontStore/cart/CartTotalSummary.js";
import { ShoppingCartEmpty } from "@components/frontStore/cart/ShoppingCartEmpty.js";
import ProductRecommendations from "@components/frontStore/catalog/ProductRecommendations.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";

const Title: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="mb-7 text-center shopping-cart-header">
      <h1 className="shopping-cart-title mb-2">{title}</h1>
      <a href="/" className="underline">
        {_("Continue Shopping")}
      </a>
    </div>
  );
};
interface ShoppingCartProps {
  checkoutUrl: string;
}
export default function ShoppingCart({ checkoutUrl }: ShoppingCartProps) {
  const { data: cart } = useCartState();

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
    <div className="min-h-screen bg-[#F9F9F9]">
      {cart.items.length > 0 ? (
        <div className="max-w mx-auto px-4 py-3 md:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div
              className="hapas-vietnamese categoryId flex items-center gap-2 text-xs"
              style={{ color: "#707070" }}
            >
              <a href="/">Trang chủ</a>
              <span>/</span>
              <span style={{ color: "#18181A", fontWeight: 600 }}>
                Giỏ hàng ({cart.items.length})
              </span>
            </div>
          </div>

          <h1 className="text-[38px] font-medium text-[#79192A] mb-6">
            GIỎ HÀNG
          </h1>

          {/* Free Shipping Banner */}
          <div className="relative mb-8">
            {/* Progress Bar */}
            <div
              style={{ height: "1px" }}
              className="w-full bg-[#000000] rounded-full mb-4"
            ></div>

            {/* Banner Content */}
            <div>
              <div className="flex">
                <div className="flex items-center gap-2">
                  <span className="text-[#666666] text-[16px]">
                    Bạn đã được
                  </span>
                  <span className="font-bold text-[16px] text-[#333333]">
                    MIỄN PHÍ VẬN CHUYỂN
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 w-full bg-[#4CAF50] rounded-full mt-4">
              {/* Progress Bar Icon */}
              <div className="absolute -right-1 -top-[9px]">
                <div className="bg-[#4CAF50] rounded-full p-1">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L8 11L12 7"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div>
                <Area id="shoppingCartBeforeItems" noOuter />
                <CartItems />
                <Area id="shoppingCartAfterItems" noOuter />
              </div>
            </div>

            {/* Cart Summary - Right Column */}
            <div className="lg:col-span-1">
              {/* HAPAS cam kết bảo hành */}
              <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded px-4 py-3 mb-5 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                    <path
                      d="M12 7v7"
                      stroke="#79192A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="17" r="1" fill="#79192A" />
                  </svg>
                  <span className="text-[#00000] text-[14px] font-semibold">
                    HAPAS cam kết bảo hành sản phẩm trong vòng 6 tháng
                  </span>
                </div>
                <a href="#" className="text-[#202020] underline text-[14px]">
                  Xem thêm chính sách
                </a>
              </div>
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h2 className="text-sm font-bold text-[#00000] mb-4">
                  Tổng cộng:
                  <span className="float-right text-[14px] font-bold text-[#00000]">
                    {/* Tổng tiền lấy từ CartTotalSummary */}
                    <CartTotalSummary>
                      {({ total }) => <span>{formatVnPrice(total)}</span>}
                    </CartTotalSummary>
                  </span>
                </h2>
                <div className="text-sm mt-4 mb-6" style={{color: '#00000'}}>
                  Phí vận chuyển sẽ được tính ở trang thanh toán.
                </div>
                <Area id="shoppingCartBeforeCheckoutButton" noOuter />
                <button
                  onClick={() => (window.location.href = checkoutUrl)}
                  className="w-full bg-[#79192A] hover:bg-[#9B2138] text-white py-2 rounded font-semibold text-[14px] transition-colors"
                >
                  TIẾN HÀNH ĐẶT HÀNG
                </button>
              </div>
              <Area id="shoppingCartAfterSummary" noOuter />
              {/* Chính sách mua hàng */}
              <div className="mt-6">
                <div className="bg-[#E6F4FF] border border-[#B6E0FE] rounded p-4 flex items-start gap-3">
                  <div>
                    <div className="font-bold text-[#000000] mb-1">
                      Chính sách mua hàng:
                    </div>
                    <div className="text-[15px] text-[#000000]">
                      Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá
                      trị tối thiểu <b>0₫</b> trở lên.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <ProductRecommendations title='Tặng bạn ưu đãi mua kèm' />
          </div>
        </div>
      ) : (
        <ShoppingCartEmpty />
      )}
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    checkoutUrl: url(routeId: "checkout")
  }
`;
