"use client";

import Button from "@/components/ReUsible/Button";
import { Calendar, Check, Search, Sailboat } from "lucide-react";
import React from "react";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";
import boat from "@/assets/boat2.svg";
import Image from "next/image";

export default function BoatCreator() {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 py-6 sm:py-8 md:py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow border border-gray-200 p-4 sm:p-6 md:p-8">
          {/* Header Section - Responsive flex column to row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            {/* Logo - Responsive sizing */}
            <div className="flex-shrink-0">
              <Image
                src={BRAND_LOGO_URL}
                alt="Fishing Tripper Logo"
                height={200}
                width={200}
                unoptimized
                className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-contain"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center sm:text-left">
              {/* Main Heading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-green-600 capitalize mb-2 sm:mb-3 md:mb-4">
                Your listing is under review.
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Thanks for listing your boat with Fishing Tripper! Your payment
                is set up, and your listing is now under review.
              </p>
              {/* Status Badge - Full width on mobile, auto on larger screens */}
              <div className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 bg-green-50 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
                <Sailboat className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <span className="text-green-600 font-medium text-sm sm:text-base md:text-lg">
                  Your boat is under review
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="my-6 sm:my-8 md:my-10">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
              <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-blue-500 rounded"></div>
              What Happens Next?
            </h3>

            {/* Steps Grid - Responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md">
                <div className="flex items-center justify-between sm:items-start mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-300">
                    01
                  </div>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2">
                  Listing Review
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Our team will review your listing within 24-48 hours to ensure
                  quality standards.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md">
                <div className="flex items-center justify-between sm:items-start mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-300">
                    02
                  </div>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2">
                  Email Notification
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  You'll receive an email notification once your boat is live
                  and ready for bookings.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between sm:items-start mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-300">
                    03
                  </div>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2">
                  Manage & Edit
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Easily manage and edit your listing anytime from your Captain
                  Dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Need help? Contact our support team
            </p>
            <Button
              link={"/dashboard/boat-trip"}
              className="bg-[#ffaa33] hover:bg-orange-500 text-white text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium w-full sm:w-auto transition-all hover:shadow-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Footer Note - Optional */}
        <p className="text-xs sm:text-sm text-gray-400 text-center mt-4 sm:mt-6">
          You'll receive updates about your listing status via email
        </p>
      </div>
    </div>
  );
}
