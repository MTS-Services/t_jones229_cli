"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import visa from "@/assets/payment/visa.svg";
import american from "@/assets/payment/american.svg";
import apple from "@/assets/payment/apple.svg";
import masteCard from "@/assets/payment/masteCard.svg";
import mestero from "@/assets/payment/mestero.svg";
import payPal from "@/assets/payment/payPal.svg";

// Initialize Stripe with the publishable key from environment
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

// Card element styles to match the existing form design
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      fontFamily: "system-ui, -apple-system, sans-serif",
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "12px",
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146",
    },
  },
};

interface StripeCardFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    address?: {
      postal_code?: string;
      country?: string;
    };
  };
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({
  onPaymentMethodCreated,
  onError,
  isProcessing,
  setIsProcessing,
  billingDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [cardError, setCardError] = useState<string | null>(null);

  const isCardComplete =
    cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;

  const handleCardChange = (elementType: string) => (event: any) => {
    setCardComplete((prev) => ({
      ...prev,
      [elementType]: event.complete,
    }));
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  // Expose the createPaymentMethod function to parent via custom event
  useEffect(() => {
    const handleCreatePayment = async () => {
      if (!stripe || !elements) {
        onError("Stripe not loaded");
        return;
      }

      if (!isCardComplete) {
        onError("Please complete all card fields");
        return;
      }

      setIsProcessing(true);

      try {
        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
          throw new Error("Card element not found");
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: billingDetails.address,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (paymentMethod) {
          console.log("✅ Payment method created:", paymentMethod.id);
          onPaymentMethodCreated(paymentMethod.id);
        }
      } catch (err: any) {
        console.error("❌ Payment method creation failed:", err);
        onError(err.message || "Failed to create payment method");
        setIsProcessing(false);
      }
    };

    // Listen for custom event to trigger payment method creation
    window.addEventListener("createStripePaymentMethod", handleCreatePayment);
    return () => {
      window.removeEventListener(
        "createStripePaymentMethod",
        handleCreatePayment,
      );
    };
  }, [
    stripe,
    elements,
    isCardComplete,
    billingDetails,
    onPaymentMethodCreated,
    onError,
    setIsProcessing,
  ]);

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-base font-bold mb-2">Card Number</label>
        <div className="border border-[#E0E0E0] rounded-md px-4 py-3 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <CardNumberElement
            options={cardElementOptions}
            onChange={handleCardChange("cardNumber")}
          />
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-bold mb-2">
            Expiration Date
          </label>
          <div className="border border-[#E0E0E0] rounded-md px-4 py-3 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <CardExpiryElement
              options={cardElementOptions}
              onChange={handleCardChange("cardExpiry")}
            />
          </div>
        </div>
        <div>
          <label className="block text-base font-bold mb-2">
            Security Code (CVC)
          </label>
          <div className="border border-[#E0E0E0] rounded-md px-4 py-3 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <CardCvcElement
              options={cardElementOptions}
              onChange={handleCardChange("cardCvc")}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {cardError && (
        <div className="text-red-500 text-sm flex items-center gap-2">
          <span>⚠️</span> {cardError}
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
        <Lock className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  );
};

interface StripePaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    address?: {
      postal_code?: string;
      country?: string;
    };
  };
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  const elementsOptions: StripeElementsOptions = {
    fonts: [
      {
        cssSrc:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      },
    ],
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <StripeCardForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
