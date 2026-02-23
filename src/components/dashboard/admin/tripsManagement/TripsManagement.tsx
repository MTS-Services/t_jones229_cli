"use client";
import { useState } from "react";
import TitleSection from "../../captain/TiltleSection";
import SearchTrips from "./SearchTrips";
import Trips from "./Trips";
import { useAllBookingQuery } from "@/redux/api/userDashboardApi/userBooking";
import PaginationButton from "../userManagment/PaginationButton";

export default function TripsManagement() {
  const [filters, setFilters] = useState({
    limit: 7,
    page: 1,
    date: "",
    city: "",
    status: "",
    searchTerm: "",
  });

  const { data, isLoading } = useAllBookingQuery(filters);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const totalPages = data?.data?.meta?.totalPage || 1;
  const currentPage = filters.page;

  return (
    <div className="space-y-6">
      <SearchTrips filters={filters} setFilters={setFilters} />
      <Trips
        data={data?.data?.data || []}
        meta={data?.data?.meta}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
