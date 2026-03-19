import { Booking } from "../types/types";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/**
 * Returns the number of days in a month (0-based month index)
 */
export const getDaysInMonth = (month: number, year: number): number =>
  new Date(year, month + 1, 0).getDate();

/**
 * Returns the 0-based weekday index of the first day of the month (Mon=0 … Sun=6)
 */
export const getFirstDayOfMonth = (month: number, year: number): number => {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
};

/**
 * Formats a calendar date as "YYYY-MM-DD"
 */
export const formatCalendarDate = (
  day: number,
  month: number,
  year: number,
): string => {
  const monthStr = (month + 1).toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
};

/**
 * Returns the Tailwind dot colour class for a booking status
 */
export const getStatusDotColor = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return "bg-emerald-500";
    case "PENDING":
      return "bg-amber-500";
    case "CANCELLED":
      return "bg-red-500";
    case "COMPLETE":
      return "bg-blue-500";
    default:
      return "bg-slate-500";
  }
};

/**
 * Returns the Tailwind badge colour classes for a booking status
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200";
  }
};

/**
 * Returns the Tailwind colour classes for a booking type badge
 */
export const getBookingTypeColor = (type: string): string =>
  type === "PRIVATE"
    ? "bg-purple-100 text-purple-800 border-purple-200"
    : "bg-blue-100 text-blue-800 border-blue-200";

/**
 * Filters bookings by search term and status
 */
export const filterBookings = (
  bookings: Booking[],
  searchTerm: string,
  statusFilter: string,
): Booking[] =>
  bookings?.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking?.user?.firstName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      booking?.user?.lastName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      booking?.boat?.trips?.[0]?.tripName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      booking?.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }) ?? [];
