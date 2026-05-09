import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { BookingStatus, StatusConfig } from "../types/types";

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats departure time from 24-hour to 12-hour format
 */
export const formatDepartureTime = (raw: string): string => {
  const hour = parseInt(raw, 10);
  if (isNaN(hour)) return raw;
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${suffix}`;
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (val: number | undefined): string =>
  `$${(val ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Returns status configuration based on booking status
 */
export const getStatusConfig = (status: BookingStatus): StatusConfig => {
  const statusMap: Record<BookingStatus, StatusConfig> = {
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
    statusMap[status] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: AlertCircle,
      label: status || "Unknown",
    }
  );
};

/**
 * Calculates booking counts by category
 */
export const calculateBookingCounts = (data: any) => {
  const todayTrips = data?.todayTrips || [];
  const upcomingTrips = data?.upcomingTrips || [];
  const pastTrips = data?.pastTrips || [];

  return {
    today: todayTrips.length,
    upcoming: upcomingTrips.length,
    past: pastTrips.length,
    total: todayTrips.length + upcomingTrips.length + pastTrips.length,
  };
};
