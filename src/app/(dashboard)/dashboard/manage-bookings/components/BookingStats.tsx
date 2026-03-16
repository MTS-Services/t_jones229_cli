import React from "react";
import { Ship, Calendar, Clock, Anchor } from "lucide-react";
import { StatCard } from "../types/types";

interface BookingStatsProps {
  counts: {
    today: number;
    upcoming: number;
    past: number;
    total: number;
  };
}

export default function BookingStats({ counts }: BookingStatsProps) {
  const stats: StatCard[] = [
    {
      label: "Today",
      value: counts.today,
      bg: "bg-orange-50",
      color: "text-orange-600",
      iconBg: "bg-orange-100",
      icon: <Anchor className="h-5 w-5 text-orange-500" />,
    },
    {
      label: "Upcoming",
      value: counts.upcoming,
      bg: "bg-blue-50",
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Completed",
      value: counts.past,
      bg: "bg-gray-50",
      color: "text-gray-600",
      iconBg: "bg-gray-100",
      icon: <Clock className="h-5 w-5 text-gray-500" />,
    },
    {
      label: "Total Bookings",
      value: counts.total,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <Ship className="h-5 w-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} p-4 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-2.5 ${stat.iconBg} rounded-xl`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
