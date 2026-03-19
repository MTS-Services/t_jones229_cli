"use client";

import { useLazyGetCalenderQuery } from "@/redux/api/calenderApi";
import { CalendarDashboard } from "./CalendarDashboard";
import CalendarSkeleton from "./CalendarSkeleton";

export default function TripCalendar() {
  const [getCalender, { data, isLoading }] = useLazyGetCalenderQuery();

  return (
    <div className="bg-white">
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <CalendarDashboard calenderHandler={getCalender} data={data?.data} />
      )}
    </div>
  );
}
