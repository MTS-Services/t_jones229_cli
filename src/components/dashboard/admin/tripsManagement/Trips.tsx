"use client";

import Link from "next/link";
import { useState } from "react";
import CancelTripsModal from "../../modal/CancelTripModal";
import PaginationButton from "../userManagment/PaginationButton";
import TableLoading from "../../common/TableLoading";
import {
  Ship,
  Calendar,
  User,
  Tag,
  MapPin,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Anchor,
  Eye,
} from "lucide-react";

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
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const openCancelModal = (booking: any) => {
    setSelectedBooking(booking);
    setBookingId(booking.id);
    setIsModalOpen(true);
  };

  const getStatusConfig = (status: string) => {
    const statusMap = {
      confirmed: {
        color: "#10B981",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
        label: "Confirmed",
      },
      upcoming: {
        color: "#42DF3A",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: Clock,
        label: "Upcoming",
      },
      pending: {
        color: "#F59E0B",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "Pending",
      },
      cancelled: {
        color: "#EF4444",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: XCircle,
        label: "Cancelled",
      },
      completed: {
        color: "#3B82F6",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle,
        label: "Completed",
      },
    };
    return (
      statusMap[status?.toLowerCase()] || {
        color: "#6B7280",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: AlertCircle,
        label: status || "Unknown",
      }
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TableLoading message="Loading trips..." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}

        {data.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Anchor className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No trips found
            </h3>
            <p className="text-gray-500">
              There are no trips to display at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Table - Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Ship className="h-3.5 w-3.5" />
                        Trip Name
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5" />
                        Date
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <User className="h-3.5 w-3.5" />
                        Captain
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Tag className="h-3.5 w-3.5" />
                        Type
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5" />
                        Location
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left">
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((booking, index) => {
                    const statusConfig = getStatusConfig(booking.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/trips-managment/${booking?.id}`}
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-800 font-medium hover:underline"
                          >
                            <span className="truncate max-w-[200px]">
                              {booking.trip?.tripName || "N/A"}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {formatDate(booking.tripDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-600">
                              {booking.boat?.captain?.email?.split("@")[0] ||
                                "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            {booking.bookingType || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">
                            {booking.boat?.description?.[0]?.listingTypeTitle ||
                              "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                          <button>
                            <Link
                              href={`/dashboard/trips-managment/${booking?.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Link>
                          </button>
                          <button
                            onClick={() => openCancelModal(booking)}
                            disabled={
                              booking.status?.toLowerCase() === "cancelled"
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3 p-4">
              {data.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={booking.id}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        href={`/dashboard/trips-managment/${booking?.id}`}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        {booking.trip?.tripName || "N/A"}
                      </Link>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(booking.tripDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          {booking.boat?.captain?.email?.split("@")[0] || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span>{booking.bookingType || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {booking.boat?.description?.[0]?.listingTypeTitle ||
                            "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openCancelModal(booking)}
                        disabled={booking.status?.toLowerCase() === "cancelled"}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel Trip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Showing page{" "}
                    <span className="font-medium text-gray-700">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {totalPages}
                    </span>
                  </div>
                  <PaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Modal */}
      <CancelTripsModal
        isOpen={isModalOpen}
        id={bookingId as string}
        onClose={closeModal}
        bookingDetails={selectedBooking}
      />
    </>
  );
}
