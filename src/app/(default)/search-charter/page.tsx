"use client";

import TabListUI from "@/components/Private-charterTab/TabListUI";
import TabContent from "@/components/Private-charterTab/TabContent";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { Pagination } from "@/components/dashboard/admin/button/Pagination";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const SearchResultsMap = dynamic(
  () => import("@/components/search-charter/SearchResultsMap"),
  { ssr: false, loading: () => null },
);

export default function Page() {
  const searchParams = useSearchParams();
  const [activeKey, setActiveKey] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [isDesktop, setIsDesktop] = useState(false);

  // Read from localStorage searchData, fall back to URL params
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(0);
  const [date, setDate] = useState("");
  const [bookingType, setBookingType] = useState("");

  const normalizeBookingType = (val: unknown): string => {
    if (val === true || val === "true") return "true";
    if (val === false || val === "false") return "false";
    return "";
  };

  // Only show map on xl+ screens (≥1280px) to prevent Leaflet crashes on mobile
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1280);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("searchData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setLocation(parsed?.location || searchParams.get("location") || "");
        setGuests(
          Number(parsed?.guests) || Number(searchParams.get("guests")) || 0,
        );
        setDate(parsed?.date || searchParams.get("date") || "");
        setBookingType(
          normalizeBookingType(
            parsed?.bookingType ?? searchParams.get("bookingType"),
          ),
        );
        return;
      }
    } catch {
      // ignore parse errors
    }
    // fallback to URL params
    setLocation(searchParams.get("location") || "");
    setGuests(Number(searchParams.get("guests")) || 0);
    setDate(searchParams.get("date") || "");
    setBookingType(normalizeBookingType(searchParams.get("bookingType")));
  }, [searchParams]);

  // Helper function to format date
  const formatDisplayDate = useCallback((dateString: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, []);

  const buildQueryParams = useCallback(
    (page: number): Record<string, string> => {
      const params: Record<string, string> = {};

      if (location) params.city = location;
      if (date) params.startDate = date;
      if (guests > 0) params.guests = guests.toString();
      if (bookingType === "true" || bookingType === "false") {
        params.sharedBooking = bookingType;
      }

      if (activeKey === "2") params.h_t_l = "true";
      if (activeKey === "3") params.l_t_h = "true";

      params.page = page.toString();
      params.limit = "10";

      return params;
    },
    [activeKey, location, date, guests, bookingType],
  );

  useEffect(() => {
    setQueryParams(buildQueryParams(currentPage));
  }, [currentPage, buildQueryParams]);

  // Initial query for count (without pagination parameters)
  const initialParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (location) params.city = location;
    if (date) params.startDate = date;
    if (guests > 0) params.guests = guests.toString();
    if (bookingType === "true" || bookingType === "false") {
      params.sharedBooking = bookingType;
    }
    return params;
  }, [location, date, guests, bookingType]);

  const canSearch = !!date;

  const { data: countData } = useGetAllBoatQuery(initialParams(), {
    skip: !canSearch,
  });
  const { data: listingData, isLoading } = useGetAllBoatQuery(queryParams, {
    skip: !canSearch,
  });

  const currentItems = listingData?.data?.data || [];
  const totalPages = listingData?.data?.meta?.totalPage || 1;

  const handleTabChange = (newKey: string) => {
    setActiveKey(newKey);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header Section */}
      <div className="mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <h1 className="text-lg md:text-2xl font-semibold text-[#242424]">
              {!canSearch
                ? "Select a date to search available charters"
                : `${countData?.data?.meta?.total ?? 0} Charters available`}
            </h1>

            {/* Search Criteria with Icons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {location && (
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
                  <IoLocationOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{location}</span>
                </div>
              )}

              {date && (
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
                  <IoCalendarOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
                  <span>{formatDisplayDate(date)}</span>
                </div>
              )}

              {guests > 0 && (
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
                  <IoPeopleOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
                  <span>
                    {guests} {guests === 1 ? "person" : "people"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-4">
            <TabListUI activeKey={activeKey} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left side - Boat listings */}
            <div className="w-full xl:w-[60%] 2xl:w-[65%]">
              {!canSearch ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                  <p className="font-medium">Date required for search</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Pick a trip date on the home page to see boats with open
                    time slots. Fully booked boats are hidden for that day.
                  </p>
                </div>
              ) : (
                <TabContent
                  activeKey={activeKey}
                  currentItems={currentItems}
                  isLoading={isLoading}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>

            {/* Right side - Sticky Map (desktop only — never rendered on mobile to prevent Leaflet crashes) */}
            {isDesktop && (
              <div className="hidden xl:block xl:w-[40%] 2xl:w-[35%]">
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-[calc(40vh-280px)] max-h-[700px] min-h-[500px]">
                    <SearchResultsMap location={location} boats={currentItems} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
