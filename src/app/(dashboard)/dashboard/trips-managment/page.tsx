import TripsManagement from "@/components/dashboard/admin/tripsManagement/TripsManagement";
import { Ship } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div>
          <Ship className="w-10 h-10 text-blue-500 mb-2" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
          <p className="text-gray-600">
            Manage and moderate all trips, including bookings and schedules.
          </p>
        </div>
      </div>
      <TripsManagement />
    </div>
  );
}
