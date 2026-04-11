import React from "react";
import { IoLocationOutline, IoChevronForward } from "react-icons/io5";
import { User } from "lucide-react";

interface CaptainSectionProps {
  captainName: string;
  location: string;
}

export default function CaptainSection({
  captainName,
  location,
}: CaptainSectionProps) {
  return (
    <div className="w-full border-y border-[#D9D9D9] mt-4 py-4">
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Left Side: Image + Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
            <User className="h-12 w-12 md:h-12 md:w-12 rounded-full object-cover flex-shrink-0 text-gray-400 p-2" />
          </div>

          <div>
            <h4 className="text-sm md:text-base font-bold text-[#242424] truncate">
              {captainName}
            </h4>

            <div className="flex items-center gap-1 text-xs md:text-sm truncate">
              <IoLocationOutline className="text-[#FF9500] w-4 h-4" />
              <span className="truncate text-[#9E9E9E]">{location}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action */}
        <div className="flex-shrink-0">
          <button className="text-[#FF9500] hover:bg-[#FF9500]/10 p-2 rounded-full transition-colors">
            <IoChevronForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
