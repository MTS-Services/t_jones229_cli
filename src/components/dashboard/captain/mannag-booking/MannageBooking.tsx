"use client";
import React from "react";
import UpcomingTrips from "./UpcomingTrips";
import PostTrips from "./PostTrips";
import { useGetAllUserBookingQuery } from "@/redux/api/userDashboardApi/userBooking";

function TripCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-[300px] h-[200px] bg-gray-300 rounded"></div>
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
}

export default function MannageBooking() {
  const { data, isLoading } = useGetAllUserBookingQuery({});
  const upcomingTrips = data?.data?.upcomingTrips;
  const postTrips = data?.data?.pastTrips;

  if (isLoading) {
    return (
      <div className="p-4">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <UpcomingTrips upcomingTrips={upcomingTrips} />
      <PostTrips postTrips={postTrips} />
    </div>
  );
}
