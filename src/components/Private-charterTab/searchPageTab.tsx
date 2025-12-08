import type { TabsProps } from "antd";
import { ConfigProvider, Tabs } from "antd";
import Recommended from "./Recommended";
import PriceHighest from "./PriceHighest";
import PriceLowest from "./PriceLowest";
import { useGetAllBoatQuery } from "@/redux/api/boatApi";
import { Pagination } from "../dashboard/admin/button/Pagination";
import { useEffect, useState } from "react";

const SearchTab = () => {
  const [key, setKey] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});

  const buildQueryParams = (page: number): Record<string, string> => {
    const city = localStorage.getItem("location");
    const startDate = localStorage.getItem("StartDate");
    const endDate = localStorage.getItem("date");
    const bookingType = localStorage.getItem("bookingType");
    const guests = localStorage.getItem("Guests");

    const params: Record<string, string> = {};

    if (city) params.city = city;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    // if (bookingType) params.sharedBooking = bookingType;
    if (bookingType && bookingType !== "undefined" && bookingType !== "null") {
      params.sharedBooking = bookingType;
    }
    // if (bookingType) params.sharedBooking = bookingType;
    // if (guests) params.guests = guests;
    const guestsNum = guests ? Number(guests) : 0;
    if (guestsNum > 0) params.guests = guestsNum.toString();

    // h_t_l=true
    // l_t_h=true
    // params.h_t_l = "true";
    if (key === "2") params.h_t_l = "true";
    if (key === "3") params.l_t_h = "true";

    params.page = page.toString();
    params.limit = "10";

    return params;
  };

  useEffect(() => {
    setQueryParams(buildQueryParams(currentPage));
  }, [currentPage, key]);

  const { data, isLoading, refetch } = useGetAllBoatQuery(queryParams);

  const currentItems = data?.data?.data || [];

  const totalPages = data?.data?.meta?.totalPage || 1;

  const onChange = (key: string) => {
    setKey(key);
    setCurrentPage(1);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All",
      children: (
        <Recommended currentItems={currentItems} isLoading={isLoading} />
      ),
    },
    {
      key: "2",
      label: "Price (Highest)",
      children: (
        <PriceHighest currentItems={currentItems} isLoading={isLoading} />
      ),
    },
    {
      key: "3",
      label: "Price (Lowest)",
      children: (
        <PriceLowest currentItems={currentItems} isLoading={isLoading} />
      ),
    },
  ];

  return (
    <div className="">
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemHoverColor: "#242424",
              colorPrimary: "#3D53F5",
              colorText: "#242424",
              itemColor: "#878787",
              itemSelectedColor: "#242424",
              fontSize: 16,
            },
          },
        }}
      >
        <section className="pt-[28px]  px2 md:px-5">
          <div className="container">
            <div className="p-4">
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
          </div>
        </section>
      </ConfigProvider>
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
