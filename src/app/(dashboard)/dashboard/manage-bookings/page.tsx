"use client";

import React, { useMemo } from "react";
import { useAllBookingQuery } from "@/redux/api/userDashboardApi/userBooking";
import ManageBookings from "./components/ManageBookings";

// Helper function to categorize bookings
const categorizeBookings = (bookings: any[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTrips: any[] = [];
  const upcomingTrips: any[] = [];
  const pastTrips: any[] = [];

  bookings.forEach((booking) => {
    const tripDate = new Date(booking.tripDate);
    tripDate.setHours(0, 0, 0, 0);

    if (tripDate.getTime() === today.getTime()) {
      todayTrips.push(booking);
    } else if (tripDate >= tomorrow) {
      upcomingTrips.push(booking);
    } else {
      pastTrips.push(booking);
    }
  });

  return { todayTrips, upcomingTrips, pastTrips };
};

export default function Page() {
  const { data, isLoading } = useAllBookingQuery({
    page: 1,
    limit: 100, // Fetch more bookings to properly categorize
  });

  const categorizedData = useMemo(() => {
    const bookings = data?.data || [];
    return categorizeBookings(bookings);
  }, [data?.data]);

  console.log("ALL BOOKING: ", data);
  console.log("CATEGORIZED: ", categorizedData);

  return <ManageBookings data={categorizedData} isLoading={isLoading} />;
}
