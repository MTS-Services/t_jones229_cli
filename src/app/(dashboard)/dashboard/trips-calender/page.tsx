import Calender from "@/components/dashboard/calender/Calender";
import TitleSection from "@/components/dashboard/captain/TiltleSection";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trips Calendar</h1>
        <p className="text-gray-600">
          Manage and view all your upcoming trips in one place.
        </p>
      </div>

      <Calender />
    </div>
  );
}
