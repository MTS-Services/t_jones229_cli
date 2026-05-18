"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CreditCard,
  Activity,
  Ship,
  Anchor,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Wrench,
  X,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Eye,
  Ruler,
  Fish,
  Image as ImageIcon,
} from "lucide-react";

interface CaptainDetailsProps {
  userData: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
      accountId: string | null;
      customerId: string;
      role: string;
      status: string;
      isDeleted: boolean;
      registerType: string;
      createdAt: string;
      updatedAt: string;
      paymentMethod: any;
    };
    trip: any[];
    boat: any[];
  };
}

export default function CaptainDetails({ userData }: CaptainDetailsProps) {
  const { user, trip, boat } = userData;
  const [selectedBoat, setSelectedBoat] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const statusMap: any = {
      ACTIVE: {
        icon: CheckCircle,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      INACTIVE: {
        icon: XCircle,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      },
      PENDING: {
        icon: Clock,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
    };
    return (
      statusMap[status] || {
        icon: Activity,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    );
  };

  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="bg-blue-400 rounded-xl shadow p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30">
                {user.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-blue-100 mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {user.status}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    <Shield className="h-3.5 w-3.5" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal & Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Captain Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    {user.id}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-blue-300" />
                    Email Address
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-4 w-4 text-blue-300" />
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-300" />
                    Joined Date
                  </label>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-300" />
                    Last Updated
                  </label>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Account Status
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div
                    className={`w-12 h-12 ${statusConfig.bg} rounded-lg flex items-center justify-center`}
                  >
                    <StatusIcon className={`h-6 w-6 ${statusConfig.text}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900">{user.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div
                    className={`w-12 h-12 ${user.isDeleted ? "bg-red-50" : "bg-emerald-50"} rounded-lg flex items-center justify-center`}
                  >
                    {user.isDeleted ? (
                      <XCircle className="h-6 w-6 text-red-600" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account</p>
                    <p className="font-semibold text-gray-900">
                      {user.isDeleted ? "Deleted" : "Active"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Ship className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Trips</p>
                    <p className="font-semibold text-gray-900">
                      {trip?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Register Type</p>
                    <p className="font-semibold text-gray-900">
                      {user.registerType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Payment Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Customer ID
                </label>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                  {user.customerId}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Account ID
                </label>
                <p className="text-gray-900">
                  {user.accountId || "Not connected"}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Payment Method
                </label>
                <p className="text-gray-900">
                  {user.paymentMethod
                    ? typeof user.paymentMethod === "object"
                      ? user.paymentMethod.paymentMethod || "Card on file"
                      : user.paymentMethod
                    : "Not configured"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boats List - Table Format */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Ship className="h-5 w-5 text-blue-600" />
              Boat & Trips Information ({boat?.length || 0})
            </h2>
          </div>
          <div className="">
            {boat && boat.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        Boat Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Capacity
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Length
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Model Year
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Trips
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {boat.map((boatItem: any) => (
                      <tr
                        key={boatItem.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left">
                          {boatItem.manufacturer || "Unknown Boat"}
                        </td>
                        <td className="px-6 py-4 text-left">
                          {boatItem.boatType || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {boatItem.guests || 0}{" "}
                          {boatItem.guests === 1 ? "Guest" : "Guests"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {boatItem.boatLength || 0} ft
                        </td>
                        <td className="px-6 py-4 text-center">
                          {boatItem.modelYear || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              boatItem.approvalStatus === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700"
                                : boatItem.approvalStatus === "PENDING"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {boatItem.approvalStatus || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {boatItem.trips?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedBoat(boatItem);
                              setShowModal(true);
                            }}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center justify-center"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-gray-500 font-medium">No boats found</p>
                <p className="text-sm text-gray-400 mt-1">
                  This captain hasn't added any boats yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trips History */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Anchor className="h-5 w-5 text-blue-600" />
              Trips History ({trip?.length || 0})
            </h2>
          </div>
          <div className="p-6">
            {trip && trip.length > 0 ? (
              <div className="space-y-4">
                {trip.map((tripItem: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Ship className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {tripItem.tripName || "Trip"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {tripItem.date
                              ? formatDate(tripItem.date)
                              : "Date not available"}
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-gray-500 font-medium">No trips found</p>
                <p className="text-sm text-gray-400 mt-1">
                  This captain hasn't completed any trips yet.
                </p>
              </div>
            )}
          </div>
        </div> */}
      </div>
      {/* Boat Details Modal */}
      {showModal && selectedBoat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Ship className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedBoat.manufacturer || "Boat Details"}
                  </h2>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Boat ID: {selectedBoat.id?.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedBoat.boatType || "N/A"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedBoat.guests || 0}
                  </p>
                  <p className="text-xs text-gray-500">max guests</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Length
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedBoat.boatLength || 0}'
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedBoat.modelYear || "N/A"}
                  </p>
                </div>
              </div>

              {/* Status & Listing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Listing Type
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBoat.listingType || "Standard"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Approval Status
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedBoat.approvalStatus === "APPROVED"
                          ? "bg-emerald-100"
                          : selectedBoat.approvalStatus === "PENDING"
                            ? "bg-amber-100"
                            : "bg-gray-200"
                      }`}
                    >
                      {selectedBoat.approvalStatus === "APPROVED" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : selectedBoat.approvalStatus === "PENDING" ? (
                        <Clock className="h-4 w-4 text-amber-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedBoat.approvalStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedBoat.approvalStatus === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {selectedBoat.approvalStatus || "DRAFT"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedBoat.description && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedBoat.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Photos */}
              {selectedBoat.photos && selectedBoat.photos.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Photos
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedBoat.photos.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedBoat.photos.slice(0, 4).map((photo: any) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={photo.url}
                          alt="Boat"
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                    {selectedBoat.photos.length > 4 && (
                      <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                        <p className="text-sm font-medium text-gray-600">
                          +{selectedBoat.photos.length - 4} more
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Facilities & Gear */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedBoat.facilities &&
                  selectedBoat.facilities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Wrench className="h-4 w-4 text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Facilities
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedBoat.facilities.map((facility: string) => (
                          <span
                            key={facility}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {selectedBoat.gearAndCrew &&
                  selectedBoat.gearAndCrew.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Gear & Crew
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedBoat.gearAndCrew.map((gear: string) => (
                          <span
                            key={gear}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100"
                          >
                            {gear}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Charter Types */}
              {selectedBoat.charterTypes && selectedBoat.charterTypes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Charter Types
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedBoat.charterTypes.map((ct: string) => (
                      <span key={ct} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-100">{ct}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meeting Points */}
              {selectedBoat.meetingPoint &&
                selectedBoat.meetingPoint.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Meeting Points
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedBoat.meetingPoint.map(
                        (point: any, index: number) => (
                          <div
                            key={point.id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-blue-700">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {point.street}
                                </p>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {point.city}, {point.country} {point.postCode}
                                </p>
                                {point.direction && (
                                  <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Directions:
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {point.direction}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Fishing Info */}
              {selectedBoat.fishing && selectedBoat.fishing.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Fish className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Fishing Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {selectedBoat.fishing.map((fish: any) => (
                      <div
                        key={fish.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fish.species && fish.species.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Target Species
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {fish.species.map((s: string) => (
                                  <span
                                    key={s}
                                    className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {fish.fishingLocation &&
                            fish.fishingLocation.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                  Fishing Locations
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {fish.fishingLocation.map((loc: string) => (
                                    <span
                                      key={loc}
                                      className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                    >
                                      {loc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {fish.fishingTechnique &&
                            fish.fishingTechnique.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                  Techniques
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {fish.fishingTechnique.map((tech: string) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {fish.includedPrice &&
                            fish.includedPrice.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                  Included Items
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {fish.includedPrice.map((item: string) => (
                                    <span
                                      key={item}
                                      className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Trips */}
              {selectedBoat.trips && selectedBoat.trips.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Ship className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Associated Trips
                      </h3>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {selectedBoat.trips.length} trips
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedBoat.trips.map((tripItem: any) => (
                      <div
                        key={tripItem.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {tripItem.tripName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {tripItem.description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {tripItem.duration}h
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <DollarSign className="h-3 w-3" />$
                                {tripItem.price}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${
                                  tripItem.tripStatus === "OPEN"
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    tripItem.tripStatus === "OPEN"
                                      ? "bg-emerald-500"
                                      : "bg-amber-500"
                                  }`}
                                ></span>
                                {tripItem.tripStatus}
                              </span>
                            </div>
                            {tripItem.tripDays?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {tripItem.tripDays.map((day: string) => (
                                  <span key={day} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{day}</span>
                                ))}
                              </div>
                            )}
                            {tripItem.species?.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {tripItem.species.map((s: string) => (
                                  <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{s}</span>
                                ))}
                              </div>
                            )}
                            {tripItem.fishingLocation?.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {tripItem.fishingLocation.map((loc: string) => (
                                  <span key={loc} className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">{loc}</span>
                                ))}
                              </div>
                            )}
                            {tripItem.fishingTechnique?.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {tripItem.fishingTechnique.map((t: string) => (
                                  <span key={t} className="px-1.5 py-0.5 bg-green-50 text-green-600 text-xs rounded">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors whitespace-nowrap">
                            View Trip
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
