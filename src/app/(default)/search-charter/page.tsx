"use client";

import SearchTab from "@/components/Private-charterTab/searchPageTab";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { useEffect, useState } from "react";

export default function Page() {
  const [city, setCity] = useState<string | null>(null);
  const [guests, setGuests] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<Record<string, string> | null>(
    null
  );

  // Safe access to localStorage
  useEffect(() => {
    const location = localStorage.getItem("location");
    const guestsValue = localStorage.getItem("Guests");
    const dateValue = localStorage.getItem("date");
    const startDateValue = localStorage.getItem("StartDate");
    const bookingType = localStorage.getItem("bookingType");

    setCity(location);
    setGuests(guestsValue);
    setDate(dateValue);

    // Build query params for the count query
    const params: Record<string, string> = {};
    if (location) params.city = location;
    if (startDateValue) params.startDate = startDateValue;
    if (dateValue) params.endDate = dateValue;
    if (bookingType && bookingType !== "undefined" && bookingType !== "null") {
      params.sharedBooking = bookingType;
    }
    const guestsNum = guestsValue ? Number(guestsValue) : 0;
    if (guestsNum > 0) params.guests = guestsNum.toString();

    setQueryParams(params);
  }, []);

  const { data } = useGetAllBoatQuery(queryParams || {}, {
    skip: queryParams === null, // Skip the query until we have params from localStorage
  });

  return (
    <div>
      <div className="bg-[#F5F5F5] pt-[41px] pb-[31px]">
        <div className="container mx-auto px-5 lg:px-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#242424] leading-9">
            {city ? city : ""} {city ? "/" : ""} {date} {date ? "/" : ""}{" "}
            {guests} people
          </h1>

          <h1 className="text-lg md:text-2xl font-normal text-[#474747] leading-7 mt-2">
            {data?.data?.meta?.total ?? 0} Charters available
          </h1>
        </div>
      </div>

      <div>
        <SearchTab />
      </div>
    </div>
  );
}
