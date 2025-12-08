import React from "react";

import { cardData } from "@/constant/SearchDestinations";
import SearchDestinationsCard from "./SearchDestinationsCard";

export default function SearchDestinations() {
  return (
    <div className="container mx-auto py-20 px-5 xl:px-0">
      <h1 className="text-[#242424] text-2xl font-bold my-6">
        Search our destinations{" "}
      </h1>

      <div className="grid grid-cols-1  md:grid-cols-3 grid-rows-1 gap-8 justify-center items-center">
        {cardData.map((cardInfo, index) => (
          <SearchDestinationsCard key={index} cardInfo={cardInfo} />
        ))}
      </div>
    </div>
  );
}
