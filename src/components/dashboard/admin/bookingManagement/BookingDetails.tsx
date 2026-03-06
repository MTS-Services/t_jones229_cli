"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookingQuery } from "@/redux/api/bookingApi";
import {
  ArrowLeft,
  Calendar,
  Users,
  Ship,
  User,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  Mail,
  Anchor,
  Fish,
  Camera,
  FileText,
  Receipt,
  Activity,
} from "lucide-react";
import StatusButton from "../button/StatusButton";
import Image from "next/image";

// Skeleton Loader Component
function BookingDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-5 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
function ErrorState({ message }: { message: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to Load
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Detail Row Component
function DetailRow({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: any;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {Icon && (
        <div className="flex-shrink-0 mt-1">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 font-medium break-words">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useGetBookingQuery(id);
  const booking = data?.data;

  const getStatusButtonProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          color: "#10B981",
          className: "text-white",
          bgClass: "bg-green-100 text-green-800",
          icon: "✓",
        };
      case "pending":
        return {
          color: "#F59E0B",
          className: "text-white",
          bgClass: "bg-yellow-100 text-yellow-800",
          icon: "⏳",
        };
      case "cancelled":
      case "cancel":
        return {
          color: "#EF4444",
          className: "text-white",
          bgClass: "bg-red-100 text-red-800",
          icon: "✕",
        };
      case "completed":
        return {
          color: "#3B82F6",
          className: "text-white",
          bgClass: "bg-blue-100 text-blue-800",
          icon: "✓",
        };
      default:
        return {
          color: "#6B7280",
          className: "text-white",
          bgClass: "bg-gray-100 text-gray-800",
          icon: "•",
        };
    }
  };

  const getPaymentStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          color: "#10B981",
          className: "text-white",
          bgClass: "bg-green-100 text-green-800",
          icon: "✓",
        };
      case "unpaid":
        return {
          color: "#F59E0B",
          className: "text-white",
          bgClass: "bg-yellow-100 text-yellow-800",
          icon: "⏳",
        };
      case "partial":
        return {
          color: "#3B82F6",
          className: "text-white",
          bgClass: "bg-blue-100 text-blue-800",
          icon: "◐",
        };
      default:
        return {
          color: "#6B7280",
          className: "text-white",
          bgClass: "bg-gray-100 text-gray-800",
          icon: "•",
        };
    }
  };

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  if (error || !booking) {
    return (
      <ErrorState message="Unable to load booking details. Please try again." />
    );
  }

  const statusProps = getStatusButtonProps(booking.status);
  const paymentProps = getPaymentStatusProps(booking.paymentStatus);

  return (
    <div className="">
      {/* Enhanced Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <div className="p-1 rounded-lg group-hover:bg-gray-100">
            <ArrowLeft size={18} />
          </div>
          <span>Back to Bookings</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Details
            </h1>
            <p className="text-gray-500">
              View complete information about this booking
            </p>
          </div>

          {/* Quick Status Summary */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
            <div className={`px-3 py-1.5 rounded-lg ${statusProps.bgClass}`}>
              <span className="text-sm font-medium flex items-center gap-1">
                <span>{statusProps.icon}</span>
                {booking.status}
              </span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg ${paymentProps.bgClass}`}>
              <span className="text-sm font-medium flex items-center gap-1">
                <span>{paymentProps.icon}</span>
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Information */}
          <InfoCard title="Trip Information" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailRow
                label="Trip Name"
                value={booking.trip?.tripName}
                icon={MapPin}
              />
              <DetailRow
                label="Trip Type"
                value={booking.trip?.tripType}
                icon={Activity}
              />
              <DetailRow
                label="Duration"
                value={
                  booking.trip?.duration
                    ? `${booking.trip.duration} hours`
                    : "N/A"
                }
                icon={Clock}
              />
              <DetailRow
                label="Departure Time"
                value={booking.trip?.departureTime}
                icon={Clock}
              />
              <DetailRow
                label="Trip Date"
                value={
                  booking.tripDate
                    ? new Date(booking.tripDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"
                }
                icon={Calendar}
              />
              <DetailRow
                label="Available Days"
                value={booking.trip?.tripDays?.join(", ")}
                icon={Calendar}
              />
            </div>
            {booking.trip?.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <DetailRow
                  label="Description"
                  value={booking.trip.description}
                  icon={FileText}
                />
              </div>
            )}
          </InfoCard>

          {/* Customer Information */}
          <InfoCard title="Customer Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailRow
                label="Full Name"
                value={`${booking.user?.firstName} ${booking.user?.lastName}`}
                icon={User}
              />
              <DetailRow
                label="Email"
                value={booking.user?.email}
                icon={Mail}
              />
              {booking.groupMember && (
                <>
                  <DetailRow
                    label="Phone"
                    value={booking.groupMember.phoneNumber}
                    icon={Phone}
                  />
                  <DetailRow
                    label="Fishing Type"
                    value={booking.groupMember.fishingType}
                    icon={Fish}
                  />
                  <DetailRow
                    label="Target Species"
                    value={booking.groupMember.targetSpecies}
                    icon={Fish}
                  />
                </>
              )}
            </div>
            {booking.groupMember?.details && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <DetailRow
                  label="Additional Details"
                  value={booking.groupMember.details}
                  icon={FileText}
                />
              </div>
            )}
          </InfoCard>

          {/* Boat & Captain Information */}
          <InfoCard title="Boat & Captain Information" icon={Ship}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailRow
                label="Captain Name"
                value={`${booking.boat?.captain?.firstName} ${booking.boat?.captain?.lastName}`}
                icon={User}
              />
              <DetailRow
                label="Captain Email"
                value={booking.boat?.captain?.email}
                icon={Mail}
              />
              <DetailRow
                label="Boat Type"
                value={booking.boat?.boatType}
                icon={Anchor}
              />
              <DetailRow
                label="Capacity"
                value={
                  booking.boat?.guests ? `${booking.boat.guests} guests` : "N/A"
                }
                icon={Users}
              />
            </div>
            {booking.boat?.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <DetailRow
                  label="Boat Description"
                  value={booking.boat.description}
                  icon={FileText}
                />
              </div>
            )}
            {booking.boat?.photos && booking.boat.photos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Boat Photos
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {booking.boat.photos.slice(0, 4).map((photo: any) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={photo.url}
                          alt="Boat"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </InfoCard>
        </div>

        {/* Right Column - Summary (1/3 width) */}
        <div className="space-y-6">
          {/* Booking Summary Card */}
          <InfoCard title="Booking Summary" icon={Receipt}>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Booking ID
                </p>
                <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                  {booking.id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Group Size"
                  value={booking.groupSize || 1}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  label="Type"
                  value={booking.bookingType}
                  icon={Activity}
                  color="purple"
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Status Overview
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Booking Status
                    </span>
                    <StatusButton
                      color={statusProps.color}
                      className={statusProps.className}
                    >
                      {booking.status}
                    </StatusButton>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Status
                    </span>
                    <StatusButton
                      color={paymentProps.color}
                      className={paymentProps.className}
                    >
                      {booking.paymentStatus}
                    </StatusButton>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Payment Details Card */}
          <InfoCard title="Payment Details" icon={CreditCard}>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid Amount</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${booking.payFirst?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due Amount</span>
                    <span className="text-lg font-semibold text-orange-600">
                      ${booking.payDue?.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ${(booking.payFirst + booking.payDue).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Progress</span>
                  <span>
                    {(
                      (booking.payFirst / (booking.payFirst + booking.payDue)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(booking.payFirst / (booking.payFirst + booking.payDue)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Timestamps Card */}
          <InfoCard title="Timeline" icon={Clock}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Edit Booking
              </button>
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Send Reminder
              </button>
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Print Details
              </button>
              <button className="p-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
