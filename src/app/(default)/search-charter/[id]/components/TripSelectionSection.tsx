import React from "react";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import PricingCard from "@/components/DetailsPage/PriceingCard";
import { BoatTrip, BoatPhoto, TripDetails } from "../types";
import { formatDisplayDate } from "../utils";

interface TripSelectionSectionProps {
  trips?: BoatTrip[];
  boatId: string;
  boatImage?: BoatPhoto[];
  tripDetails: TripDetails;
}

export default function TripSelectionSection({
  trips = [],
  boatId,
  boatImage,
  tripDetails,
}: TripSelectionSectionProps) {
  return (
    <div className="mt-10 md:mt-10 px-2 lg:px-0 border-t border-[#c9c8c8]">
      <div className="mt-5 md:mt-10">
        <h1 className="text-xl md:text-3xl text-[#242424] font-bold leading-7">
          Select Your Trip
        </h1>

        {/* Trip Summary with Icons */}
        <div className="flex flex-wrap items-center gap-4 my-4">
          {tripDetails.location && (
            <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
              <IoLocationOutline className="text-[#FF9500] h-5 w-5" />
              <span>{tripDetails.location}</span>
            </div>
          )}

          {tripDetails.date && (
            <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
              <IoCalendarOutline className="text-[#FF9500] h-5 w-5" />
              <span>{formatDisplayDate(tripDetails.date)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
            <IoPeopleOutline className="text-[#FF9500] h-5 w-5" />
            <span>{tripDetails.guests} people</span>
          </div>
        </div>

        <div>
          {trips.map((trip: any, index: number) => (
            <PricingCard
              key={trip.id}
              tripInfo={trip}
              boatId={boatId}
              image={boatImage || []}
              imageIndex={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
