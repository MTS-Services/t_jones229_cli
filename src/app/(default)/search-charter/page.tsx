"use client";

import SearchTab from "@/components/Private-charterTab/searchPageTab";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { useEffect, useState } from "react";

export default function Page() {
  const [city, setCity] = useState<string | null>(null);
  const [guests, setGuests] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  // Safe access to localStorage
  useEffect(() => {
    setCity(localStorage.getItem("location"));
    setGuests(localStorage.getItem("Guests"));
    setDate(localStorage.getItem("date"));
  }, []);

  const { data } = useGetAllBoatQuery({});

  return (
    <div>
      <div className="bg-[#F5F5F5] pt-[41px] pb-[31px]">
        <div className="container mx-auto px-5 lg:px-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#242424] leading-9">
            {city ? city : ""} {city ? "/" : ""} {date} {date ? "/" : ""}{" "}
            {guests} people
          </h1>

          <h1 className="text-lg md:text-2xl font-normal text-[#474747] leading-7 mt-2">
            {data?.data?.data?.length === 0 ? 0 : data?.data?.data?.length}{" "}
            Charters available
          </h1>
        </div>
      </div>

      <div>
        <SearchTab />
      </div>
    </div>
  );
}
