"use client";

import { useLazyGetCalenderQuery } from "@/redux/api/calenderApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { CalendarDashboard } from "./CalendarDashboard";
import CalendarSkeleton from "./CalendarSkeleton";

export default function TripCalendar() {
  const [getCalender, { data, isLoading }] = useLazyGetCalenderQuery();
  const { data: userData } = useGetMeQuery("");
  const captainId = userData?.data?.id as string | undefined;

  return (
    <div className="bg-white">
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <CalendarDashboard
          calenderHandler={getCalender}
          data={data?.data}
          captainId={captainId}
        />
      )}
    </div>
  );
}
