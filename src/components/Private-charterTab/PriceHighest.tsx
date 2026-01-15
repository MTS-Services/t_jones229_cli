import React, { useEffect, useState } from "react";
import TopChartersCard from "../Home/TopChartersCard";
import Loader from "../ui/Loader";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import Pagination from "../ReUsible/Pagination";

interface PriceHighestProps {
  currentItems: any[];
  isLoading: boolean;
}

export default function PriceHighest({
  currentItems,
  isLoading,
}: PriceHighestProps) {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems && currentItems?.length > 0
          ? currentItems?.map((card: any) => (
              <TopChartersCard key={card.id} boatInfo={card} />
            ))
          : "No data available"}
      </div>
    </div>
  );
}
