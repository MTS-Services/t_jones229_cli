"use client";
import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import doller from "@/assets/boat2.svg";
import men from "@/assets/icon/men.svg";
import placeholderImage from "@/assets/placeholder.webp";
import Link from "next/link";
import { CardProps } from "@/types/pricingCard";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";
import { IoFishOutline } from "react-icons/io5";

const TopChartersCard = ({ boatInfo }) => {
  return (
    <a href={`/search-charter/${boatInfo?.id}`} className="block">
      <div className="group relative w-full h-[420px] rounded-2xl overflow-hidden bg-slate-900 shadow-xl cursor-pointer">
        {/* Full Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={boatInfo?.photos?.[0]?.url || "/placeholder.webp"}
            alt={
              boatInfo?.descriptions?.[0]?.listingTypeTitle || "Charter Boat"
            }
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent transition-opacity duration-300 z-10" />
        </div>

        {/* Floating Price/Location Badge */}
        <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <FiMapPin size={12} /> {boatInfo?.meetingPoint?.[0]?.city}
          </span>
        </div>

        {/* Content Container */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full z-20">
          <div className="transform translate-y-[60px] group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
              {boatInfo?.descriptions?.[0]?.listingTypeTitle}
            </h3>

            <div className="flex items-center gap-4 text-slate-300 text-sm mb-4">
              <span className="flex items-center gap-1">
                <FiUsers size={14} className="text-orange-400" />{" "}
                {boatInfo?.guests} Guests
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-1">
                <MdAnchor size={14} className="text-orange-400" />{" "}
                {boatInfo?.boatLength}m
              </span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 space-y-4">
              <p className="text-slate-300 text-sm line-clamp-2">
                {boatInfo?.descriptions?.[0]?.listingTypeDescription}
              </p>

              <div className="flex flex-wrap gap-2">
                {boatInfo?.fishing?.[0]?.species
                  ?.slice(0, 3)
                  .map((specie, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 bg-white/10 border border-white/10 px-2 py-1 rounded text-xs text-white"
                    >
                      <IoFishOutline size={10} /> {specie}
                    </div>
                  ))}
              </div>

              <button className="w-full mt-2 bg-white text-slate-900 py-3 rounded-lg font-bold text-sm hover:bg-orange-400 hover:text-white transition-colors">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default TopChartersCard;
