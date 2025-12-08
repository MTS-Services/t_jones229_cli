"use client";

import React from "react";
import bgImage from "@/assets/userDashboard2.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Divider } from "antd";
import UpcomingBokingCard from "../captain/mannag-booking/UpcomingBokingCard";
import PostBokingCard from "../captain/mannag-booking/PostBokingCard";

import Loader from "@/components/ui/Loader";
import { useGetAllUserBookingQuery } from "@/redux/api/userDashboardApi/userBooking";
import Link from "next/link";

export default function YourTrip() {
  const { data, isLoading } = useGetAllUserBookingQuery({});
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* bannear  */}
      <div
        style={{ backgroundImage: `url(${bgImage.src})` }}
        className="px-8 md:px-16 py-11 flex flex-col md:flex-row gap-5 justify-between rounded-md bg-cover bg-no-repeat bg-center relative z[-1] "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-0 rounded-md" />
        <div className="z-[9]">
          <h1 className="text-2xl font-normal leading-10 text-white">
            Find your next trip
          </h1>
          <p className="max-w-2xl text-white text-base font-light py-4">
            Ready for your next adventure? Search for a new trip
          </p>
          <Link
            href={"/"}
            className="bg-[#ffaa33] text-white px-4 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-[#0037ff] transition-colors duration-300 ease-in-out w-32"
          >
            Next
            <MdKeyboardArrowRight className="size-5" />
          </Link>
        </div>
      </div>
      <div>
        <h1 className="text-base md:text-2xl font-normal leading-normal">
          Upcoming trips:
        </h1>
      </div>
      <Divider style={{ borderColor: "#d9d9d9" }} className="my-4" />

      <div className="space-y-6">
        {isLoading ? (
          <Loader />
        ) : (
          data?.data?.upcomingTrips?.map((trip: any) => (
            <UpcomingBokingCard key={trip.id} {...trip} />
          ))
        )}
      </div>

      <div>
        <h1 className="text-base md:text-2xl font-normal leading-normal">
          Past Trips:
        </h1>
      </div>
      <Divider style={{ borderColor: "#d9d9d9" }} className="my-4" />
      <div className="space-y-6">
        {isLoading ? (
          <Loader />
        ) : (
          data?.data?.pastTrips.map((trip: any) => (
            <PostBokingCard key={trip.id} {...trip} />
          ))
        )}
      </div>
    </div>
  );
}
