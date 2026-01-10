import React from "react";

import { cardData } from "@/constant/SearchDestinations";
import SearchDestinationsCard from "./SearchDestinationsCard";
import Container from "../common/Container";

export default function SearchDestinations() {
  return (
    <Container className="">
      <h1 className="text-[#242424] text-4xl font-bold mb-6">
        Search our destinations{" "}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 grid-rows-1 lg:gap-8 md:gap-6.5 gap-5 justify-center items-center">
        {cardData.slice(0, 3).map((cardInfo, index) => (
          <SearchDestinationsCard
            key={index}
            cardInfo={cardInfo}
            isLast={index === cardData.length - 1}
          />
        ))}
      </div>
    </Container>
  );
}
