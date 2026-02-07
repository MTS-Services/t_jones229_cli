"use client";

import React, { useState } from "react";
import { Check, DollarSign, TrendingUp, Shield } from "lucide-react";
import Button from "../ReUsible/Button";

const CaptainsInfoPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<
    "flat" | "commission" | null
  >(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

     {/* Free Trial Banner */}
      <div className="bg-[#105e9e] rounded-xl shadow-xl p-8 mb-20 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Shield className="w-8 h-8" />
          <h3 className="text-3xl font-bold">First 6 Months FREE</h3>
        </div>
        <p className="text-lg">
          Try FishingTripper risk-free and start booking more trips today
        </p>
      </div>
      {/* Pricing Plans */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Choose Your Plan After Free Trial
        </h3>
        <p className="text-center text-gray-600 mb-10">
          Select the pricing model that works best for your business
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Flat Rate Plan */}
          <div
            onClick={() => setSelectedPlan("flat")}
            className="bg-white text-center rounded-md p-6 transition shadow-[0_6px_20px_rgb(0,0,0,0.08)] "
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#0f5d9e]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">Flat Rate</h4>
                <p className="text-gray-500">Predictable pricing</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">$65</span>
                <span className="text-gray-500 text-lg">/month</span>
              </div>
              <p className="text-gray-600 mt-2">Unlimited bookings included</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>No commission on any bookings</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Perfect for high-volume operators</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Predictable monthly expenses</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Full platform access</span>
              </div>
            </div>
          </div>

          {/* Commission Plan */}
          <div
            onClick={() => setSelectedPlan("commission")}
            className="bg-white text-center rounded-md p-6 transition shadow-[0_6px_20px_rgb(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#0f5d9e]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">Commission</h4>
                <p className="text-gray-500">Pay as you grow</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">5%</span>
                <span className="text-gray-500 text-lg">per booking</span>
              </div>
              <p className="text-gray-600 mt-2">Only pay when you earn</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>No monthly fees or commitments</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Ideal for seasonal operations</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Pay only on FishingTripper bookings</span>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Full platform access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

       
    </div>
  );
};

export default CaptainsInfoPage;
