import React from "react";
import Faq from "../DetailsPage/Faq";
import {
  AvailabilityItems,
  PricingItems,
  StartedItems,
} from "@/constant/BoatListFaq";

export default function BoatLintFaq() {
  return (
    <div className="bg-[#f5f5f5] py-20">
      <div className="container mx-auto px-5 xl:px-0">
        <h1 className="text-xl md:text-3xl lg:text-5xl text-[#242424] font-bold md:font-normal leading-[52px] ">
          Frequently asked questions
        </h1>

        <div className="py-10">
          <div>
            <h1 className=" text-base md:text-xl font-bold">Getting Started</h1>
            <Faq items={StartedItems} />
          </div>
        </div>
        <div className="py-10">
          <div>
            <h1 className="text-base md:text-xl font-bold">Pricing & Earnings</h1>
            <Faq items={PricingItems} />
          </div>
        </div>
        <div className="py-10">
          <div>
            <h1 className="text-base md:text-xl font-bold">Availability & Managing Trips</h1>
            <Faq items={AvailabilityItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
