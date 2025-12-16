"use client";
import BookingSection from "@/components/Group-charter/GroupBooking";
import React, { useEffect, useState } from "react";

export default function GroupBooking() {
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTripDate(localStorage.getItem("date"));
      setLocation(localStorage.getItem("location"));
      setNumberOfGuests(localStorage.getItem("Guests"));
    }
  }, []);

  return (
    <div>
      <div>
        <div className="bg-[#F5F5F5] pt-[41px] pb-[31px] ">
          <div className="container mx-auto px-5 lg:px-0">
            <h1 className="text-xl md:text-2xl font-bold text-[#242424] leading-9">
              {location ?? "Location not set"} / {tripDate ?? "Date not set"} /{" "}
              {numberOfGuests ?? "Guests not set"} people
            </h1>
          </div>
        </div>
      </div>

      <BookingSection />
    </div>
  );
}
