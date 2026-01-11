"use client";

import Image from "next/image";
import React from "react";
import doller from "@/assets/icon/doller.svg";
import clock from "@/assets/icon/clock.svg";
import men from "@/assets/icon/men.svg";
import { useRouter } from "next/navigation";
import { tripCardProps } from "@/types/pricingCard";
import imageUrl from "@/assets/Overlay.jpg";

// import { useRouter } from "next/navigation";

const PricingCard: React.FC<tripCardProps> = ({ tripInfo, boatId, image }) => {
  const route = useRouter();
  const bookingType =
    typeof window !== "undefined" ? localStorage.getItem("bookingType") : null;

  const handleclick = (id: number) => {
    console.log(id);
    console.log(bookingType);

    // Get date and guests from localStorage to pass as URL params
    const date =
      typeof window !== "undefined" ? localStorage.getItem("date") : null;
    const guests =
      typeof window !== "undefined" ? localStorage.getItem("Guests") : null;

    // Build URL with all necessary parameters
    const params = new URLSearchParams({
      type: bookingType || "false",
      boatId: boatId,
      tripId: id.toString(),
    });

    if (date) params.append("date", date);
    if (guests) params.append("guests", guests);
    if (bookingType) params.append("bookingType", bookingType);

    route.push(`/payment?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-4 gap-4 border mt-5">
      <Image
        src={image || imageUrl}
        alt="trip image"
        height={100}
        width={100}
        className="w-80 h-60  rounded-lg"
      />

      <div className="flex-1">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between ">
          <h3 className=" text-xl md:text-2xl text-[#242424] leading-6 font-bold align-text-bottom ">
            {tripInfo?.tripName}
          </h3>
          <div className="flex gap-6 items-center">
            <span className="text-[#878787] text-base font-normal leading-7 flex items-center gap-1">
              Price :
              <span className="text-base font-bold text-[#242424]">
                ${tripInfo?.price}
              </span>
            </span>

            <button
              onClick={() => handleclick(tripInfo?.id)}
              className="bg-orange-400 text-white px-4 py-2 rounded-lg  font-satoshi text-sm md:text-base"
            >
              Reserve
            </button>
          </div>
        </div>

        <p className="text-base text-[#878787] my-4">{tripInfo?.description}</p>
        <p className="font-bold text-sm text-[#171717] ">Key features:</p>

        <div className="flex flex-wrap  md:flex-row w-full items-center gap-2 md:gap-4 mt-4">
          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base">
            <Image
              src={men}
              alt="clock"
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            Private Group
          </div>

          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={clock}
              alt="clock"
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            {tripInfo?.duration} Hours
          </div>

          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={doller}
              alt="doller"
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            {tripInfo?.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
