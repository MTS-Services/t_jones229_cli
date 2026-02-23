"use client";

import Link from "next/link";
import { useState } from "react";
import CancelTripsModal from "../../modal/CancelTripModal";
import { Pagination } from "../button/Pagination"; // If you want to use this, keep it, otherwise remove
import StatusButton from "../button/StatusButton";
import PaginationButton from "../userManagment/PaginationButton";

interface TripProps {
  data: any[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  loading: boolean;
  onPageChange: (page: number) => void;
  totalPages: number;
  currentPage: number;
}

export default function Trips({
  data,
  meta,
  loading,
  onPageChange,
  totalPages,
  currentPage,
}: TripProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const closeModal = () => setIsModalOpen(false);

  const getStatusButtonProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "upcomming":
        return { color: "#42DF3A", className: "text-white" }; // Fixed double ##
      case "pending":
        return { color: "#FDA831", className: "text-white" };
      case "cancel":
        return { color: "#FF0000", className: "text-white" };
      default:
        return { color: "#8C8C8C", className: "text-white" };
    }
  };

  return (
    <div className="">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">All trips</h1>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <>
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Trip Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Captain
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((booking) => {
                  const statusProps = getStatusButtonProps(booking.status);
                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/trips-managment/${booking?.id}`}
                          className="cursor-pointer"
                        >
                          {booking.trip?.tripName || "N/A"}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {booking.tripDate?.split("T")[0]}
                      </td>
                      <td className="px-6 py-4">
                        {booking.boat?.captain?.email}
                      </td>
                      <td className="px-6 py-4">{booking.bookingType}</td>
                      <td className="px-6 py-4">
                        {booking.boat?.description?.[0]?.listingTypeTitle}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          onClick={() => {
                            setIsModalOpen(true);
                            setBookingId(booking.id);
                          }}
                        >
                          <StatusButton
                            color={statusProps.color}
                            className={statusProps.className}
                          >
                            {booking.status}
                          </StatusButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Main Pagination UI */}
            <div className="flex items-center justify-center py-4 border-t border-gray-100 bg-white">
              <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>

            <CancelTripsModal
              isOpen={isModalOpen}
              id={bookingId as string}
              onClose={closeModal}
            />
          </>
        )}
      </div>
    </div>
  );
}
