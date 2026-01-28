"use client";

import Link from "next/link";
import StatusButton from "../button/StatusButton";
import PaginationButton from "../userManagment/PaginationButton";

interface BookingProps {
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

export default function BookingsTable({
  data,
  meta,
  loading,
  onPageChange,
  totalPages,
  currentPage,
}: BookingProps) {
  const getStatusButtonProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { color: "#42DF3A", className: "text-white" };
      case "pending":
        return { color: "#FDA831", className: "text-white" };
      case "cancelled":
      case "cancel":
        return { color: "#FF0000", className: "text-white" };
      case "completed":
        return { color: "#4CAF50", className: "text-white" };
      default:
        return { color: "#8C8C8C", className: "text-white" };
    }
  };

  const getPaymentStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { color: "#42DF3A", className: "text-white" };
      case "unpaid":
        return { color: "#FDA831", className: "text-white" };
      case "partial":
        return { color: "#2196F3", className: "text-white" };
      default:
        return { color: "#8C8C8C", className: "text-white" };
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">All Bookings</h1>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">No bookings found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Trip Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Captain
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Group Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((booking) => {
                    const statusProps = getStatusButtonProps(booking.status);
                    const paymentProps = getPaymentStatusProps(
                      booking.paymentStatus
                    );
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/booking-managment/${booking?.id}`}
                            className="cursor-pointer text-blue-600 hover:underline"
                          >
                            {booking.trip?.tripName || "N/A"}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">
                              {booking.user?.firstName} {booking.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">
                              {booking.boat?.captain?.firstName}{" "}
                              {booking.boat?.captain?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.boat?.captain?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {booking.tripDate
                            ? new Date(booking.tripDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {booking.bookingType}
                          </span>
                        </td>
                        <td className="px-6 py-4">{booking.groupSize || 1}</td>
                        <td className="px-6 py-4">
                          <StatusButton
                            color={paymentProps.color}
                            className={paymentProps.className}
                          >
                            {booking.paymentStatus}
                          </StatusButton>
                          <div className="text-xs text-gray-500 mt-1">
                            ${booking.payFirst + booking.payDue}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusButton
                            color={statusProps.color}
                            className={statusProps.className}
                          >
                            {booking.status}
                          </StatusButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center py-4 border-t border-gray-100 bg-white">
              <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
