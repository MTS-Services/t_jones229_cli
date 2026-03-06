"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomerDetailsModal from "./CustomerDetailsModal";
import PaginationButton from "./PaginationButton";
import TableLoading from "../../common/TableLoading";
import {
  User,
  Mail,
  Phone,
  Ship,
  ChevronLeft,
  ChevronRight,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Star,
  Calendar,
  MapPin,
  Award,
  Menu,
  LayoutGrid,
  Circle,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";

function MobileUsersView({ users, itemsPerPage = 5, onView, viewMode }: any) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil((users?.length || 0) / itemsPerPage),
  );

  const start = (page - 1) * itemsPerPage;
  const pageUsers = (users || []).slice(start, start + itemsPerPage);

  const prev = () => setPage((p: number) => Math.max(1, p - 1));
  const next = () => setPage((p: number) => Math.min(totalPages, p + 1));

  const getUserStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case "INACTIVE":
        return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  if (!users || users.length === 0) return null;

  return (
    <div className="block md:hidden py-6 px-4">
      <div className="space-y-4">
        {pageUsers.map((u: any) => (
          <div
            key={u.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {u.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{u.fullName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {getUserStatusIcon(u.userStatus)}
                    <span className="text-xs text-gray-500">
                      {u.userStatus || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onView(u)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${u.email}`}
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {u.email || "No Email"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-700">
                    {u.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Ship className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Total Trips</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {u.totalTrips ?? 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      trip{u.totalTrips !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => onView(u)}
                className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-medium text-blue-600 transition-colors flex items-center justify-center gap-1">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={prev}
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
            onClick={next}
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

export default function CustomerManagement({
  data = [],
  isLoading,
  meta,
}: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<string>("none");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const itemsPerPage = meta?.limit || 10;

  const users = data?.user || [];
  const totalPages = meta?.totalPage || Math.ceil(users.length / itemsPerPage);
  const totalItems = meta?.total || users.length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setWaitlistStatus(customer?.waitlistStatus || "none");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setWaitlistStatus("none");
  };

  const handleWaitlistToggle = () => {
    if (waitlistStatus === "none" || waitlistStatus === "pending") {
      setWaitlistStatus("active");
      console.log("User added to active waitlist:", selectedCustomer);
    } else {
      setWaitlistStatus("pending");
      console.log("User moved to pending waitlist:", selectedCustomer);
    }
  };

  const getUserStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "INACTIVE":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";
      case "INACTIVE":
        return "bg-red-50 text-red-700 border-red-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getWaitlistIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "pending":
        return <UserPlus className="h-4 w-4 text-amber-500" />;
      default:
        return <UserX className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <TableLoading
        variant="skeleton"
        rows={10}
        columns={6}
        message="Loading customers..."
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Customer Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {totalItems} customer{totalItems !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>

            {/* View Toggle with Icons */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
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
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden">
          {/* Desktop Table View */}
          {viewMode === "list" && (
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <User className="h-3.5 w-3.5" />
                        Customer
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Phone className="h-3.5 w-3.5" />
                        Phone
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Ship className="h-3.5 w-3.5" />
                        Total Trips
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Award className="h-3.5 w-3.5" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Waitlist
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <div className="text-xs font-semibold text-gray-500">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No customers found
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            There are no customers to display at the moment.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((customer: any) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-white font-semibold">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {customer?.fullName || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">
                                ID: #{customer.id?.slice(-6) || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${customer.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px]">
                              {customer.email || "No Email"}
                            </span>
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {customer.phoneNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {customer.totalTrips ?? 0}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            trip{customer.totalTrips !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getUserStatusBadge(
                              customer.userStatus,
                            )}`}
                          >
                            {getUserStatusIcon(customer.userStatus)}
                            {customer.userStatus || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                              customer.waitlistStatus === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : customer.waitlistStatus === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {getWaitlistIcon(customer.waitlistStatus)}
                            {customer.waitlistStatus || "none"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUsers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No customers found
                  </p>
                </div>
              ) : (
                currentUsers.map((customer: any) => (
                  <div
                    key={customer.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {customer?.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {customer?.fullName || "Unknown"}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {getUserStatusIcon(customer.userStatus)}
                            <span className="text-xs text-gray-500">
                              {customer.userStatus || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-50 rounded-lg"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-blue-600 hover:underline truncate"
                        >
                          {customer.email || "No Email"}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {customer.phoneNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Ship className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{customer.totalTrips ?? 0} trips</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        {getWaitlistIcon(customer.waitlistStatus)}
                        <span className="text-xs">
                          Waitlist: {customer.waitlistStatus || "none"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-medium text-blue-600 transition-colors flex items-center justify-center gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Mobile View */}
          <MobileUsersView
            users={users}
            itemsPerPage={5}
            onView={handleViewDetails}
            viewMode={viewMode}
          />

          {/* Pagination */}
          {users.length > itemsPerPage && (
            <div className="hidden md:block bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(indexOfLastItem, users.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {totalItems}
                  </span>{" "}
                  customers
                </div>
                <PaginationButton
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomerDetailsModal
        isOpen={showModal}
        customer={selectedCustomer}
        waitlistStatus={waitlistStatus}
        onClose={handleCloseModal}
        onToggleWaitlist={handleWaitlistToggle}
      />
    </>
  );
}
