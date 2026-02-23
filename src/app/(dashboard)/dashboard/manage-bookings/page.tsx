import UpcomingTrips from "@/components/dashboard/captain/mannag-booking/MannageBooking";
import TitleSection from "@/components/dashboard/captain/TiltleSection";
import React from "react";

export default function page() {
  return (
    <div>
      {/* <TitleSection /> */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage bookings</h1>
        <p className="text-gray-600">Manage your upcoming bookings here.</p>
      </div>

      <UpcomingTrips />
    </div>
  );
}
