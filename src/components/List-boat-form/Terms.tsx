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
        <p className="text-gray-600 max-w-3xl">
          Join the Fishing Tripper community and start listing your charters
          with a 6-month free trial. No upfront costs, cancel anytime.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Section */}
        <div className="space-y-6">
          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 rounded-lg p-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Payment
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter your payment information to start your free trial
              </p>
            </div>

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

              {/* Payment Error Display */}
              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 animate-shake">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-medium mb-1">
                        Payment Error
                      </p>
                      <p className="text-red-600 text-sm">{paymentError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Agreement Checkbox */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="mt-1 h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowFullTerms(!showFullTerms)}
                        className="text-orange-600 font-medium hover:underline"
                      >
                        subscription terms
                      </button>{" "}
                      and understand that I will be charged{" "}
                      <span className="font-bold text-orange-600">
                        $65 per month
                      </span>{" "}
                      after my 6-month free trial unless I cancel.
                    </span>
                  </div>
                </label>
              </div>

              {/* Full Terms (Expandable) */}
              {showFullTerms && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Subscription Terms
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      • You will not be charged during your 6-month free trial
                      period
                    </p>
                    <p>
                      • After the trial, your card will be automatically charged
                      $65/month
                    </p>
                    <p>• You can cancel anytime from your account settings</p>
                    <p>
                      • Cancellation takes effect at the end of your current
                      billing period
                    </p>
                    <p>• No refunds for partial months after cancellation</p>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={!agreed || !isCardComplete || isProcessing}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all transform ${
                  agreed && isCardComplete && !isProcessing
                    ? "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] shadow-md hover:shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  "Start 6-Month Free Trial"
                )}
              </button>
            </div>
          </div>
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
                <p className="text-gray-600 leading-relaxed">
                  Start with a{" "}
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    6-month free trial
                  </span>
                  , then continue your fishing journey with premium access to
                  our platform.
                </p>
              </div>

              {/* Price Display */}
              <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-white border-y border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$65</span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-xs text-gray-500">
                    after 6-month trial
                  </span>
                  <div className="h-px flex-1 bg-gray-200"></div>
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

          {/* Terms & Conditions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-lg p-1.5">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Terms & Conditions
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {termsItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Terms Note */}
              <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    By proceeding, you agree to our{" "}
                    <button className="font-semibold underline hover:text-blue-900">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button className="font-semibold underline hover:text-blue-900">
                      Privacy Policy
                    </button>
                    . You can cancel your membership at any time from your
                    account settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {[
              {
                icon: CheckCircle,
                text: "Money-back guarantee",
                color: "text-emerald-600",
              },
              { icon: Shield, text: "Secure checkout", color: "text-blue-600" },
              { icon: Zap, text: "Cancel anytime", color: "text-purple-600" },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-gray-500 text-sm"
              >
                <badge.icon className={`h-4 w-4 ${badge.color}`} />
                <span>{badge.text}</span>
              </div>
            ))}
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
