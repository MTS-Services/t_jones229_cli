"use client";

import SearchTab from "@/components/Private-charterTab/searchPageTab";
import TabListUI from "@/components/Private-charterTab/TabListUI";
import TabContent from "@/components/Private-charterTab/TabContent";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { Pagination } from "@/components/dashboard/admin/button/Pagination";
import InteractiveMap from "@/components/List-boat-form/GoogleMap";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [city, setCity] = useState<string | null>(null);
  const [guests, setGuests] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [initialParams, setInitialParams] = useState<Record<
    string,
    string
  > | null>(null);

  useEffect(() => {
    const location = localStorage.getItem("location");
    const guestsValue = localStorage.getItem("Guests");
    const dateValue = localStorage.getItem("date");
    const startDateValue = localStorage.getItem("StartDate");
    const bookingType = localStorage.getItem("bookingType");

    setCity(location);
    setGuests(guestsValue);
    setDate(dateValue);

    const params: Record<string, string> = {};
    if (location) params.city = location;
    if (startDateValue) params.startDate = startDateValue;
    if (dateValue) params.endDate = dateValue;
    if (bookingType && bookingType !== "undefined" && bookingType !== "null") {
      params.sharedBooking = bookingType;
    }
    const guestsNum = guestsValue ? Number(guestsValue) : 0;
    if (guestsNum > 0) params.guests = guestsNum.toString();

    setInitialParams(params);
  }, []);

  const buildQueryParams = useCallback(
    (page: number): Record<string, string> => {
      const params: Record<string, string> = {};
      const location = localStorage.getItem("location");
      const startDate = localStorage.getItem("StartDate");
      const endDate = localStorage.getItem("date");
      const bookingType = localStorage.getItem("bookingType");
      const guestsValue = localStorage.getItem("Guests");

      if (location) params.city = location;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (
        bookingType &&
        bookingType !== "undefined" &&
        bookingType !== "null"
      ) {
        params.sharedBooking = bookingType;
      }
      const guestsNum = guestsValue ? Number(guestsValue) : 0;
      if (guestsNum > 0) params.guests = guestsNum.toString();

      if (activeKey === "2") params.h_t_l = "true";
      if (activeKey === "3") params.l_t_h = "true";

      params.page = page.toString();
      params.limit = "10";

      return params;
    },
    [activeKey],
  );

  useEffect(() => {
    setQueryParams(buildQueryParams(currentPage));
  }, [currentPage, buildQueryParams]);

  const { data: countData } = useGetAllBoatQuery(initialParams || {}, {
    skip: initialParams === null,
  });

  const { data: listingData, isLoading } = useGetAllBoatQuery(queryParams);

  const currentItems = listingData?.data?.data || [];
  const totalPages = listingData?.data?.meta?.totalPage || 1;

  const handleTabChange = (newKey: string) => {
    setActiveKey(newKey);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header Section */}
      <div className="bg-white sticky top-20 z-30 pb-4 px-3 lg:px-3 mb-[66px]">
        <div className="pt-[25px] container mx-auto">
          <div className="px-5 md:px-0">
            <h1 className="text-lg md:text-xl font-semibold text-[#242424] leading-9">
              {countData?.data?.meta?.total ?? 0} Charters available
            </h1>

            <h1 className="text-sm md:text-base font-normal text-[#474747] leading-7 mt-1">
              {city ? city : ""} {city ? "/" : ""} {date} {date ? "/" : ""}{" "}
              {guests} people
            </h1>
          </div>
          <TabListUI activeKey={activeKey} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow py-4 px-3 lg:px-3">
        <div className="container mx-auto">
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* Left side - Boat listings */}
            <div className="w-full xl:w-[60%] 2xl:w-[65%]">
              <TabContent
                activeKey={activeKey}
                currentItems={currentItems}
                isLoading={isLoading}
              />

              {/* Pagination stays under the listings */}
              {totalPages > 1 && (
                <div className="mt-8 mb-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>

            {/* Right side - Sticky Full Height Map */}
            <div className="hidden xl:block xl:w-[40%] 2xl:w-[35%] sticky top-[240px]">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-[calc(98vh-240px)]">
                <div className="h-full w-full">
                  <InteractiveMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
