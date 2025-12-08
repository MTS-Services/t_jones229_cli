"use client";

// components/TripCard.tsx
import EmailIcon from "@/components/icon/EmailIcon";
import Image from "next/image";
import { TripsBookProps } from "@/types/tripsTypes";
import Link from "next/link";

export default function UpcomingBokingCard({
  tripDate,
  bookingType,
  member,
  trip,
  boat,
}: TripsBookProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row bg-e md:h-[200px] items-center h-[460px] rounded-md shadow-lg">
        <div className="sm:w-[339px] w-[239px] h-[200px] relative  rounded-l-md">
          <Image
            src={boat?.photos?.[0]?.url}
            alt="trip image"
            fill
            className="rounded-l-md"
          />
        </div>
        <div className="w-full flex flex-col justify-center p-4">
          <div>
            <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
              <div>
                <h2 className="text-lg font-semibold">{trip?.tripName}</h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Link href={"/dashboard/support"}>
                    Message us for support
                  </Link>
                  <EmailIcon />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-sm text-gray-500 mt-2">{tripDate}</h1>
              <h1 className="text-sm text-gray-500 mt-2">
                {tripDate &&
                  new Date(tripDate).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "UTC",
                  })}
              </h1>
              {bookingType === "PRIVATE" ? (
                <h1 className="text-sm text-gray-500 mt-2">
                  {bookingType} booking
                </h1>
              ) : (
                <h1 className="text-sm text-gray-500 mt-2">
                  {bookingType} booking {member} members
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
