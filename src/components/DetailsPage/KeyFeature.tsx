import Image from "next/image";
import React from "react";

import doller from "@/assets/boat2.svg";
import men from "@/assets/icon/men.svg";
import { KeyFeatureProps } from "@/types/pricingCard";

export default function KeyFeature({ boatInfo }: KeyFeatureProps) {
  return (
    <div>
      <h1 className="text-base font-bold text-[#171717] mt-4">Key features:</h1>
      <div>
        <div className="flex flex-wrap md:flex-row w-full items-center gap-2 md:gap-4 mt-4">
          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base">
            <Image
              src={doller}
              alt={"boat"}
              height={100}
              width={100}
              className="w-5 h-5 rounded-lg"
            />
            {boatInfo?.boatLength} Meeter
          </div>

          {/* <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={doller}
              alt={"doller"}
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            {boatInfo?.trips?.[0]?.price} Price per person
          </div> */}

          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={doller}
              alt={"clock"}
              height={100}
              width={100}
              className="w-5 h-5 rounded-lg"
            />
            {boatInfo?.modelYear} Boat Model
          </div>
          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={men}
              alt={"men"}
              height={100}
              width={100}
              className="w-5 h-5 rounded-lg"
            />
            Up to {boatInfo?.guests} people
          </div>
        </div>
      </div>
    </div>
  );
}
