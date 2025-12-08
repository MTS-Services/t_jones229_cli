import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import doller from "@/assets/boat2.svg";
import men from "@/assets/icon/men.svg";
import placeholderImage from "@/assets/placeholder.webp";
import Link from "next/link";
import { CardProps } from "@/types/pricingCard";

const TopChartersCard: React.FC<CardProps> = ({ boatInfo }) => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-[16px] shadow-lg p-4 gap-4 border-[1px] border-[#dedede] mt-5 custom-shadow">
      <Image
        src={boatInfo?.photos?.[0]?.url || placeholderImage}
        alt={boatInfo?.descriptions?.[0]?.listingTypeTitle ?? "Boat Image"}
        height={100}
        width={100}
        className="w-80 h-60 object-cover rounded-lg"
      />

      <div className="flex-1">
        <div className="grid grid-cols-7 gap-5 lg:gap-0 justify-between ">
          <h3 className="col-span-4 text-xl line-clamp-1 md:text-2xl text-[#242424] font-bold truncate leading-normal">
            {boatInfo?.descriptions?.[0]?.listingTypeTitle}
          </h3>

          <div className="col-span-3 flex-1 flex flex-row flex-wrap md:flex-nowrap  justify-between items-center">
            <p className="text-[#9E9E9E] text-base font-normal leading-7 flex items-center gap-1 line-clamp-1">
              <IoLocationOutline className="text-[#FF9500] h-6 w-6 font-bold" />
              <span className="line-clamp-1">
                {boatInfo?.meetingPoint?.[0]?.city}
              </span>
            </p>

            <button className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm md:text-base font-satoshi hover:bg-[#0037ff] transition-colors duration-300 ease-in-out  md:w-44 ">
              <Link href={`/search-charter/${boatInfo?.id}`}>
                More information
              </Link>
            </button>
          </div>
        </div>

        <p className="text-base text-[#878787] my-4 line-clamp-2">
          {boatInfo?.descriptions?.[0]?.listingTypeDescription}
        </p>
        <p className="font-bold text-sm text-[#171717] ">Key features:</p>

        <div className="flex flex-wrap  md:flex-row w-full items-center gap-2 md:gap-4 mt-4">
          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={doller}
              alt={"doller"}
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            {boatInfo?.boatLength} meeter
          </div>

          <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
            <Image
              src={men}
              alt={"men"}
              height={100}
              width={100}
              className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
            />
            Up to {boatInfo?.guests} people
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-base text-[#171717] font-bold leading-6">
            Fishing species:{" "}
            {boatInfo?.fishing?.[0]?.species?.map(
              (specie: string, index: number) => (
                <span key={index} className="text-[#878787] font-normal">
                  {" "}
                  {specie},
                </span>
              )
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TopChartersCard;
