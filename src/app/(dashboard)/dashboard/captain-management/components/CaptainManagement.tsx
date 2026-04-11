"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteUserMutation } from "@/redux/api/authApi";

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
  Fish,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import PaginationButton from "./PaginationButton";
import TableLoading from "@/components/dashboard/common/TableLoading";

function MobileCaptainsView({
  captains,
  itemsPerPage = 6,
  onViewDetails,
  onDeleteClick,
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
              <button
                onClick={() => onDeleteClick?.(captain)}
                className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
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
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCaptain, setSelectedCaptain] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [captainToDelete, setCaptainToDelete] = useState<any>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

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

  const handleDeleteClick = (captain: any) => {
    setCaptainToDelete(captain);
    setShowDeleteModal(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleConfirmDelete = async () => {
    if (!captainToDelete?.id) return;

    try {
      const response = await deleteUser(captainToDelete.id).unwrap();

      // Show success message
      setDeleteSuccess(
        `${captainToDelete.fullName} has been deleted successfully!`,
      );

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setShowDeleteModal(false);
        setCaptainToDelete(null);
        setDeleteSuccess(null);
      }, 1500);
    } catch (error: any) {
      // Show error message
      setDeleteError(
        error?.data?.message || "Failed to delete captain. Please try again.",
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCaptainToDelete(null);
    setDeleteError(null);
    setDeleteSuccess(null);
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
    <div>
      {/* Header Section */}
      <div className="bg-white mb-6 rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#035292] rounded-xl">
              <Anchor className="h-6 w-6 text-white" />
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

      {/* Main Content */}
      <div className="overflow-hidden">
        {/* Desktop Table View */}
        {viewMode === "list" && (
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-[#035292] border-y border-gray-100">
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Anchor className="h-3.5 w-3.5" />
                      Captain
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Ship className="h-3.5 w-3.5" />
                      Total Boats
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Fish className="h-3.5 w-3.5" />
                      Total Trips
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5" />
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
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {captain?.fullName || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={`mailto:${captain.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {captain.email || "No Email"}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          {captain.phoneNumber || "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {captain.totalBoats ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {captain.totalTrips ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              captain.userStatus === "ACTIVE"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                          {captain.userStatus || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(captain)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">View</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(captain)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {captain?.fullName?.charAt(0) || "C"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {captain?.fullName || "Unknown"}
                      </h3>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          captain.userStatus === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {captain.userStatus || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={`mailto:${captain.email}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {captain.email || "No Email"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{captain.phoneNumber || "N/A"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                      <Ship className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {captain.totalBoats ?? 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Boats
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 text-center">
                      <Award className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {captain.totalTrips ?? 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Trips
                      </p>
                    </div>
                  </div>

                  {captain.createdAt && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Joined{" "}
                        {new Date(captain.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleViewDetails(captain)}
                      className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(captain)}
                      className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
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
          onDeleteClick={handleDeleteClick}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Delete Captain
                </h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-white/80 hover:text-white rounded-lg p-1 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              {deleteSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        {deleteSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                      {captainToDelete?.fullName || "this captain"}
                    </span>
                    ?
                  </p>

                  {deleteError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            {deleteError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900 mb-1">
                          This action cannot be undone
                        </p>
                        <p className="text-xs text-red-700">
                          All associated data including boats and trips will be
                          affected.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              {!deleteSuccess && (
                <>
                  <button
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Captain
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
