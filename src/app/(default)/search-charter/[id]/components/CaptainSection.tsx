import React from "react";
import Link from "next/link";
import { IoLocationOutline, IoChevronForward } from "react-icons/io5";
import { User } from "lucide-react";

interface CaptainSectionProps {
  captainName: string;
  location: string;
  detailsHref?: string;
}

export default function CaptainSection({
  captainName,
  location,
  detailsHref,
}: CaptainSectionProps) {
  const inner = (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Avatar + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#035292]/20 to-[#035292]/10 flex items-center justify-center flex-shrink-0 border border-[#035292]/20">
          <User className="w-5 h-5 text-[#035292]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[#FF9500] uppercase tracking-widest">
              Captain
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#242424] leading-tight truncate">
            {captainName}
          </h4>
          <div className="flex items-center gap-1 mt-0.5">
            <IoLocationOutline className="text-[#FF9500] w-3 h-3 flex-shrink-0" />
            <span className="text-xs text-[#9E9E9E] truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      {detailsHref && (
        <div className="flex-shrink-0 flex items-center gap-1 text-[#FF9500] text-xs font-semibold">
          <span className="hidden sm:inline">View details</span>
          <div className="w-7 h-7 rounded-full bg-[#FF9500]/10 flex items-center justify-center hover:bg-[#FF9500]/20 transition-colors">
            <IoChevronForward className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full mt-4">
      {detailsHref ? (
        <Link
          href={detailsHref}
          className="flex w-full bg-gradient-to-r from-[#f8faff] to-white border border-gray-200 rounded-2xl px-4 py-3 hover:border-[#035292]/30 hover:shadow-sm transition-all"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex w-full bg-gradient-to-r from-[#f8faff] to-white border border-gray-200 rounded-2xl px-4 py-3">
          {inner}
        </div>
      )}
    </div>
  );
}
