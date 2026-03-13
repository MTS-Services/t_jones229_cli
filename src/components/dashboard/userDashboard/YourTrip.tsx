"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Ship,
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Anchor,
  Sunrise,
  Timer,
  MailCheck,
  MailIcon,
  User2,
} from "lucide-react";
import { useGetAllUserBookingQuery } from "@/redux/api/userDashboardApi/userBooking";
import CancelBookModal from "../modal/CancelBookModal";
import EmailModal from "../modal/SendEmailModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

/* ── helpers ── */

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDepartureTime = (raw: string) => {
  const hour = parseInt(raw, 10);
  if (isNaN(hour)) return raw;
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${suffix}`;
};

const formatCurrency = (val: number | undefined) =>
  `$${(val ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getStatusConfig = (status: string) => {
  const map: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      icon: typeof CheckCircle;
      label: string;
    }
  > = {
    CONFIRMED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Confirmed",
    },
    UPCOMING: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: Clock,
      label: "Upcoming",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: AlertCircle,
      label: "Pending",
    },
    CANCEL: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: XCircle,
      label: "Cancelled",
    },
    COMPLETE: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: CheckCircle,
      label: "Completed",
    },
  };
  return (
    map[status] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: AlertCircle,
      label: status || "Unknown",
    }
  );
};

/* ── Trip Card ── */

function TripCard({
  booking,
  showCancel = false,
}: {
  booking: any;
  showCancel?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const {
    trip,
    boat,
    status,
    tripDate,
    bookingType,
    groupSize,
    payFirst,
    payDue,
    id,
    userId,
  } = booking;
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const captain = boat?.captain;
  const photo = boat?.photos?.[0]?.url;
  const meetingPoint = boat?.meetingPoint?.[0];

  return (
    <>
      <CancelBookModal
        isOpen={isModalOpen}
        id={id}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="relative lg:w-72 h-52 lg:h-auto bg-gray-100 flex-shrink-0">
            {photo && !imgError ? (
              <Image
                src={photo}
                alt={trip?.tripName || "Trip"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 288px"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Ship className="h-12 w-12 text-gray-300" />
              </div>
            )}
            {/* Booking type badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${
                  bookingType === "PRIVATE"
                    ? "bg-purple-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {bookingType}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 lg:p-6">
            {/* Top row: name + status */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {trip?.tripName || "N/A"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {boat?.boatType || "Boat"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
              </span>
            </div>

            {/* Trip info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatDate(tripDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Sunrise className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>Departs {formatDepartureTime(trip?.departureTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{trip?.duration || 0} hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>
                  {groupSize || 1} guest{(groupSize || 1) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatCurrency(trip?.price)}</span>
              </div>
              {meetingPoint?.city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{meetingPoint.city}</span>
                </div>
              )}
            </div>

            {/* Captain + Payment row */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
              {/* Captain info */}
              {captain && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                    <User2 />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {captain.firstName} {captain.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Captain</p>
                  </div>
                </div>
              )}

              {/* Payment summary */}
              <div className="flex items-center gap-3 ml-auto">
                {(payFirst ?? 0) > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(payFirst)}
                    </p>
                  </div>
                )}
                {(payDue ?? 0) > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due</p>
                    <p className="text-sm font-semibold text-red-500">
                      {formatCurrency(payDue)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {captain && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all group">
                  <MailIcon className="w-5 h-5 text-blue-600" />
                  <EmailModal
                    reciverId={userRole === "CAPTAIN" ? userId : captain.id}
                  />
                </div>
              )}
              {showCancel && status !== "CANCEL" && status !== "COMPLETE" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Skeleton ── */

function TripCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72 h-52 lg:h-auto bg-gray-200" />
        <div className="flex-1 p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ── */

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Ship className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

/* ── Tab names ── */

type TabKey = "today" | "upcoming" | "past";

const TABS: { key: TabKey; label: string; icon: typeof Calendar }[] = [
  { key: "today", label: "Today", icon: Anchor },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
  { key: "past", label: "Past", icon: Clock },
];

/* ── Main Component ── */

export default function YourTrip() {
  const { data, isLoading } = useGetAllUserBookingQuery({});
  const [activeTab, setActiveTab] = useState<TabKey>("today");

  const todayTrips: any[] = data?.data?.todayTrips || [];
  const upcomingTrips: any[] = data?.data?.upcomingTrips || [];
  const pastTrips: any[] = data?.data?.pastTrips || [];

  const tripsByTab: Record<TabKey, any[]> = {
    today: todayTrips,
    upcoming: upcomingTrips,
    past: pastTrips,
  };

  const counts: Record<TabKey, number> = {
    today: todayTrips.length,
    upcoming: upcomingTrips.length,
    past: pastTrips.length,
  };

  const totalTrips =
    todayTrips.length + upcomingTrips.length + pastTrips.length;

  const stats = [
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
      label: "Total Trips",
      value: totalTrips,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <Ship className="h-5 w-5 text-emerald-500" />,
    },
  ];

  const activeBookings = tripsByTab[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#035292] p-6 md:p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl">
            <Ship className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Your Trips</h1>
        </div>
        <p className="text-blue-100">
          Track, manage, and relive your fishing adventures
        </p>
      </div>

      {/* Stats */}
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
              <div className={`p-2.5 ${stat.iconBg} rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Header */}
        <div className="border-b border-gray-100 px-4 pt-2">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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
                          ? "bg-[#035292]/10 text-[#035292]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-4">
              <TripCardSkeleton />
              <TripCardSkeleton />
            </div>
          ) : activeBookings.length > 0 ? (
            <div className="space-y-4">
              {activeBookings.map((booking: any) => (
                <TripCard
                  key={booking.id}
                  booking={booking}
                  showCancel={activeTab !== "past"}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                activeTab === "today"
                  ? "No trips today"
                  : activeTab === "upcoming"
                    ? "No upcoming trips"
                    : "No past trips yet"
              }
              sub={
                activeTab === "past"
                  ? "Your completed trips will appear here"
                  : "Ready for your next fishing adventure?"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
