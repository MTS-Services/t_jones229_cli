"use client";

import {
  CheckCircle,
  CreditCard,
  Gift,
  ClipboardList,
  XCircle,
  Lock,
  AlertTriangle,
  Pin,
  Shield,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  Star,
  Heart,
  Zap,
  Info,
} from "lucide-react";
import { useState } from "react";
import PaymentDetails from "../Payment/PaymentDetails";
import StripePaymentForm from "../Payment/StripePaymentForm";
import { useFormContext } from "react-hook-form";

export default function Terms() {
  const [agreed, setAgreed] = useState(true);
  const [paymentError, setPaymentError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const { setValue, watch } = useFormContext();
  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";
  const email = watch("email") || "";
  const mobile = watch("mobile") || "";

  const handlePaymentMethodCreated = (paymentMethodId: string) => {
    console.log("✅ Payment method created:", paymentMethodId);
    setValue("paymentMethodId", paymentMethodId);
    setPaymentError("");
  };

  const handlePaymentError = (error: string) => {
    console.error("❌ Payment error:", error);
    setPaymentError(error);
  };

  const benefits = [
    {
      icon: Gift,
      label: "6-Month Free Trial",
      desc: "No charges for first 6 months",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: DollarSign,
      label: "Flat $65/month",
      desc: "Same low rate after trial",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: ClipboardList,
      label: "Unlimited Trip Listings",
      desc: "Post as many trips as you want",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Star,
      label: "Priority Support",
      desc: "24/7 dedicated support team",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: XCircle,
      label: "Cancel Anytime",
      desc: "No contracts or hidden fees",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      icon: Shield,
      label: "Secure Payment",
      desc: "256-bit encrypted transactions",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const termsItems = [
    {
      icon: CreditCard,
      iconColor: "text-blue-600",
      title: "Payment Terms",
      description: "No charges for first 6 months, then $65/month auto-charged",
    },
    {
      icon: Clock,
      iconColor: "text-orange-600",
      title: "Cancellation Policy",
      description: "Cancel anytime before next billing cycle to avoid charges",
    },
    {
      icon: FileText,
      iconColor: "text-purple-600",
      title: "Listing Management",
      description: "Your listings will be removed upon cancellation",
    },
    {
      icon: Lock,
      iconColor: "text-green-600",
      title: "Security",
      description: "Payments processed securely via Stripe",
    },
  ];

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Complete Your Membership
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Section */}
        <div className="space-y-6">
          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Payment Details Component */}
              <PaymentDetails />

              {/* Stripe Payment Form */}
              <div className="mt-6">
                <div className="bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <StripePaymentForm
                    onPaymentMethodCreated={handlePaymentMethodCreated}
                    onError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    onCardComplete={setIsCardComplete}
                    billingDetails={{
                      name: `${firstName} ${lastName}`.trim() || "Cardholder",
                      email: email || "",
                      phone: mobile || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Payment Error Display */}
          {paymentError && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 animate-shake">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium mb-1">Payment Error</p>
                  <p className="text-red-600 text-sm">{paymentError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Membership Benefits */}
        <div className="space-y-6">
          {/* Membership Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Hero Badge */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl">
                  Limited Time
                </div>
              </div>

              <div className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Exclusive Offer
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Fishing Tripper Membership
                </h2>
              </div>

              {/* Price Display */}
              <div className="px-6 md:px-8 py-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-green-600">$65</span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="h-px w-12 bg-gray-200" />
                  <span className="text-xs text-gray-500 font-medium">
                    after 6-month free trial
                  </span>
                  <div className="h-px w-12 bg-gray-200" />
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-500" />
                  Membership Benefits
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.label}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 ${benefit.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">
                          {benefit.label}
                        </p>
                        <p className="text-gray-500 text-xs">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-gray-500 leading-relaxed text-sm p-6 bg-yellow-50 rounded-lg border border-gray-200 space-y-4">
            <p className="font-semibold text-gray-800">Terms & Conditions</p>

            <p>
              It&apos;s free to create an account and list your boat on
              FishingTripper. We charge a 5% commission based on the total trip
              price for all completed bookings made through the platform.
            </p>
            <p>
              Customers pay a 20% deposit at the time of booking. This deposit
              is held securely by FishingTripper.
            </p>
            <p>
              Upon successful completion of the trip, the deposit will be
              released to you, minus a 5% commission (calculated on the total
              trip price).
            </p>
            <p>
              The remaining balance is paid directly to you by the customer on
              the day of the trip.
            </p>

            <hr className="border-gray-300" />

            <p className="font-semibold text-gray-800">Cancellations</p>
            <p>
              Customers can cancel for a full refund up to 7 calendar days
              before the trip.
            </p>
            <p>
              If a customer cancels between 7 and 3 calendar days before the
              trip, they will receive a 50% refund of the deposit. The remaining
              50% of the deposit will be paid to the charter operator.
            </p>
            <p>
              If a customer cancels less than 3 calendar days before the trip,
              the full deposit is retained and will be paid to the charter
              operator.
            </p>
            <p>
              If a trip is canceled by the charter operator or due to unsafe
              weather conditions, the customer will receive a full refund of the
              deposit, and FishingTripper will not charge a commission.
            </p>

            <hr className="border-gray-300" />

            <p className="font-semibold text-gray-800">
              Commission on cancellations
            </p>
            <p>
              In the event of a customer cancellation, FishingTripper applies
              its 5% commission only to amounts actually received by the charter
              operator.
            </p>
            <p>
              If no payment is made to the charter operator (for example, in a
              full refund), no commission is charged.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
