"use client";

import React from "react";
import { Divider } from "antd";
import UpcomingBokingCard from "../captain/mannag-booking/UpcomingBokingCard";
import PostBokingCard from "../captain/mannag-booking/PostBokingCard";
import { useGetAllUserBookingQuery } from "@/redux/api/userDashboardApi/userBooking";

export default function YourTrip() {
  const { data, isLoading } = useGetAllUserBookingQuery({});
  return (
    <div className="space-y-8">
      {/* bannear  */}
      <div className="bg-slate-100 p-6 rounded-lg">
        <h1 className="text-2xl md:text-4xl font-bold leading-normal">
          Your Trips
        </h1>
        <p>Manage and view all your upcoming and past trips.</p>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <div>
          <h1 className="text-base md:text-2xl font-normal leading-normal">
            Upcoming trips:
          </h1>
        </div>
        <Divider style={{ borderColor: "#d9d9d9" }} className="my-4" />

        <div className="space-y-6">
          {isLoading
            ? "Loading..."
            : data?.data?.upcomingTrips?.map((trip: any) => (
                <UpcomingBokingCard key={trip.id} {...trip} />
              ))}
        </div>

        <div>
          <h1 className="text-base md:text-2xl font-normal leading-normal">
            Past Trips:
          </h1>
        </div>
        <Divider style={{ borderColor: "#d9d9d9" }} className="my-4" />
        <div className="space-y-6">
          {isLoading
            ? "Loading..."
            : data?.data?.pastTrips.map((trip: any) => (
                <PostBokingCard key={trip.id} {...trip} />
              ))}
        </div>
      </div>
    </div>
  );
}
