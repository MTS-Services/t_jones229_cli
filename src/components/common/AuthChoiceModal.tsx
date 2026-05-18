"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, UserPlus, LogIn } from "lucide-react";

interface TripParams {
  boatId: string;
  tripId: string;
  type?: string;
  date?: string;
  guests?: string;
  bookingType?: string;
}

interface AuthChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripParams: TripParams;
}

export default function AuthChoiceModal({
  isOpen,
  onClose,
  tripParams,
}: AuthChoiceModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const buildPaymentUrl = (extra?: Record<string, string>) => {
    const params = new URLSearchParams({
      type: tripParams.type || "false",
      boatId: tripParams.boatId,
      tripId: tripParams.tripId,
    });
    if (tripParams.date) params.append("date", tripParams.date);
    if (tripParams.guests) params.append("guests", tripParams.guests);
    if (tripParams.bookingType) params.append("bookingType", tripParams.bookingType);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => params.append(k, v));
    }
    return `/payment?${params.toString()}`;
  };

  const handleNewUser = () => {
    // Go to payment page in guest mode – signup fields will appear there
    const url = buildPaymentUrl({ guest: "true" });
    onClose();
    router.push(url);
  };

  const handleExistingUser = () => {
    // Save trip params so we can restore them after login
    if (typeof window !== "undefined") {
      localStorage.setItem("pendingBookingParams", JSON.stringify(tripParams));
    }
    // Redirect to login with a redirect URL back to payment
    const paymentUrl = buildPaymentUrl();
    onClose();
    router.push(`/login?redirect=${encodeURIComponent(paymentUrl)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How would you like to continue?
          </h2>
          <p className="text-gray-500 text-sm">
            Choose an option to reserve your fishing trip
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {/* New User */}
          <button
            onClick={handleNewUser}
            className="flex items-center gap-4 p-5 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all group text-left"
          >
            <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors flex-shrink-0">
              <UserPlus className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">
                I&apos;m a new user
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                Create your account and pay in one step
              </p>
            </div>
          </button>

          {/* Existing User */}
          <button
            onClick={handleExistingUser}
            className="flex items-center gap-4 p-5 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors flex-shrink-0">
              <LogIn className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">
                I already have an account
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                Log in and return to complete your booking
              </p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your trip details will be saved and waiting for you
        </p>
      </div>
    </div>
  );
}
