"use client";

import DetailsCarousel from "@/components/DetailsPage/DetailsCarousel";
import React, { useEffect, useState } from "react";
import image from "@/assets/capt.png";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import Faq from "@/components/DetailsPage/Faq";
import KeyFeature from "@/components/DetailsPage/KeyFeature";
import PricingCard from "@/components/DetailsPage/PriceingCard";
import { useParams } from "next/navigation";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import Loader from "@/components/ui/Loader";

export default function Page() {
  const [location, setLocation] = useState<string | null>();
  const [date, setDate] = useState<string | null>();
  const [guests, setGuests] = useState<string | null>();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const location = localStorage.getItem("location");
    setLocation(location);
    const startDate = localStorage.getItem("StartDate");
    setDate(startDate);

    const guests = localStorage.getItem("Guests");
    setGuests(guests);
  }, []);

  const { data, isLoading } = useGetSingleBoatQuery(id);
  const boatInfo = data?.data;

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto  ">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mt-10 px-5 lg:px-2">
        <div className="max-w-sm lg:max-w-lg">
          <DetailsCarousel product={boatInfo?.photos} />
        </div>
        <div className="">
          <div>
            <h1 className="text-xl md:text-3xl text-[#242424] font-bold">
              {boatInfo?.descriptions?.[0]?.listingTypeTitle}
            </h1>
            <p className="text-base text-[#878787] font-normal font-satoshi mt-3">
              {boatInfo?.descriptions?.[0]?.listingTypeDescription}
            </p>
          </div>

          <div className="border-y border-[#D9D9D9] mt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between py-6">
              <div className="flex items-center gap-4">
                <Image
                  src={image}
                  alt="capten"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />

                <h1 className="text-base font-bold text-[#242424]">
                  Captain{" "}
                  <span className=" font-normal text-[#878787]">
                    {boatInfo?.captain?.firstName}{" "}
                    {boatInfo?.captain?.lastName
                      ? boatInfo?.captain?.lastName
                      : "N/A"}
                  </span>
                </h1>
              </div>
              <span className="text-[#9E9E9E] text-base font-normal leading-7 flex items-center gap-1">
                <IoLocationOutline className="text-[#FF9500] h-6 w-6 font-bold" />
                {boatInfo?.meetingPoint?.[0]?.city}
              </span>
            </div>
          </div>
          <div className="border-b border-[#D9D9D9] pb-4">
            <KeyFeature boatInfo={boatInfo} />
          </div>

          <div>
            <h1 className="text-base font-bold text-[#171717] mt-4">
              See the details
            </h1>

            <Faq />
          </div>
        </div>
      </div>

      {/* Select your trip */}
      <div className="mt-5 md:mt-24  px-5 lg:px-2">
        <h1 className="text-xl md:text-[40px] text-[#242424] font-bold leading-7">
          Select your trip
        </h1>
        <h1 className="text-lg md:text-2xl text-[#242424] font-bold py-6">
          {location ? location : ""}
          {" / "}
          {date && !isNaN(new Date(date).getTime())
            ? new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : ""}{" "}
          / {guests} people
        </h1>

        <div className="w-full">
          {boatInfo &&
            boatInfo?.trips?.map((card: any) => (
              <PricingCard
                key={card.id}
                tripInfo={card}
                boatId={id}
                image={boatInfo?.photos?.[0]?.url}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
