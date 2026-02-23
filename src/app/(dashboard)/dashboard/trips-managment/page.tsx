import TripsManagement from "@/components/dashboard/admin/tripsManagement/TripsManagement";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
        <p className="text-gray-600">
          Manage and moderate all trips, including bookings and schedules.
        </p>
      </div>
      <TripsManagement />
    </div>
  );
}
