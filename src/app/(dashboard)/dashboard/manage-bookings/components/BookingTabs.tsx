import React from "react";
import { Anchor, Calendar, Clock, Filter } from "lucide-react";
import { TabKey, Tab } from "../types/types";
import BookingCard from "./BookingCard";
import BookingCardSkeleton from "./BookingCardSkeleton";
import EmptyState from "./EmptyState";

const TABS: Tab[] = [
  { key: "today", label: "Today", icon: Anchor },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
  { key: "past", label: "Past", icon: Clock },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETE", label: "Completed" },
  { value: "CANCEL", label: "Cancelled" },
];

interface BookingTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  bookings: any[];
  counts: Record<TabKey, number>;
  isLoading: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export default function BookingTabs({
  activeTab,
  onTabChange,
  bookings,
  counts,
  isLoading,
  statusFilter,
  onStatusFilterChange,
}: BookingTabsProps) {
  const getEmptyMessage = (tab: TabKey) => {
    const messages = {
      today: {
        message: "No bookings today",
        sub: "New bookings will appear here",
      },
      upcoming: {
        message: "No upcoming bookings",
        sub: "New bookings will appear here",
      },
      past: {
        message: "No past bookings yet",
        sub: "Your completed bookings will appear here",
      },
    };
    return messages[tab];
  };

  return (
    <div className="bg-slate-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Header */}
      <div className="border-b border-gray-100 px-4 pt-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    isActive
                      ? "border-[#035292] text-[#035292]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {counts[tab.key] > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? "bg-red-500 text-[#ecf4fc]"
                          : "bg-red-500 text-[#ecf4fc]"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 pb-2">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#035292] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showCancel={activeTab !== "past"}
              />
            ))}
          </div>
        ) : (
          <EmptyState {...getEmptyMessage(activeTab)} />
        )}
      </div>
    </div>
  );
}
