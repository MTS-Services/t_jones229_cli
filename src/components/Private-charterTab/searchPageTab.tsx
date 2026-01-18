// components/Private-charterTab/searchPageTab.tsx
import { useCallback, useEffect, useState } from "react";
import InteractiveMap from "../List-boat-form/GoogleMap";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { Pagination } from "../dashboard/admin/button/Pagination";
import TabListUI from "./TabListUI";
import TabContent from "./TabContent";

interface SearchTabProps {
  activeKey?: string;
  onTabChange?: (key: string) => void;
}

const SearchTab = ({ activeKey = "1", onTabChange }: SearchTabProps) => {
  const [key, setKey] = useState<string>(activeKey);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  // Sync with prop if needed
  useEffect(() => {
    setKey(activeKey);
  }, [activeKey]);

  const buildQueryParams = useCallback(
    (page: number): Record<string, string> => {
      // Safe localStorage access for SSR
      const city =
        typeof window !== "undefined" ? localStorage.getItem("location") : null;
      const startDate =
        typeof window !== "undefined"
          ? localStorage.getItem("StartDate")
          : null;
      const endDate =
        typeof window !== "undefined" ? localStorage.getItem("date") : null;
      const bookingType =
        typeof window !== "undefined"
          ? localStorage.getItem("bookingType")
          : null;
      const guests =
        typeof window !== "undefined" ? localStorage.getItem("Guests") : null;

      const params: Record<string, string> = {};

      if (city) params.city = city;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (
        bookingType &&
        bookingType !== "undefined" &&
        bookingType !== "null"
      ) {
        params.sharedBooking = bookingType;
      }
      const guestsNum = guests ? Number(guests) : 0;
      if (guestsNum > 0) params.guests = guestsNum.toString();

      if (key === "2") params.h_t_l = "true";
      if (key === "3") params.l_t_h = "true";

      params.page = page.toString();
      params.limit = "10";

      return params;
    },
    [key],
  );

  useEffect(() => {
    setQueryParams(buildQueryParams(currentPage));
  }, [currentPage, buildQueryParams, key]); // key ডিপেন্ডেন্সি যোগ করুন

  const { data, isLoading } = useGetAllBoatQuery(queryParams);

  const currentItems = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPage || 1;

  const handleTabChangeInternal = (newKey: string) => {
    setKey(newKey);
    setCurrentPage(1);
    // Call parent handler if provided
    if (onTabChange) {
      onTabChange(newKey);
    }
  };

  return (
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left side - Boat listings */}
          <div className="w-full xl:w-[60%] 2xl:w-[65%]">
            {/* TabListUI যোগ করুন */}

            {/* TabContent */}
            <TabContent
              activeKey={key}
              currentItems={currentItems}
              isLoading={isLoading}
            />
          </div>

          {/* Right side - Map */}
          <div className="block xl:w-[40%] 2xl:w-[35%] xl:mt-16">
            <div className="sticky top-28 pb-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-0">
                  <InteractiveMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="container mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default SearchTab;
