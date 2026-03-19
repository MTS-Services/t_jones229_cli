"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { CalendarData } from "../types/types";
import { CalendarSidebar } from "./CalendarSidebar";
import DateBookingsModal from "./DateBookingsModal";
import {
  MONTHS,
  WEEK_DAYS,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatCalendarDate,
  getStatusDotColor,
  filterBookings,
} from "../utils/utils";

interface CalendarDashboardProps {
  data: CalendarData | undefined;
  calenderHandler: (params: { month: number; year: number }) => void;
  onMonthChange?: (month: number, year: number) => void;
}

export function CalendarDashboard({
  data,
  calenderHandler,
  onMonthChange,
}: CalendarDashboardProps) {
  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState(
    data?.filter?.month !== undefined
      ? data.filter.month - 1
      : today.getMonth(),
  );

  const [currentYear, setCurrentYear] = useState(
    data?.filter?.year ?? today.getFullYear(),
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (data?.filter) {
      setCurrentMonth((data.filter.month ?? today.getMonth() + 1) - 1);
      setCurrentYear(data.filter.year ?? today.getFullYear());
    }
  }, [data?.filter, today]);

  useEffect(() => {
    calenderHandler({ month: currentMonth + 1, year: currentYear });
  }, [currentMonth, currentYear, calenderHandler]);

  const getBookingsForDate = (date: string) => {
    const dayData = data?.dailyServiceCounts?.find((d) => d?.date === date);
    return dayData?.bookings ?? [];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const todayDate = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20 border border-gray-100 bg-gray-50/50"
        />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatCalendarDate(day, currentMonth, currentYear);
      const bookings = getBookingsForDate(dateStr);
      const isToday =
        todayDate.toDateString() ===
        new Date(currentYear, currentMonth, day).toDateString();
      const isSelected = selectedDate === dateStr;
      const hasBookings = bookings.length > 0;

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-100 p-1.5 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-blue-300 ${
            isToday ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-white"
          } ${isSelected ? "ring-1 ring-blue-500 bg-blue-50" : ""} ${
            hasBookings ? "hover:bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div
            className={`flex items-center justify-between mb-1 ${
              isToday ? "text-blue-700 font-semibold" : "text-gray-900"
            }`}
          >
            <span className="text-xs font-medium">{day}</span>
            {hasBookings && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-[10px] text-gray-500">
                  {bookings.length}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            {bookings.slice(0, 2).map((booking) => (
              <div
                key={booking?.id}
                className={`text-[10px] px-1.5 py-0.5 rounded text-white truncate shadow-sm ${getStatusDotColor(
                  booking?.status,
                )}`}
                title={`${booking?.boat?.trips?.[0]?.tripName} - ${booking?.user?.firstName} ${booking?.user?.lastName}`}
              >
                {booking?.boat?.trips?.[0]?.tripName}
              </div>
            ))}
            {bookings.length > 2 && (
              <div className="text-[10px] text-gray-500 px-1 py-0.5 bg-gray-100 rounded">
                +{bookings.length - 2} more
              </div>
            )}
          </div>
        </div>,
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
    const monthIndex = MONTHS.indexOf(monthName as (typeof MONTHS)[number]);
    setCurrentMonth(monthIndex);
    setSelectedDate(null);
    onMonthChange?.(monthIndex + 1, currentYear);
    calenderHandler({ month: monthIndex + 1, year: currentYear });
  };

  const goToToday = () => {
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    const todayStr = todayDate.toISOString().split("T")[0];

    setCurrentMonth(todayMonth);
    setCurrentYear(todayYear);
    setSelectedDate(todayStr);
    onMonthChange?.(todayMonth + 1, todayYear);
    calenderHandler({ month: todayMonth + 1, year: todayYear });
  };

  const selectedBookings = selectedDate
    ? filterBookings(getBookingsForDate(selectedDate), searchTerm, statusFilter)
    : [];

  return (
    <div className="flex-1 lg:px-10 md:px-8 px-6 py-6">
      {/* Sidebar stats */}
      <CalendarSidebar data={data} />

      {/* Calendar area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header with navigation */}
        <div className="py-6">
          <div className="bg-gray-100 rounded-lg border-b border-gray-200 p-4 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="bg-gray-50 hover:bg-blue-50 hover:border-blue-300 h-8 w-8"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {MONTHS[currentMonth]} {currentYear}
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="hover:bg-blue-50 bg-white hover:border-blue-300 h-8 w-8"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex bg-white items-center space-x-2">
                <Select
                  value={MONTHS[currentMonth]}
                  onValueChange={handleMonthSelect}
                >
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month} className="text-sm">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="hover:bg-blue-50 h-8 text-sm px-3"
                  onClick={goToToday}
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Today
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable calendar grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 gap-0">
              {/* Week day headers */}
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-2 text-center text-xs font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {renderCalendarDays()}
            </div>
          </div>
        </div>
      </div>

      {/* Date Bookings Modal */}
      <DateBookingsModal
        selectedDate={selectedDate}
        bookings={selectedBookings}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
