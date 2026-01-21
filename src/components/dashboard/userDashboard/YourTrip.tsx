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
