import { cardData } from "@/constant/ExperienceCard";
import React from "react";
import ExperienceCard from "./ExperienceCard";

export default function Experience() {
  return (
    <div className="bg-[#0f5d9e]">
      <div className="px-5 lg:px-28 py-16">
        <div className="container mx-auto text-center">
          <p className="text-base font-bold leading-7 text-white">
            WHY CHOOSE FISHING TRIPPER?
          </p>
          <h1 className="mt-4 text-white text-xl md:text-4xl font-normal leading-10 mb-2">
            Experience Fishing Like Never Before
          </h1>
          <p className="text-base md:text-lg font-normal text-white leading-8 px-0 lg:px-32 font-satoshi">
            Planning your fishing adventure has never been easier. With flexible
            options, top-rated captains, and seamless booking, we make sure your
            trip is tailored just for you. Whether you're a seasoned angler or a
            first-timer, we've got everything you need for an unforgettable
            experience on the water.
          </p>
        </div>
        <div className="grid lg:gap-8 md:gap-6.5 gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:mt-16 md:mt-12 mt-8 container mx-auto">
          {/* Added a check to ensure cardData exists before mapping */}
          {cardData?.map((cardInfo, index) => (
            <ExperienceCard
              key={index}
              cardInfo={cardInfo}
              isLast={index === cardData.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
