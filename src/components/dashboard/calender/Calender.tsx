"use client";
import { useLazyGetCalenderQuery } from "@/redux/api/calenderApi";
import { CalendarDashboard } from "./CalenderDashboard";
import { BoatBookingDashboardSkeleton } from "@/components/ui/BoatBookingDashboardSkeleton";

export default function Calender() {
  const [getCalender, { data, isLoading }] = useLazyGetCalenderQuery();

  return (
    <div className=" bg-white">
      {isLoading ? (
        <BoatBookingDashboardSkeleton />
      ) : (
        <CalendarDashboard calenderHandler={getCalender} data={data?.data} />
      )}
    </div>
  );
}
