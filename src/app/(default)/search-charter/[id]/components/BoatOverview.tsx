import React from "react";

interface BoatOverviewProps {
  title?: string;
  description?: string;
}

export default function BoatOverview({
  title,
  description,
}: BoatOverviewProps) {
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-[#242424] font-bold">
        {title || "Boat Details"}
      </h1>
      <p className="text-base text-[#878787] font-normal mt-3">
        {description || "No description available"}
      </p>
    </div>
  );
}
