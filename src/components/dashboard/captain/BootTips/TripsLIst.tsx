"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetMyBoatQuery } from "@/redux/api/boatApi";
import TripCard from "./TripsCard";

export default function TripsList() {
  const { data, isLoading } = useGetMyBoatQuery({});
  const boat = data?.data[0];
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const trips = useMemo(() => boat?.trips ?? [], [boat]);
  const totalTrips = trips.length;
  const totalPages = Math.max(1, Math.ceil(totalTrips / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [totalTrips]);

  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return trips.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, trips]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const shouldShowPagination = totalTrips > ITEMS_PER_PAGE;

  return (
    <section className="w-full mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Trips</h1>
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-white md:h-[260px] h-[460px] rounded-xl border p-4 gap-4 animate-pulse"
            >
              <div className="w-full h-[239px] bg-gray-200 rounded-lg"></div>
              <div className="w-full flex flex-col justify-center space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          ))
        ) : paginatedTrips.length ? (
          <>
            {paginatedTrips.map((trip: any) => (
              <TripCard
                key={trip.id}
                trip={trip}
                image={boat?.photos?.[0]?.url}
                guest={boat.guests}
                location={boat?.meetingPoint?.[0]?.city}
              />
            ))}

            {/* Pagination controls at the bottom */}
            {shouldShowPagination && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No trips found.</p>
        )}
      </div>
    </section>
  );
}
