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
  Check,
  Shield,
  Calendar,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";
import { useState } from "react";
import PaymentDetails from "../Payment/PaymentDetails";
import StripePaymentForm from "../Payment/StripePaymentForm";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export default function Terms() {
  const [agreed, setAgreed] = useState(true);
  const [paymentError, setPaymentError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const { setValue, watch } = useFormContext();
  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";
  const email = watch("email") || "";
  const mobile = watch("mobile") || "";

  // Store payment method ID when created
  const handlePaymentMethodCreated = (paymentMethodId: string) => {
    console.log("✅ Payment method created:", paymentMethodId);
    setValue("paymentMethodId", paymentMethodId);
    setPaymentError("");
  };

  const handlePaymentError = (error: string) => {
    console.error("❌ Payment error:", error);
    setPaymentError(error);
  };

  return (
    <>
      <div className="">
        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Membership Card */}
          <div className="space-y-6">
            {/* Payment Details Card */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Details
                </h3>
              </div>

              <div className="p-6">
                {/* Payment Details Component */}
                <PaymentDetails />

                {/* Stripe Payment Form - Enhanced width and height */}
                <div className="mt-6">
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Information
                    </label>
                    <div className="min-h-[120px]">
                      <StripePaymentForm
                        onPaymentMethodCreated={handlePaymentMethodCreated}
                        onError={handlePaymentError}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        onCardComplete={setIsCardComplete}
                        billingDetails={{
                          name:
                            `${firstName} ${lastName}`.trim() || "Cardholder",
                          email: email || "",
                          phone: mobile || "",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Error Display */}
                {paymentError && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 text-sm font-medium">
                        {paymentError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Agreement Checkbox */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="subscription-agreement"
                      type="checkbox"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 leading-6 select-none">
                      I agree to the subscription terms and understand that I
                      will be charged
                      <span className="font-bold text-blue-700">
                        {" "}
                        $65 per month
                      </span>{" "}
                      after my free trial unless I cancel.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section */}
          <div className="space-y-6">
            {/* Membership Card - Clean and Minimal */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Card Header */}
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Limited Time Offer
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  Fishing Tripper Membership
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Start with a{" "}
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    6-month free trial
                  </span>
                  , then continue your fishing journey with premium access.
                </p>
              </div>

              {/* Price Display */}
              <div className="px-8 py-6 border-y border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900 tracking-tight">
                    $65
                  </span>
                  <span className="text-gray-500 text-lg font-medium">
                    /month
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Billed monthly after your 6-month trial
                </p>
              </div>

              {/* Features List */}
              <div className="px-8 py-6">
                <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                  Membership Benefits
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      icon: Gift,
                      label: "6-Month Free Trial",
                      desc: "No charges for first 6 months",
                    },
                    {
                      icon: DollarSign,
                      label: "Flat $65/month",
                      desc: "Same low rate after trial",
                    },
                    {
                      icon: ClipboardList,
                      label: "Unlimited Trip Listings",
                      desc: "Post as many trips as you want",
                    },
                    {
                      icon: XCircle,
                      label: "Cancel Anytime",
                      desc: "No contracts or hidden fees",
                    },
                    {
                      icon: Shield,
                      label: "Secure Payment",
                      desc: "256-bit encrypted transactions",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <item.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {item.label}
                        </p>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms & Conditions - Clean Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                  Terms & Conditions
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: CreditCard,
                      iconColor: "text-blue-600",
                      title: "Payment",
                      description:
                        "No charges for first 6 months, then $65/month auto-charged",
                    },
                    {
                      icon: Clock,
                      iconColor: "text-orange-600",
                      title: "Cancellation",
                      description:
                        "Cancel anytime before next billing cycle to avoid charges",
                    },
                    {
                      icon: FileText,
                      iconColor: "text-purple-600",
                      title: "Listings",
                      description:
                        "Your listings will be removed upon cancellation",
                    },
                    {
                      icon: Lock,
                      iconColor: "text-green-600",
                      title: "Security",
                      description: "Payments processed securely via Stripe",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Terms Note */}
                <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <Pin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      By proceeding, you agree to our{" "}
                      <button className="font-medium underline hover:text-blue-700">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="font-medium underline hover:text-blue-700">
                        Privacy Policy
                      </button>
                      . You can cancel your membership at any time from your
                      account settings.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <XCircle className="w-5 h-5 text-purple-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
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
    </>
  );
}
