"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaginationButton from "./PaginationButton";
import TableLoading from "../../common/TableLoading";
import {
  User,
  Mail,
  Phone,
  Ship,
  ChevronLeft,
  ChevronRight,
  Anchor,
  MoreVertical,
  Eye,
  Edit,
  Star,
  Calendar,
  Award,
  Menu,
  LayoutGrid,
} from "lucide-react";

function MobileCaptainsView({
  captains,
  itemsPerPage = 6,
  onViewDetails,
}: any) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil((captains?.length || 0) / itemsPerPage),
  );

  const start = (page - 1) * itemsPerPage;
  const pageCaptains = (captains || []).slice(start, start + itemsPerPage);

  const prev = () => setPage((p: number) => Math.max(1, p - 1));
  const next = () => setPage((p: number) => Math.min(totalPages, p + 1));

  if (!captains || captains.length === 0) return null;

  return (
    <div className="block md:hidden py-6 px-4">
      <div className="space-y-4">
        {pageCaptains.map((captain: any, idx: number) => (
          <div
            key={captain.id || idx}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {captain?.fullName?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {captain?.fullName || "Unknown"}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-500">
                      4.8 (12 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onViewDetails?.(captain)}
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
                    href={`mailto:${captain.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {captain.email || "No Email"}
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
                    {captain.phoneNumber || "N/A"}
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
                      {captain.totalTrips ?? 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      trip{captain.totalTrips !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => onViewDetails?.(captain)}
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

export default function CaptainManagement({ data = [], isLoading }: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCaptain, setSelectedCaptain] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const itemsPerPage = 10;

  // Safely access captains array
  const captains = Array.isArray(data) ? data : data?.captain || [];
  const totalPages = Math.ceil(captains.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentCaptains = captains.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (captain: any) => {
    setSelectedCaptain(captain);
    router.push(`/dashboard/captain-management/${captain.id}`);
  };

  if (isLoading) {
    return (
      <TableLoading
        variant="skeleton"
        rows={7}
        columns={5}
        message="Loading captains..."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Anchor className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Captain Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {captains.length} captain{captains.length !== 1 ? "s" : ""}{" "}
                registered
              </p>
            </div>
          </div>

          {/* View Toggle */}
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
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <User className="h-3.5 w-3.5" />
                      Captain
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Ship className="h-3.5 w-3.5" />
                      Experience
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" />
                      Total Trips
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5" />
                      Rating
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center">
                    <div className=" text-xs font-semibold text-gray-500">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentCaptains.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No captains found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          There are no captains to display at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCaptains.map((captain: any, index: number) => (
                    <tr
                      key={captain.id || index}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-200 rounded-full p-2">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {captain?.fullName || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: #{captain.id?.slice(-6) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={`mailto:${captain.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {captain.email || "No Email"}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {captain.phoneNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                          {captain.experience || "0"} years
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {captain.totalTrips ?? 0}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          trip{captain.totalTrips !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {captain.rating?.toFixed(1) || "N/A"}
                          </span>
                          <span className="text-xs text-gray-400">{`(${captain.totalReviews ?? 0})`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(captain)}
                          className="mx-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
            {currentCaptains.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No captains found</p>
              </div>
            ) : (
              currentCaptains.map((captain: any, index: number) => (
                <div
                  key={captain.id || index}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {captain?.fullName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {captain?.fullName || "Unknown"}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-gray-500">4.8</span>
                        </div>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-50 rounded-lg">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${captain.email}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {captain.email || "No Email"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{captain.phoneNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Ship className="h-4 w-4 text-gray-400" />
                      <span>{captain.totalTrips ?? 0} trips</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(captain)}
                      className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-medium text-blue-600 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Mobile View */}
        <MobileCaptainsView
          captains={captains}
          itemsPerPage={6}
          onViewDetails={handleViewDetails}
        />

        {/* Pagination */}
        {captains.length > itemsPerPage && (
          <div className="hidden md:block border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(indexOfLastItem, captains.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {captains.length}
                </span>{" "}
                captains
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
  );
}
