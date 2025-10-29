import { useState } from "react";
import Area from "@components/common/Area.js";
import { Form } from "@components/common/form/Form.js";
import { CheckoutProvider } from "@components/frontStore/checkout/checkoutContext.js";
import { ContactInformation } from "@components/frontStore/checkout/ContactInformation.js";
import { Payment } from "@components/frontStore/checkout/Payment.js";
import { Shipment } from "@components/frontStore/checkout/Shipment.js";
import React from "react";
import "./Checkout.scss";
import { useForm } from "react-hook-form";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import { IsLoginCustomer } from "@components/frontStore/checkout/IsLoginCustomer.js";
import { OrderNote } from "@components/frontStore/checkout/OrderNote.js";
import PromoCodeInput from "@components/frontStore/checkout/PromoCodeInput.js";
import OrderSummaryCart from "@components/frontStore/checkout/OrderSummaryCart.js";
import CartCheckout from "@components/frontStore/checkout/CartCheckout.js";

interface CheckoutPageProps {
  placeOrderApi: string;
  getPaymentMethodApi: string;
  getShippingMethodApi: string;
  checkoutSuccessUrl: string;
}

export default function CheckoutPage({
  placeOrderApi,
  checkoutSuccessUrl,
}: CheckoutPageProps) {
  const [disabled, setDisabled] = React.useState(false);
  const form = useForm({
    disabled: disabled,
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {},
  });

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-10">
      <CheckoutProvider
        form={form}
        enableForm={() => setDisabled(false)}
        disableForm={() => setDisabled(true)}
        allowGuestCheckout={true}
        placeOrderApi={placeOrderApi}
        checkoutSuccessUrl={checkoutSuccessUrl}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-0 pt-10">
          {/* Left: Thông tin, giao hàng, thanh toán */}
          <Form form={form} submitBtn={false} className="lg:col-span-7">
            <div className="flex flex-col gap-4">
              <IsLoginCustomer />
              <ContactInformation />
              <Shipment />
              <Payment />
              <OrderNote />
              <Area id="checkoutForm" noOuter />
            </div>
          </Form>
          {/* Right: Giỏ hàng, mã khuyến mãi, tóm tắt đơn hàng */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <CartCheckout/>
            <PromoCodeInput />
            <OrderSummaryCart />
          </div>
        </div>
      </CheckoutProvider>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    placeOrderApi: url(routeId: "createOrder")
    checkoutSuccessUrl: url(routeId: "checkoutSuccess")
  }
`;
