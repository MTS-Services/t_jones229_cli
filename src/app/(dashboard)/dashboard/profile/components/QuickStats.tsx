import React from "react";
import { Ship, Calendar, Clock } from "lucide-react";
import { ProfileStats } from "../types/profile.types";
import { formatDate } from "../utils/formatters";

interface QuickStatsProps {
  stats: ProfileStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Trips</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalTrips}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Ship className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Active Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.activeBookings}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Member Since</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatDate(stats.memberSince)}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
