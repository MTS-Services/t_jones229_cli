"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

// Components
import DetailsCarousel from "@/components/DetailsPage/DetailsCarousel";
import Faq from "@/components/DetailsPage/Faq";
import KeyFeature from "@/components/DetailsPage/KeyFeature";
import PaymentMap from "@/components/Payment/PaymentMap";
import Container from "@/components/common/Container";
import Loader from "@/components/ui/Loader";
import {
  BoatOverview,
  CaptainSection,
  TripSelectionSection,
} from "./components";

// Hooks & Utils
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import { loadSearchDataFromStorage } from "./utils";
import { TripDetails } from "./types";

export default function BoatDetailsPage() {
  const params = useParams();
  const boatId = params?.id as string;

  // State
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    location: null,
    date: "",
    guests: 1,
  });

  // Queries
  const { data: boatData, isLoading } = useGetSingleBoatQuery(boatId);
  const boatInfo = boatData?.data;

  // Load search data on mount
  useEffect(() => {
    const searchData = loadSearchDataFromStorage();
    setTripDetails(searchData);
  }, []);

  // Memoized values
  const captainName = useMemo(
    () =>
      [boatInfo?.captain?.firstName, boatInfo?.captain?.lastName]
        .filter(Boolean)
        .join(" ") || "Unknown",
    [boatInfo],
  );

  const meetingLocation = useMemo(() => {
    const mp = boatInfo?.meetingPoint?.[0];
    if (!mp) return "Location not specified";
    return [
      mp.street,
      mp.city,
      mp.state,
      mp.country,
    ]
      .filter(Boolean)
      .join(", ");
  }, [boatInfo]);

  if (isLoading) return <Loader />;

  return (
    <Container className="">
      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 lg:mt-30 md:mt-28 mt-20">
        {/* Image Carousel */}
        <div className="col-span-1 order-1">
          <DetailsCarousel product={boatInfo?.photos} />
        </div>

        {/* Boat Details */}
        <div className="col-span-1 order-2">
          <BoatOverview
            title={boatInfo?.descriptions?.[0]?.listingTypeTitle}
            description={boatInfo?.descriptions?.[0]?.listingTypeDescription}
          />

          <CaptainSection
            captainName={captainName}
            location={meetingLocation}
            detailsHref={`/search-charter/${boatId}/details`}
          />

          <div className="my-4">
            <PaymentMap location={boatInfo?.meetingPoint?.[0]} />
          </div>

          <div className="pb-4">
            <KeyFeature boatInfo={boatInfo} />
          </div>

          <Faq />
        </div>
      </div>

      {/* Trip Selection Section */}
      <TripSelectionSection
        trips={boatInfo?.trips}
        boatId={boatId}
        boatImage={boatInfo?.photos}
        tripDetails={tripDetails}
      />
    </Container>
  );
}
