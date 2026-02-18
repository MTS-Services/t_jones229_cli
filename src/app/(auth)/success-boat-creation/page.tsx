"use client";

import Button from "@/components/ReUsible/Button";
import { Calendar, Check, Search } from "lucide-react";
import React from "react";
import logo from "@/assets/logo3.svg";
import boat from "@/assets/boat2.svg";

import Image from "next/image";
import ChargeEnable from "@/components/ReUsible/ChargeEnable";
import { useGetMeQuery } from "@/redux/api/authApi";

export default function BoatCreator() {
  const {
    data: userInfo,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetMeQuery("");

  let content;

  if (isLoading || isFetching) {
    content = <div>Generating stripe onboarding link...</div>;
  }

  if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  }

  if (userInfo && !isLoading && !isFetching && !isError) {
    content = <ChargeEnable />;
  }

  return (
    <div className="max-w-2xl min-h-screen flex items-center justify-center mx-auto  p-4">
      {/* Header */}
      <div className=" ">
        {/* Main Content Card */}
        <div className=" bg-white rounded-lg shadow-2xl p-8">
          <div className="flex gap-6">
            {/* <h1 className="text-2xl font-bold text-blue-600">Fishing Tripper</h1> */}

            <Image src={logo} alt="logo" height={200} width={200} />
            <div>
              {/* Main Heading */}
              <h2 className="text-2xl md:text-3xl font-normal text-gray-900 mb-4">
                Your listing is under review.
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                Thanks for listing your boat with Fishing Tripper! Your payment
                is set up, and your listing is now under review.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 bg-[#f0f5ff] border-2 border-[#438ff2] rounded-lg px-4 py-2 mb-8">
                <Image
                  className=" h-6 w-6 "
                  src={boat}
                  alt=""
                  height={100}
                  width={100}
                />
                <span className="text-textSecondary font-medium text-base md:text-lg">
                  Your boat is under review
                </span>
              </div>
            </div>
          </div>

          {content}

          {/* Next Steps */}
          <div className="my-10">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded"></div>
              What Happens Next?
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-300">01</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Listing Review</h4>
                <p className="text-gray-600 text-sm">
                  Our team will review your listing within 24-48 hours to ensure
                  quality standards.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-300">02</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Email Notification
                </h4>
                <p className="text-gray-600 text-sm">
                  You'll receive an email notification once your boat is live
                  and ready for bookings.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-300">03</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Manage & Edit</h4>
                <p className="text-gray-600 text-sm">
                  Easily manage and edit your listing anytime from your Captain
                  Dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            link={"/dashboard/boat-trip"}
            className="bg-[#ffaa33] hover:bg-orange-500 text-white text-base px-4 py-2 rounded-xl font-medium w-full md:w-48"
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
