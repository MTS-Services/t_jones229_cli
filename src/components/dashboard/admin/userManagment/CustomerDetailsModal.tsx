"use client";

import { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaPlane,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import {
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";

export default function CustomerDetailsModal({
  isOpen,
  customer,
  waitlistStatus,
  onClose,
  onToggleWaitlist,
  onDelete,
  isDeleting,
}: any) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !customer) return null;

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    onDelete(customer.id);
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const getWaitlistBadge = () => {
    switch (waitlistStatus) {
      case "active":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          label: "Active",
        };
      case "pending":
        return {
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: Clock,
          label: "Pending",
        };
      default:
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: XCircle,
          label: "Inactive",
        };
    }
  };

  const statusBadge = getWaitlistBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">
        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {/* Header */}
        <div className="bg-[#035292] px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl">
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-semibold text-white">
                  Customer Profile
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  View and manage customer information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-blue-50 rounded-xl p-2.5 sm:p-4 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <FaPlane className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-[10px] sm:text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Trips
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">
                {customer.totalTrips || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-600 mt-1">
                Total journeys
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-2.5 sm:p-4 border border-purple-100">
              <div className="flex items-center gap-1.5 mb-1">
                <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                <span className="text-[10px] sm:text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Status
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${waitlistStatus === "active" ? "bg-emerald-500" : waitlistStatus === "pending" ? "bg-amber-500" : "bg-slate-400"}`}
                />
                <p className="text-xs sm:text-sm font-medium text-purple-700 capitalize truncate">
                  {waitlistStatus || "Inactive"}
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-purple-600 mt-1">
                Waitlist
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 sm:p-4 border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                <span className="text-[10px] sm:text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Member
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {new Date(customer.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-600 mt-1">
                Since
              </p>
            </div>
          </div>

          {/* Main Information Grid */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Full Name</p>
                    <p className="font-medium text-slate-900">
                      {customer.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Email Address</p>
                    <p className="font-medium text-slate-900 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <p className="font-medium text-slate-900">
                      {customer.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                Account Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Verification</span>
                  </div>
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      className={`w-4 h-4 ${
                        waitlistStatus === "active"
                          ? "text-emerald-500"
                          : waitlistStatus === "pending"
                            ? "text-amber-500"
                            : "text-slate-500"
                      }`}
                    />
                    <span className="text-sm text-slate-700">Waitlist</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Management Overview Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 sm:p-5 border border-amber-200 mb-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200 rounded-lg">
                <FaChartLine className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Management Overview
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  User management involves controlling digital identities and
                  access to organization's systems. This includes account
                  creation, authentication, permissions management, and activity
                  monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0">
          <div className="space-y-3">
            {/* Waitlist Action */}
            {/* <button
              onClick={onToggleWaitlist}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                waitlistStatus === "active"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {waitlistStatus === "active" ? (
                <>
                  <Clock className="w-4 h-4" />
                  Move to Pending
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Activate Waitlist
                </>
              )}
            </button> */}

            {/* Delete Section */}
            {!showDeleteConfirm ? (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            ) : (
              <div className="bg-white rounded-xl border-2 border-red-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900">
                      Confirm Deletion
                    </h4>
                    <p className="text-xs text-red-700">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{customer.fullName}</span>?
                  All associated data will be permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Yes, Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
