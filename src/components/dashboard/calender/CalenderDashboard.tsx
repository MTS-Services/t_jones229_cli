/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking, CalendarResponse } from "@/types/calenderTypes";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { BookingCard } from "./BookinCard";
import { CalendarSidebar } from "./CalenderSidebar";

interface CalendarDashboardProps {
  data: CalendarResponse["data"];
  onMonthChange?: (month: number, year: number) => void;
  calenderHandler: (params: { month: number; year: number }) => void;
}

const months = [
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
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarDashboard({
  data,
  onMonthChange,
  calenderHandler,
}: CalendarDashboardProps) {
  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState(
    data?.filter?.month !== undefined
      ? data.filter.month - 1 // API is 1-based
      : today.getMonth() // Default: today’s month
  );

  const [currentYear, setCurrentYear] = useState(
    data?.filter?.year ?? today.getFullYear()
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Update local state when data changes
  useEffect(() => {
    if (data?.filter) {
      setCurrentMonth((data.filter.month ?? today.getMonth() + 1) - 1);
      setCurrentYear(data.filter.year ?? today.getFullYear());
    }
  }, [data?.filter, today]);

  // Call calenderHandler with default month/year on mount
  useEffect(() => {
    calenderHandler({ month: currentMonth + 1, year: currentYear });
  }, [currentMonth, currentYear, calenderHandler]); // include calenderHandler in dependencies

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getBookingsForDate = (date: string) => {
    const dayData = data?.dailyServiceCounts?.find((d) => d?.date === date);
    return dayData?.bookings ?? [];
  };

  const formatDate = (day: number) => {
    const month = (currentMonth + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${currentYear}-${month}-${dayStr}`;
  };

  const getStatusColor = (status: string) => {
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

  const filterBookings = (bookings: Booking[]) => {
    return (
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
      }) ?? []
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();

    // Empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-28 border border-gray-100 bg-gray-50/50"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const bookings = getBookingsForDate(dateStr);
      const isToday =
        today.toDateString() ===
        new Date(currentYear, currentMonth, day).toDateString();
      const isSelected = selectedDate === dateStr;
      const hasBookings = bookings.length > 0;

      days.push(
        <div
          key={day}
          className={`h-28 border border-gray-100 p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
            isToday ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-white"
          } ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""} ${
            hasBookings ? "hover:bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div
            className={`flex items-center justify-between mb-2 ${
              isToday ? "text-blue-700 font-semibold" : "text-gray-900"
            }`}
          >
            <span className="text-sm font-medium">{day}</span>
            {hasBookings && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500">{bookings.length}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {bookings.slice(0, 2).map((booking) => (
              <div
                key={booking?.id}
                className={`text-xs px-2 py-1 rounded-md text-white truncate shadow-sm ${getStatusColor(
                  booking?.status
                )}`}
                title={`${booking?.boat?.trips?.[0]?.tripName} - ${booking?.user?.firstName} ${booking?.user?.lastName}`}
              >
                {booking?.boat?.trips?.[0]?.tripName}
              </div>
            ))}
            {bookings.length > 2 && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                +{bookings.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === "prev") {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);

    onMonthChange?.(newMonth + 1, newYear);
    calenderHandler({ month: newMonth + 1, year: newYear });
  };

  const handleMonthSelect = (monthName: string) => {
    const monthIndex = months.indexOf(monthName);
    setCurrentMonth(monthIndex);
    setSelectedDate(null);

    onMonthChange?.(monthIndex + 1, currentYear);
    calenderHandler({ month: monthIndex + 1, year: currentYear });
  };

  const goToToday = () => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const todayDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

    setCurrentMonth(todayMonth);
    setCurrentYear(todayYear);
    setSelectedDate(todayDate);

    onMonthChange?.(todayMonth + 1, todayYear);
    calenderHandler({ month: todayMonth + 1, year: todayYear });
  };

  const selectedBookings = selectedDate
    ? filterBookings(getBookingsForDate(selectedDate))
    : [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm">
        <CalendarSidebar data={data} />
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("prev")}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {months[currentMonth]} {currentYear}
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("next")}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Select
                value={months[currentMonth]}
                onValueChange={handleMonthSelect}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="hover:bg-blue-50"
                onClick={goToToday}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Today
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 gap-0">
              {/* Week day headers */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 text-center text-sm font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {renderCalendarDays()}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && selectedBookings.length > 0 && (
            <Card className="mt-6 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Bookings for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({selectedBookings.length} booking
                    {selectedBookings.length !== 1 ? "s" : ""})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {selectedBookings.map((booking) => (
                    <BookingCard key={booking?.id} booking={booking} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No bookings message */}
          {selectedDate && selectedBookings.length === 0 && (
            <Card className="mt-6 shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Bookings
                </h3>
                <p className="text-gray-500">
                  No bookings found for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
