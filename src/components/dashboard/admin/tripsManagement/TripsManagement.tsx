"use client";
import { useState } from "react";
import TitleSection from "../../captain/TiltleSection";
import SearchTrips from "./SearchTrips";
import Trips from "./Trips";
import { useAllBookingQuery } from "@/redux/api/userDashboardApi/userBooking";

export default function TripsManagement() {
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    date: "",
    city: "",
    status: "",
    searchTerm: "",
  });


  const { data, isLoading } = useAllBookingQuery(filters);
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <TitleSection />
      <SearchTrips filters={filters} setFilters={setFilters} />
      <Trips
        data={data?.data?.data || []}
        meta={data?.data?.meta}
        pages={filters.page}
        loading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
