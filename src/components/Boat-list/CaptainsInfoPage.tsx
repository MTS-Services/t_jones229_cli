"use client";

import React, { useState } from "react";
import {
  Check,
  TrendingUp,
  Shield,
  Calendar,
  CreditCard,
  Percent,
} from "lucide-react";

const CaptainsInfoPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<"commission" | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-10">
      {/* Free Trial Banner - Cleaner Design */}
      <div className="bg-gradient-to-r from-[#0a4a7a] to-[#105e9e] rounded-2xl shadow-lg p-10 mb-24 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-yellow-300" />
            <h3 className="text-4xl md:text-5xl font-bold">
              First 6 Months Free
            </h3>
          </div>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Try FishingTripper risk-free and start booking more trips today
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="">
        <p className="text-3xl mb-16 md:text-4xl font-bold text-center text-gray-900">
          Select the pricing model that works best for your business
        </p>

        {/* Commission Plan - Enhanced Card */}
        <div className="max-w-xl mx-auto">
          <div
            onClick={() => setSelectedPlan("commission")}
            className={`bg-white rounded-2xl p-8 transition-all duration-300 cursor-pointer
             ring-2 ring-[#0a64ad] shadow-sm`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center">
                <Percent className="w-7 h-7 text-[#0f5d9e]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">
                  Commission Plan
                </h4>
                <p className="text-gray-500">Simple, transparent pricing</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-gray-900">5%</span>
                <span className="text-gray-500 text-xl">per booking</span>
              </div>
              <p className="text-gray-600 mt-2 text-lg">
                Only pay when you earn — no monthly fees
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Zero monthly fees or commitments",
                "Perfect for seasonal operations",
                "Pay only on FishingTripper bookings",
                "Full platform access including all features",
                "Cancel anytime, no questions asked",
              ].map((feature, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Check className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {/* <button className="w-full mt-10 bg-[#105e9e] hover:bg-[#0a4a7a] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              Get Started — 6 Months Free
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainsInfoPage;
