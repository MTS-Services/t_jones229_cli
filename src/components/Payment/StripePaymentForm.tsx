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
).then((stripe) => {
  if (!stripe) {
    console.error("❌ Stripe failed to load");
  } else {
    console.log("✅ Stripe loaded successfully");
  }
  return stripe;
});

// Card element styles to match the existing form design
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "::placeholder": {
        color: "#a0a0a0",
      },
      lineHeight: "44px",
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146",
    },
  },
  placeholder: "1234 1234 1234 1234",
};

interface StripeCardFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onCardComplete?: (isComplete: boolean) => void;
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
  onCardComplete,
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

  // Debug logging
  React.useEffect(() => {
    console.log("🔍 Stripe instance:", stripe ? "Loaded" : "Not loaded");
    console.log("🔍 Elements instance:", elements ? "Loaded" : "Not loaded");
  }, [stripe, elements]);

  const isCardComplete =
    cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;

  const handleCardChange = (elementType: string) => (event: any) => {
    setCardComplete((prev) => {
      const updated = {
        ...prev,
        [elementType]: event.complete,
      };
      // Notify parent of completion status
      const allComplete = updated.cardNumber && updated.cardExpiry && updated.cardCvc;
      if (onCardComplete) {
        onCardComplete(allComplete);
      }
      return updated;
    });
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
        onError("Stripe not loaded. Please refresh the page.");
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
          // Handle specific Stripe error types
          let errorMessage = error.message;
          
          // Map Stripe error codes to user-friendly messages
          switch (error.code) {
            case 'card_declined':
              errorMessage = "Your card was declined. Please check your card details or try a different card.";
              break;
            case 'insufficient_funds':
              errorMessage = "Your card has insufficient funds. Please use a different card or add funds to your account.";
              break;
            case 'expired_card':
              errorMessage = "Your card has expired. Please use a different card.";
              break;
            case 'incorrect_cvc':
              errorMessage = "The security code (CVC) is incorrect. Please check and try again.";
              break;
            case 'incorrect_number':
              errorMessage = "The card number is incorrect. Please check and try again.";
              break;
            case 'invalid_expiry_year':
            case 'invalid_expiry_month':
              errorMessage = "The expiration date is invalid. Please check and try again.";
              break;
            case 'processing_error':
              errorMessage = "An error occurred while processing your card. Please try again.";
              break;
            default:
              errorMessage = error.message || "Payment processing failed. Please try again.";
          }
          
          throw new Error(errorMessage);
        }

        if (paymentMethod) {
          console.log("✅ Payment method created:", paymentMethod.id);
          onPaymentMethodCreated(paymentMethod.id);
          // Dispatch event to notify parent form
          window.dispatchEvent(new Event("paymentMethodCreated"));
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
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
      
      {/* Card Number */}
      <div className="w-full">
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Card Number
        </label>
        <div 
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
        >
          <CardNumberElement
            options={cardElementOptions}
            onChange={handleCardChange("cardNumber")}
          />
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Expiration Date
          </label>
          <div 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
          >
            <CardExpiryElement
              options={{
                ...cardElementOptions,
                placeholder: "MM / YY",
              }}
              onChange={handleCardChange("cardExpiry")}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Security Code (CVC)
          </label>
          <div 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
          >
            <CardCvcElement
              options={{
                ...cardElementOptions,
                placeholder: "CVC",
              }}
              onChange={handleCardChange("cardCvc")}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {cardError && (
        <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 border border-red-200 p-3 rounded-md">
          <span>⚠️</span> {cardError}
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-gray-500 text-sm pt-2">
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
  onCardComplete?: (isComplete: boolean) => void;
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
