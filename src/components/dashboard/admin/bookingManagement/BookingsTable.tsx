"use client";

import Link from "next/link";
import StatusButton from "../button/StatusButton";
import PaginationButton from "../userManagment/PaginationButton";
import TableLoading from "../../common/TableLoading";
import {
  Filter,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Search,
  X,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useState, useMemo } from "react";

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
  filters: {
    limit: number;
    page: number;
    status: string;
    searchTerm: string;
    date: string;
    city: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      limit: number;
      page: number;
      status: string;
      searchTerm: string;
      date: string;
      city: string;
    }>
  >;
}

export default function BookingsTable({
  data,
  meta,
  loading,
  onPageChange,
  totalPages,
  currentPage,
  filters,
  setFilters,
}: BookingProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchInput,
      page: 1,
    }));
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilters((prev) => ({
      ...prev,
      searchTerm: "",
      page: 1,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusButtonProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "complete":
        return {
          color: "#10B981",
          className: "text-white",
          bg: "bg-emerald-100",
        };
      case "pending":
      case "upcoming":
        return {
          color: "#F59E0B",
          className: "text-white",
          bg: "bg-amber-100",
        };
      case "cancelled":
      case "cancel":
        return { color: "#EF4444", className: "text-white", bg: "bg-red-100" };
      default:
        return { color: "#6B7280", className: "text-white", bg: "bg-gray-100" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "complete":
        return "Complete";
      case "pending":
        return "Pending";
      case "upcoming":
        return "Upcoming";
      case "cancelled":
      case "cancel":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  //  {booking.bookingType || "Standard"}
  const getBookingTypeProps = (type: string) => {
    switch (type?.toLowerCase()) {
      case "standard":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
          ),
        };
      case "private":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
              <path d="M4 0L8 4L4 8L0 4Z" />
            </svg>
          ),
        };
      case "group":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
              <path d="M1 1H7V7H1z" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: null,
        };
    }
  };

  const getPaymentStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          color: "#10B981",
          className: "text-white",
          bg: "bg-emerald-100",
        };
      case "unpaid":
        return {
          color: "#F59E0B",
          className: "text-white",
          bg: "bg-amber-100",
        };
      case "partial":
        return { color: "#3B82F6", className: "text-white", bg: "bg-blue-100" };
      default:
        return { color: "#6B7280", className: "text-white", bg: "bg-gray-100" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .slice(0, -3); // Remove the last three characters (cents) for cleaner display
  };

  const stats = useMemo(() => {
    if (!data.length)
      return { totalRevenue: 0, avgGroupSize: 0, completionRate: 0 };

    const totalRevenue = data.reduce(
      (sum, booking) => sum + (booking.payFirst + booking.payDue),
      0,
    );
    const avgGroupSize =
      data.reduce((sum, booking) => sum + (booking.groupSize || 1), 0) /
      data.length;
    const completedCount = data.filter(
      (b) =>
        b.status?.toLowerCase() === "complete" ||
        b.status?.toLowerCase() === "confirmed",
    ).length;
    const completionRate = (completedCount / data.length) * 100;

    return { totalRevenue, avgGroupSize, completionRate };
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Title and Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Booking Management
              </h1>
              <p className="text-sm text-gray-500">
                View and manage all customer bookings
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by customer, trip, or captain..."
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 border rounded-lg transition-colors ${
                showFilters || filters.status
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: "", page: 1 }));
                  setShowFilters(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETE">Complete</option>
                <option value="CANCEL">Cancel</option>
              </select>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">
                    Total Bookings
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {meta?.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-medium">
                    Total Revenue
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-medium">
                    Avg. Group Size
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.avgGroupSize.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium">
                    Completion Rate
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.completionRate.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <TableLoading message="Loading bookings..." />}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">
            No bookings found
          </p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Try adjusting your search or filters
          </p>
          {(filters.status ||
            filters.searchTerm ||
            filters.date ||
            filters.city) && (
            <button
              onClick={() => {
                setFilters({
                  limit: 10,
                  page: 1,
                  status: "",
                  searchTerm: "",
                  date: "",
                  city: "",
                });
                setSearchInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && data.length > 0 && (
        <>
          <div className="overflow-x-auto border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trip Details
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Captain
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Date
                    </div>
                  </th>
                  <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-3.5 h-3.5" />
                      Group
                    </div>
                  </th>
                  <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1 justify-center">
                      <DollarSign className="w-3.5 h-3.5" />
                      Payment
                    </div>
                  </th>
                  <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((booking, index) => {
                  const paymentProps = getPaymentStatusProps(
                    booking.paymentStatus,
                  );

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-blue-50/50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-2">
                        <Link
                          href={`/dashboard/booking-managment/${booking?.id}`}
                          className="font-medium text-sm  text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span className="truncate max-w-[100px]">
                            {booking.trip?.tripName || "Untitled Trip"}{" "}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                        {booking.boat?.name && (
                          <div className="text-xs text-gray-500 mt-1">
                            Boat: {booking.boat.name}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                            <User className="h-4 w-4 text-gray-100" />
                          </div>
                          <div>
                            <div className="font-medium text-sm truncate text-gray-900">
                              {booking.user?.firstName} {booking.user?.lastName}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span className="">{booking.user?.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 max-w-[120px] truncate">
                              {booking.boat?.captain?.firstName}{" "}
                              {booking.boat?.captain?.lastName}
                            </div>
                            {booking.boat?.captain?.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span>{booking.boat.captain.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(booking.tripDate)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        {(() => {
                          const props = getBookingTypeProps(
                            booking.bookingType,
                          );
                          return (
                            <span
                              className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${props.bg} ${props.text} ${props.border}`}
                            >
                              {props.icon}
                              {booking.bookingType || "Standard"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {booking.groupSize || 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.payFirst + booking.payDue)}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            paymentProps.color === "#10B981"
                              ? "bg-green-100 text-green-800"
                              : paymentProps.color === "#F59E0B"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.paymentStatus || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * filters.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * filters.limit, meta?.total || 0)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {meta?.total || 0}
                </span>{" "}
                results
              </div>
              <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
