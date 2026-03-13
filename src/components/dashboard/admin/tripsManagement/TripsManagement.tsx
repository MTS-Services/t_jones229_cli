"use client";

import { useState } from "react";
import Link from "next/link";
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
  Eye,
  Search,
  Menu,
  LayoutGrid,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useAllBookingQuery } from "@/redux/api/userDashboardApi/userBooking";
import { useUpdateBookingStatusMutation } from "@/redux/api/bookingApi";
import CancelTripsModal from "../../modal/CancelTripModal";
import PaginationButton from "../userManagment/PaginationButton";
import TableLoading from "../../common/TableLoading";
import { toast } from "react-toastify";

/* ── helpers ── */

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, any> = {
    confirmed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Confirmed",
    },
    upcoming: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: Clock,
      label: "Upcoming",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: Clock,
      label: "Pending",
    },
    cancel: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: XCircle,
      label: "Cancelled",
    },
    complete: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: CheckCircle,
      label: "Completed",
    },
  };
  return (
    statusMap[status?.toLowerCase()] || {
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

const formatCurrency = (val: number | undefined) => `$${(val ?? 0).toFixed(2)}`;

/* ── Mobile Card View ── */

function MobileTripsView({
  bookings,
  itemsPerPage = 6,
  onCancel,
  onApprove,
}: {
  bookings: any[];
  itemsPerPage?: number;
  onCancel: (b: any) => void;
  onApprove: (b: any) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil((bookings?.length || 0) / itemsPerPage),
  );
  const start = (page - 1) * itemsPerPage;
  const pageBookings = (bookings || []).slice(start, start + itemsPerPage);

  if (!bookings || bookings.length === 0) return null;

  return (
    <div className="block md:hidden py-6 px-4">
      <div className="space-y-4">
        {pageBookings.map((booking: any, idx: number) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={booking.id || idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                    <Ship className="h-5 w-5" />
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/trips-managment/${booking.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {booking.trip?.tripName || "N/A"}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/trips-managment/${booking.id}`}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Trip Date</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(booking.tripDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Captain</p>
                    <p className="text-sm text-gray-700">
                      {booking.boat?.captain?.firstName &&
                      booking.boat?.captain?.lastName
                        ? `${booking.boat.captain.firstName} ${booking.boat.captain.lastName}`
                        : booking.boat?.captain?.email?.split("@")[0] || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Payment</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(booking.payFirst)}
                      </span>
                      <span className="text-xs text-gray-400">/</span>
                      <span className="text-sm text-orange-600">
                        {formatCurrency(booking.payDue)} due
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <Link
                  href={`/dashboard/trips-managment/${booking.id}`}
                  className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
                {(booking.status === "PENDING" || booking.status === "UPCOMING") && (
                  <button
                    onClick={() => onApprove(booking)}
                    className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-medium text-emerald-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => onCancel(booking)}
                  disabled={booking.status === "CANCEL" || booking.status === "COMPLETE"}
                  className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function TripsManagement() {
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    date: "",
    city: "",
    status: "",
    searchTerm: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { data, isLoading } = useAllBookingQuery(filters);
  const [updateStatus] = useUpdateBookingStatusMutation();

  const bookings: any[] = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const currentPage = filters.page;
  const total = data?.meta?.total || 0;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
    }));
  };

  const openCancelModal = (booking: any) => {
    setBookingId(booking.id);
    setIsModalOpen(true);
  };

  const handleApprove = async (booking: any) => {
    try {
      await updateStatus({ id: booking.id, status: "CONFIRMED" }).unwrap();
      toast.success("Booking approved successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve booking");
    }
  };

  const handleComplete = async (booking: any) => {
    try {
      await updateStatus({ id: booking.id, status: "COMPLETE" }).unwrap();
      toast.success("Booking marked as complete!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to complete booking");
    }
  };

  if (isLoading) {
    return (
      <TableLoading
        variant="skeleton"
        rows={7}
        columns={5}
        message="Loading trips..."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#035292] rounded-xl">
              <Ship className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Trips Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {total} trip{total !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-white text-blue-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-white text-blue-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap lg:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by trip name, customer or captain"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
          </div>

          <div className="relative">
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="appearance-none w-full md:w-[140px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all bg-white"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="appearance-none w-full md:w-[150px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all bg-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETE">Completed</option>
              <option value="CANCEL">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="appearance-none w-full md:w-[140px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all bg-white"
            >
              <option value="">Location</option>
              <option value="Alice">Alice</option>
              <option value="Miami">Miami</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-hidden">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ship className="h-10 w-10 text-gray-400" />
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
            {/* Desktop Table View */}
            {viewMode === "list" && (
              <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#035292]">
                      <th className="px-4 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <Ship className="h-3.5 w-3.5" />
                          Trip Name
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" />
                          Date
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <User className="h-3.5 w-3.5" />
                          Captain
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <Tag className="h-3.5 w-3.5" />
                          Type
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <Users className="h-3.5 w-3.5" />
                          Group
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          <DollarSign className="h-3.5 w-3.5" />
                          Payment
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          Status
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking: any) => {
                      const statusConfig = getStatusConfig(booking.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/dashboard/trips-managment/${booking.id}`}
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
                                {booking.boat?.captain?.firstName &&
                                booking.boat?.captain?.lastName
                                  ? `${booking.boat.captain.firstName} ${booking.boat.captain.lastName}`
                                  : booking.boat?.captain?.email?.split(
                                      "@",
                                    )[0] || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                              {booking.bookingType || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {booking.groupSize ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-semibold text-emerald-600 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/dashboard/trips-managment/${booking.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </Link>
                              {(booking.status === "PENDING" || booking.status === "UPCOMING") && (
                                <button
                                  onClick={() => handleApprove(booking)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Approve
                                </button>
                              )}
                              {(booking.status === "CONFIRMED" || booking.status === "UPCOMING") && (
                                <button
                                  onClick={() => handleComplete(booking)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Complete
                                </button>
                              )}
                              <button
                                onClick={() => openCancelModal(booking)}
                                disabled={
                                  booking.status === "CANCEL" || booking.status === "COMPLETE"
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking: any) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={booking.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
                    >
                      {/* Card Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          <Ship className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/dashboard/trips-managment/${booking.id}`}
                            className="font-semibold text-gray-900 truncate block hover:text-blue-600"
                          >
                            {booking.trip?.tripName || "N/A"}
                          </Link>
                          <span
                            className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{formatDate(booking.tripDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {booking.boat?.captain?.firstName &&
                            booking.boat?.captain?.lastName
                              ? `${booking.boat.captain.firstName} ${booking.boat.captain.lastName}`
                              : booking.boat?.captain?.email?.split("@")[0] ||
                                "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{booking.bookingType || "N/A"}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                          <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-gray-900">
                            {booking.groupSize ?? 0}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Group
                          </p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
                          <DollarSign className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(booking.payFirst)}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Paid
                          </p>
                        </div>
                      </div>

                      {booking.createdAt && (
                        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Booked{" "}
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link
                          href={`/dashboard/trips-managment/${booking.id}`}
                          className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        {(booking.status === "PENDING" || booking.status === "UPCOMING") && (
                          <button
                            onClick={() => handleApprove(booking)}
                            className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-medium text-emerald-600 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={
                            booking.status === "CANCEL" || booking.status === "COMPLETE"
                          }
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mobile View */}
            <MobileTripsView
              bookings={bookings}
              itemsPerPage={6}
              onCancel={openCancelModal}
              onApprove={handleApprove}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="hidden md:block px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Showing page{" "}
                    <span className="font-medium text-gray-700">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {totalPages}
                    </span>{" "}
                    ({total} total trips)
                  </div>
                  <PaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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
        onClose={() => {
          setIsModalOpen(false);
          setBookingId(null);
        }}
      />
    </div>
  );
}
