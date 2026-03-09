"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoChevronForward,
} from "react-icons/io5";

// Components
import DetailsCarousel from "@/components/DetailsPage/DetailsCarousel";
import Faq from "@/components/DetailsPage/Faq";
import KeyFeature from "@/components/DetailsPage/KeyFeature";
import PricingCard from "@/components/DetailsPage/PriceingCard";
import PaymentMap from "@/components/Payment/PaymentMap";
import Container from "@/components/common/Container";
import Loader from "@/components/ui/Loader";

// Assets & Hooks
import image from "@/assets/capt.png";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";

// Types
interface SearchData {
  location?: string;
  date?: string;
  startDate?: string;
  guests?: number;
  timestamp?: string;
}

interface BoatTrip {
  id: string;
  // Add other trip properties as needed
}

export default function BoatDetailsPage() {
  const params = useParams();
  const boatId = params?.id as string;

  // State
  const [tripDetails, setTripDetails] = useState({
    location: null as string | null,
    date: "",
    guests: 1,
  });
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  // Refs
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: boatData, isLoading } = useGetSingleBoatQuery(boatId);
  const boatInfo = boatData?.data;

  // Helper functions
  const formatDisplayDate = useCallback((dateString: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, []);

  const loadInitialSearchData = useCallback(() => {
    try {
      const searchDataStr = localStorage.getItem("searchData");

      if (searchDataStr) {
        const searchData: SearchData = JSON.parse(searchDataStr);
        setTripDetails({
          location: searchData.location || null,
          date: searchData.date || searchData.startDate || "",
          guests: searchData.guests ? Number(searchData.guests) : 1,
        });
      } else {
        // Fallback to legacy storage
        setTripDetails({
          location: localStorage.getItem("location"),
          date: localStorage.getItem("StartDate") || "",
          guests: Number(localStorage.getItem("Guests")) || 1,
        });
      }
    } catch (error) {
      console.error("Error loading search data:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    loadInitialSearchData();
  }, [loadInitialSearchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGuestOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized values
  const tripSummaryText = useMemo(() => {
    const { location, date, guests } = tripDetails;
    const formattedDate = formatDisplayDate(date);

    return [location, formattedDate, `${guests} people`]
      .filter(Boolean)
      .join(" / ");
  }, [tripDetails, formatDisplayDate]);

  const captainName = useMemo(
    () => boatInfo?.captain?.firstName || "Unknown",
    [boatInfo],
  );

  const meetingLocation = useMemo(
    () => boatInfo?.meetingPoint?.[0]?.city || "Location not specified",
    [boatInfo],
  );

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
          />

          <div className="my-4 ">
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
        tripSummary={tripSummaryText}
        trips={boatInfo?.trips}
        boatId={boatId}
        boatImage={boatInfo?.photos?.[0]?.url}
        tripDetails={tripDetails}
      />
    </Container>
  );
}

// Sub-components
const BoatOverview: React.FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => (
  <div>
    <h1 className="text-xl md:text-3xl text-[#242424] font-bold">
      {title || "Boat Details"}
    </h1>
    <p className="text-base text-[#878787] font-normal mt-3">
      {description || "No description available"}
    </p>
  </div>
);

const CaptainSection: React.FC<{ captainName: string; location: string }> = ({
  captainName,
  location,
}) => (
  <div className="w-full border-y border-[#D9D9D9] mt-4 py-4">
    <div className="flex flex-row items-center justify-between gap-4 ">
      {/* Left Side: Image + Info */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <Image
          src={image}
          alt="captain"
          height={64}
          width={64}
          className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <h4 className="text-sm md:text-base font-bold text-[#242424] truncate">
            Captain{" "}
            <span className="font-normal text-[#878787]">{captainName}</span>
          </h4>
          <span className="text-[#9E9E9E] flex items-center gap-1 text-xs md:text-sm truncate">
            <IoLocationOutline className="text-[#FF9500] w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        </div>
      </div>

      {/* Right Side: Action (Required for justify-between alignment) */}
      <div className="flex-shrink-0">
        <button className="text-[#FF9500] hover:bg-[#FF9500]/10 p-2 rounded-full transition-colors">
          <IoChevronForward className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  </div>
);

const TripSelectionSection: React.FC<{
  tripSummary: string;
  trips?: BoatTrip[];
  boatId: string;
  boatImage?: string;
  tripDetails: { location: string | null; date: string; guests: number };
}> = ({ tripSummary, trips = [], boatId, boatImage, tripDetails }) => {
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-10 md:mt-10 px-2 lg:px-0 border-t border-[#665151]">
      <div className="mt-5 md:mt-10 ">
        <h1 className="text-xl md:text-3xl text-[#242424] font-bold leading-7">
          Select Your Trip
        </h1>

        {/* Trip Summary with Icons */}
        <div className="flex flex-wrap items-center gap-4 my-4">
          {tripDetails.location && (
            <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
              <IoLocationOutline className="text-[#FF9500] h-5 w-5" />
              <span>{tripDetails.location}</span>
            </div>
          )}

          {tripDetails.date && (
            <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
              <IoCalendarOutline className="text-[#FF9500] h-5 w-5" />
              <span>{formatDisplayDate(tripDetails.date)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:text-sm md:text-lg text-gray-500 font-bold">
            <IoPeopleOutline className="text-[#FF9500] h-5 w-5" />
            <span>{tripDetails.guests} people</span>
          </div>
        </div>

        <div className="">
          {trips.map((trip: any) => (
            <PricingCard
              key={trip.id}
              tripInfo={trip}
              boatId={boatId}
              image={boatImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
