"use client";

import React, { useState } from "react";
import { Ship } from "lucide-react";
import { TabKey } from "../types/types";
import { calculateBookingCounts } from "../utils/utils";
import BookingStats from "./BookingStats";
import BookingTabs from "./BookingTabs";

interface ManageBookingsProps {
  data: any;
  isLoading: boolean;
}

export default function ManageBookings({
  data,
  isLoading,
}: ManageBookingsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("today");

  const todayTrips = data?.todayTrips || [];
  const upcomingTrips = data?.upcomingTrips || [];
  const pastTrips = data?.pastTrips || [];

  const tripsByTab: Record<TabKey, any[]> = {
    today: todayTrips,
    upcoming: upcomingTrips,
    past: pastTrips,
  };

  const tabCounts: Record<TabKey, number> = {
    today: todayTrips.length,
    upcoming: upcomingTrips.length,
    past: pastTrips.length,
  };

  const counts = calculateBookingCounts(data);
  const activeBookings = tripsByTab[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#035292] p-6 md:p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl">
            <Ship className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Manage Bookings</h1>
        </div>
        <p className="text-blue-100">
          Track and manage all your fishing trip bookings
        </p>
      </div>

      {/* Stats Cards */}
      <BookingStats counts={counts} />

      {/* Tabs with Content */}
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookings={activeBookings}
        counts={tabCounts}
        isLoading={isLoading}
      />
    </div>
  );
}
