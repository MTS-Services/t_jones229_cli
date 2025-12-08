"use client";

import React from "react";
import TopChartersCard from "./TopChartersCard";
import Loader from "../ui/Loader";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";

export default function TopCharters() {
  const { data, isLoading } = useGetAllBoatQuery({
    limit: 4,
    page: 1,
  });

  const currentItems = data?.data?.data || [];

  return (
    <div className="mt-20 container mx-auto ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-black text-[#242424] px-5 xl:px-0">
          Top charters this month
        </h1>
      </div>

      <div className="px-5 xl:px-0">
        {/* this is group charter  */}
        {isLoading ? (
          <Loader />
        ) : (
          currentItems &&
          currentItems?.map((card: any) => (
            <TopChartersCard key={card.id} boatInfo={card} /> //private charter
          ))
        )}
      </div>
    </div>
  );
}
