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
        <div className="flex mb-4">
          {/* <h1 className="text-2xl font-bold text-blue-600">Fishing Tripper</h1> */}

          <Image
            src={logo}
            alt="logo"
            height={200}
            width={200}
            className="w-52 h-10"
          />
        </div>

        {/* Main Content Card */}
        <div className=" bg-white rounded-lg shadow-2xl p-8">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900 mb-4">
            Your listing is under review.
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed text-base">
            Thanks for listing your boat with Fishing Tripper! Your payment is
            set up, and your listing is now under review.
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

          {content}

          {/* What's Next Section */}
          <div className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6">
              What&apos;s next?
            </h3>

            <div className="space-y-4">
              {/* Review Step */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-[#0037ff] rounded-full flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-[#243500] text-base md:text-lg ">
                    Our team will review your listing
                  </span>
                  <span className="text-[#243500] text-base">
                    {" "}
                    within 24-48 hours to ensure it meets our platform
                    standards.
                  </span>
                </div>
              </div>

              {/* Notification Step */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-[#0037ff] rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-[#243500] text-base md:text-lg ">
                    We will notify you by email:
                  </span>
                  <span className="text-[#243500] text-base">
                    {" "}
                    Once your boat is live.
                  </span>
                </div>
              </div>

              {/* Edit Step */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-[#0037ff] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[#243500] text-base">You can </span>
                  <span className="font-bold text-[#243500] text-base md:text-lg ">
                    edit your listing
                  </span>
                  <span className="text-[#243500] text-base">
                    {" "}
                    anytime from your{" "}
                  </span>
                  <span className="font-bold text-[#243500] text-base md:text-lg ">
                    Captain Dashboard.
                  </span>
                </div>
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
