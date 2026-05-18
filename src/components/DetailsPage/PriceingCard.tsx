"use client";

import Image from "next/image";
import React, { useState } from "react";
import doller from "@/assets/icon/doller.svg";
import clock from "@/assets/icon/clock.svg";
import men from "@/assets/icon/men.svg";
import { useRouter } from "next/navigation";
import { tripCardProps } from "@/types/pricingCard";
import imageUrl from "@/assets/Overlay.jpg";
import { useSelector } from "react-redux";
import AuthChoiceModal from "@/components/common/AuthChoiceModal";

// import { useRouter } from "next/navigation";

const PricingCard: React.FC<tripCardProps> = ({
  tripInfo,
  boatId,
  image,
  imageIndex = 0,
}) => {
  console.log(image);
  const route = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTripParams, setPendingTripParams] = useState<any>(null);

  // Check if user is authenticated
  const isAuthenticated = useSelector(
    (state: any) => state.auth?.isAuthenticated,
  );

  const bookingType =
    typeof window !== "undefined" ? localStorage.getItem("bookingType") : null;

  const handleclick = (id: number) => {
    // Get date and guests from localStorage to pass as URL params
    const date =
      typeof window !== "undefined" ? localStorage.getItem("date") : null;
    const guests =
      typeof window !== "undefined" ? localStorage.getItem("Guests") : null;

    const tripParams = {
      type: bookingType || "false",
      boatId: boatId,
      tripId: id.toString(),
      ...(date ? { date } : {}),
      ...(guests ? { guests } : {}),
      ...(bookingType ? { bookingType } : {}),
    };

    if (!isAuthenticated) {
      // Show auth choice modal for unauthenticated users
      setPendingTripParams(tripParams);
      setModalOpen(true);
      return;
    }

    // Already logged in – go straight to payment
    const params = new URLSearchParams(tripParams);
    route.push(`/payment?${params.toString()}`);
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border mt-5 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0">
          <Image
            src={
              Array.isArray(image)
                ? image[imageIndex % image.length]?.url ||
                  image[0]?.url ||
                  imageUrl
                : image || imageUrl
            }
            alt="trip image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 md:p-5 flex flex-col min-w-0">
          {/* Header: Title + Price/Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-[#242424] leading-tight truncate w-full sm:w-auto">
              {tripInfo?.tripName}
            </h3>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[#878787] text-sm md:text-base whitespace-nowrap">
                Total Price:{" "}
                <span className="font-bold text-[#242424]">
                  ${tripInfo?.price}
                </span>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-[#878787] mb-4 line-clamp-2 md:line-clamp-none">
            {tripInfo?.description}
          </p>

          {/* Features Label */}
          <p className="font-bold text-xs md:text-sm text-[#171717] mb-3 uppercase tracking-wide">
            Key features:
          </p>

          {/* Feature Tags */}
          <div className="flex justify-between gap-2 md:gap-3">
            <div className="flex  gap-2 md:gap-3">
              <div className="flex items-center gap-1.5 bg-[#EDF1FF] px-3 py-1.5 rounded-full border border-[#b2c3ff] text-[#242424] text-xs md:text-sm">
                <Image
                  src={men}
                  alt="group"
                  height={20}
                  width={20}
                  className="w-4 h-4 object-contain flex-shrink-0"
                />
                <span className="whitespace-nowrap">Private Group</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#EDF1FF] px-3 py-1.5 rounded-full border border-[#b2c3ff] text-[#242424] text-xs md:text-sm">
                <Image
                  src={clock}
                  alt="clock"
                  height={20}
                  width={20}
                  className="w-4 h-4 object-contain flex-shrink-0"
                />
                <span className="whitespace-nowrap">
                  {tripInfo?.duration} Hours
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#EDF1FF] px-3 py-1.5 rounded-full border border-[#b2c3ff] text-[#242424] text-xs md:text-sm">
                <Image
                  src={doller}
                  alt="price"
                  height={20}
                  width={20}
                  className="w-4 h-4 object-contain flex-shrink-0"
                />
                <span className="whitespace-nowrap">${tripInfo?.price}</span>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleclick(tripInfo?.id)}
                className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-lg font-satoshi text-sm md:text-base transition-colors flex-shrink-0"
              >
                Reserve with 20% deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Auth choice modal – shown when user is not logged in */}
    {pendingTripParams && (
      <AuthChoiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tripParams={pendingTripParams}
      />
    )}
  </>
  );
};

export default PricingCard;
