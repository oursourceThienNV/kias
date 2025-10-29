import Area from "@components/common/Area.js";
import { useCartState } from "@components/frontStore/cart/cartContext.js";
import { CouponForm } from "@components/frontStore/CouponForm.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";

const Total: React.FC<{
  total: string;
  totalTaxAmount: string;
  priceIncludingTax: boolean;
  loading?: boolean;
}> = ({ total, totalTaxAmount, priceIncludingTax, loading = false }) => {
  return (
    <div className="summary-row grand-total flex justify-between items-center mb-4">
      <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
        Tổng thanh toán
      </span>
      <div className="font-bold text-lg">
        <span className="text-[14px] font-bold">{total}</span>
      </div>
    </div>
  );
};

const Tax: React.FC<{
  showPriceIncludingTax: boolean;
  amount: string;
  loading?: boolean;
}> = ({ showPriceIncludingTax, amount, loading = false }) => {
  if (showPriceIncludingTax) {
    return null;
  }

  return (
    <div className="summary-row flex justify-between py-2">
      <span>{_("Tax")}</span>
      <div>
        <div />
        <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
          {amount}
        </span>
      </div>
    </div>
  );
};

const Subtotal: React.FC<{ subTotal: string; loading?: boolean }> = ({
  subTotal,
  loading = false,
}) => {
  return (
    <div className="flex justify-between gap-7 py-2">
      <div>{_("Sub total")}</div>
      <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
        {subTotal}
      </span>
    </div>
  );
};

const Discount: React.FC<{
  discountAmount: string;
  coupon: string | undefined;
  loading?: boolean;
}> = ({ discountAmount, coupon, loading = false }) => {
  if (!coupon) {
    return (
      <div className="gap-7 py-2">
        <CouponForm />
      </div>
    );
  }

  return (
    <div className="flex justify-between gap-7 py-2">
      <div>{_("Discount(${coupon})", { coupon })}</div>
      <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
        {discountAmount}
      </span>
    </div>
  );
};

const Shipping: React.FC<{
  method: string | undefined;
  cost: string | undefined;
  loading?: boolean;
}> = ({ method, cost, loading = false }) => {
  return (
    <div className="summary-row flex justify-between gap-7 py-2">
      <span>{_("Shipping")}</span>
      {method && (
        <div>
          <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
            {cost}
          </span>
        </div>
      )}
      {!method && (
        <span className="text-gray-500 italic font-normal">
          {_("Select shipping method")}
        </span>
      )}
    </div>
  );
};

const DefaultCartSummary: React.FC<{
  loading: boolean;
  showPriceIncludingTax: boolean;
  subTotal: string;
  discountAmount: string;
  coupon: string | undefined;
  shippingMethod: string | undefined;
  shippingCost: string | undefined;
  taxAmount: string;
  total: string;
}> = ({
  loading,
  showPriceIncludingTax,
  subTotal,
  discountAmount,
  coupon,
  shippingMethod,
  shippingCost,
  taxAmount,
  total,
}) => (
  <div className="cart__total__summary font-semibold">
    <Area id="cartSummaryBeforeSubTotal" noOuter />
    <div className="flex justify-between">
      <span className="text-[14px]" style={{ color: "#171717" }}>
        Tổng tiền hàng
      </span>
      <span className="text-[14px]" style={{ color: "#171717" }}>
        {subTotal}
      </span>
    </div>
    <Area id="cartSummaryAfterSubTotal" noOuter />
    <Area id="cartSummaryBeforeShipping" noOuter />
    <div className="flex justify-between">
      <span className="text-[14px]" style={{ color: "#171717" }}>
        Phí vận chuyển
      </span>
      {shippingMethod ? (
        <span className="text-[14px] font-bold" style={{ color: "#171717" }}>
          {shippingCost}
        </span>
      ) : (
        <span className="text-[14px]" style={{ color: "#171717" }}>
          -
        </span>
      )}
    </div>
    <Area id="cartSummaryAfterShipping" noOuter />
    <Area id="cartSummaryBeforeTax" noOuter />
    {/* Ẩn dòng thuế */}
    <Area id="cartSummaryAfterTax" noOuter />
    <Area id="cartSummaryBeforeTotal" noOuter />
    <Total
      total={total}
      totalTaxAmount={taxAmount}
      priceIncludingTax={showPriceIncludingTax}
      loading={loading}
    />
    <Area id="cartSummaryAfterTotal" noOuter />
    {/* Nút đặt hàng */}
    <button
      type="submit"
      className="w-full mt-2 bg-black text-white rounded-xl py-3 text-lg font-bold hover:bg-gray-900 transition"
    >
      Đặt hàng
    </button>
  </div>
);

interface CartTotalSummaryProps {
  children?: (props: {
    loading: boolean;
    showPriceIncludingTax: boolean;
    subTotal: string;
    discountAmount: string;
    coupon: string | undefined;
    shippingMethod: string | undefined;
    shippingCost: string | undefined;
    taxAmount: string;
    total: string;
  }) => React.ReactNode;
}

function CartTotalSummary({ children }: CartTotalSummaryProps) {
  const {
    data: cart,
    loadingStates,
    setting: { priceIncludingTax },
  } = useCartState();

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

  const subTotal = priceIncludingTax
    ? cart?.subTotalInclTax?.text || ""
    : cart?.subTotal?.text || "";

  const discountAmount = cart?.discountAmount?.text || "";
  const coupon = cart?.coupon;

  const shippingMethod = cart?.shippingMethodName;
  const shippingCost = priceIncludingTax
    ? cart?.shippingFeeInclTax?.text || ""
    : cart?.shippingFeeExclTax?.text || "";

  const taxAmount = cart?.totalTaxAmount?.text || "";
  const total = cart?.grandTotal?.text || "";

  return (
    <div className="grid grid-cols-1 gap-5">
      {children ? (
        children({
          loading: Object.values(loadingStates).some(
            (state) =>
              state === true || (typeof state === "string" && state !== null)
          ),
          showPriceIncludingTax: priceIncludingTax,
          subTotal,
          discountAmount,
          coupon,
          shippingMethod,
          shippingCost,
          taxAmount,
          total,
        })
      ) : (
        <DefaultCartSummary
          loading={Object.values(loadingStates).some(
            (state) =>
              state === true || (typeof state === "string" && state !== null)
          )}
          showPriceIncludingTax={priceIncludingTax}
          subTotal={formatVnPrice(subTotal)}
          discountAmount={formatVnPrice(discountAmount)}
          coupon={coupon}
          shippingMethod={shippingMethod}
          shippingCost={formatVnPrice(shippingCost)}
          taxAmount={formatVnPrice(taxAmount)}
          total={formatVnPrice(total)}
        />
      )}
    </div>
  );
}

export {
  CartTotalSummary,
  DefaultCartSummary,
  Subtotal,
  Discount,
  Shipping,
  Tax,
  Total,
};
