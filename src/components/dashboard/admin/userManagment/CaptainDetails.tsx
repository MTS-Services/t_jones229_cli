"use client";

import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CreditCard,
  Activity,
  MapPin,
  Ship,
  Anchor,
  CheckCircle,
  XCircle,
  Clock,
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
      chargeEnable: boolean;
      role: string;
      status: string;
      isDeleted: boolean;
      registerType: string;
      createdAt: string;
      updatedAt: string;
      paymentMethod: any;
    };
    trip: any[];
  };
}

export default function CaptainDetails({ userData }: CaptainDetailsProps) {
  const { user, trip } = userData;

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
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
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/30">
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900">
                {trip?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Ship className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Charge Status</p>
              <p className="text-xl font-bold text-gray-900">
                {user.chargeEnable ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Register Type</p>
              <p className="text-xl font-bold text-gray-900">
                {user.registerType}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
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
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Phone className="h-4 w-4" />
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
                <Calendar className="h-4 w-4" />
                Joined Date
              </label>
              <p className="text-gray-900">{formatDate(user.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last Updated
              </label>
              <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
                Charge Enable
              </label>
              <div className="flex items-center gap-2">
                {user.chargeEnable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium">
                    <XCircle className="h-4 w-4" />
                    Disabled
                  </span>
                )}
              </div>
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

      {/* Trips History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ship className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No trips found</p>
              <p className="text-sm text-gray-400 mt-1">
                This captain hasn't completed any trips yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
          </div>
        </div>
      </div>
    </div>
  );
}
