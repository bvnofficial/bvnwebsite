"use client";

import { useEffect, useRef } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  DISPATCH_ACTION,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

interface Props {
  amount: string;
  currency: string;
  name: string;
  email: string;
  description: string;
  onSuccess: (d: {
    amount: string;
    currency: string;
    name: string;
    email: string;
    captureId: string;
  }) => void;
  onError: (msg: string) => void;
}

// Inner component: lives inside the provider so it can reload the SDK with a new
// currency via resetOptions (instead of remounting the provider, which corrupts
// the PayPal global and crashes the page).
function Buttons({ amount, currency, name, email, description, onSuccess, onError }: Props) {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  // Read the freshest form values in callbacks without re-rendering the buttons.
  const stateRef = useRef({ amount, currency, name, email, description });
  stateRef.current = { amount, currency, name, email, description };

  useEffect(() => {
    if (options.currency !== currency) {
      dispatch({ type: DISPATCH_ACTION.RESET_OPTIONS, value: { ...options, currency } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay", height: 48 }}
        forceReRender={[currency]}
        onClick={(_data, actions) => {
          const s = stateRef.current;
          if (!s.name || !s.email) {
            onError("Please enter your name and email first.");
            return actions.reject();
          }
          if (!s.amount || Number(s.amount) < 1) {
            onError("Please enter a valid amount first.");
            return actions.reject();
          }
          onError("");
          return actions.resolve();
        }}
        createOrder={async () => {
          const s = stateRef.current;
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: s.amount,
              currency: s.currency,
              description: s.description,
            }),
          });
          const d = await res.json();
          if (!res.ok || !d.id) throw new Error(d.error || "Could not start checkout.");
          return d.id;
        }}
        onApprove={async (data) => {
          const s = stateRef.current;
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderID: data.orderID,
              name: s.name,
              email: s.email,
              description: s.description,
            }),
          });
          const d = await res.json();
          if (!res.ok || !d.ok) {
            onError(d.error || "Payment could not be completed.");
            return;
          }
          onSuccess({
            amount: d.amount,
            currency: d.currency,
            name: d.name,
            email: d.email,
            captureId: d.captureId,
          });
        }}
        onError={(err) => {
          console.error("PayPal Buttons error:", err);
          onError("A payment error occurred. Please try again.");
        }}
      />
      <p className="text-center text-white/25 text-xs mt-2 leading-relaxed">
        Pay with PayPal, or choose <span className="text-white/50">Debit or Credit Card</span> — no
        PayPal account required.
      </p>
    </>
  );
}

export default function PayPalCheckout(props: Props) {
  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5 text-center">
        <p className="text-amber-300 text-sm font-semibold mb-1">Card payments are being set up</p>
        <p className="text-white/40 text-xs leading-relaxed">
          Please use the Crypto tab, or email{" "}
          <span className="text-white/70">bvn@bvnofficial.com</span> to arrange payment.
        </p>
      </div>
    );
  }

  const options: ReactPayPalScriptOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: props.currency,
    intent: "capture",
    components: "buttons",
    enableFunding: "card",
  };

  return (
    <PayPalScriptProvider options={options}>
      <Buttons {...props} />
    </PayPalScriptProvider>
  );
}
