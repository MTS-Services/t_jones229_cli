"use client";
import { useState, useCallback } from "react";
import TitleSection from "../../captain/TiltleSection";
import SearchBookings from "./SearchBookings";
import BookingsTable from "./BookingsTable";
import { useAllBookingQuery } from "@/redux/api/userDashboardApi/userBooking";

export default function BookingManagement() {
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    status: "",
    searchTerm: "",
    date: "",
    city: "",
  });

  // RTK Query automatically refetches when filters change
  const { data, isLoading, isFetching } = useAllBookingQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  // Pagination handler - preserves existing filters
  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const totalPages = data?.meta?.totalPage || 1;
  const currentPage = filters.page;

  return (
    <div>
      <TitleSection />
      <SearchBookings filters={filters} setFilters={setFilters} />
      <BookingsTable
        data={data?.data || []}
        meta={data?.meta}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
