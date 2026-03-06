"use client";

import { useGetBookingQuery } from "@/redux/api/bookingApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import CancelTripsModal from "../../modal/CancelTripModal";
import {
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Clock,
  User,
  Mail,
  Ship,
  Tag,
  X,
  CheckCircle,
  AlertCircle,
  Anchor,
  CalendarClock,
  Phone,
  Star,
  Info,
  FileText,
  CreditCard,
  Settings,
} from "lucide-react";

export default function TripsDetails() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const bookingId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetBookingQuery(bookingId, {
    skip: !bookingId,
  });

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: CalendarClock,
      },
      cancelled: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: X,
      },
      completed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle,
      },
    } as const;
    const normalizedStatus = status?.toLowerCase() as keyof typeof statusConfig;
    return statusConfig[normalizedStatus] || statusConfig.pending;
  };

  if (isLoading) {
    return (
      <div className="">
        <div className="">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Booking Found
          </h3>
          <p className="text-slate-500">
            The booking you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const booking = data?.data;
  const trip = booking.trip;
  const boat = booking.boat;
  const captain = boat?.captain;
  const statusBadge = getStatusBadge(booking.status);
  const StatusIcon = statusBadge.icon;

  return (
    <>
      <CancelTripsModal
        isOpen={isModalOpen}
        id={bookingId as string}
        onClose={closeModal}
      />

      <div className="">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {trip?.tripName || "Trip Name"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {booking.status || "Status"}
                  </span>
                </div>
                <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
                  {trip?.description || "No description available."}
                </p>
              </div>

              {/* Booking ID Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  ID:{" "}
                  <span className="font-mono text-slate-900">
                    #{bookingId?.slice(-8)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Trip Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all hover:border-blue-200 group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trip Date
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(booking.tripDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all hover:border-emerald-200 group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Group Size
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {booking.groupSize}{" "}
                    {booking.groupSize === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all hover:border-purple-200 group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {trip?.fishingLocation?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Trip Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Section */}
                <div className="lg:w-80 flex-shrink-0">
                  <div className="relative w-full h-56 lg:h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Anchor className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 font-medium">
                          No Image Available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {trip?.tripName}
                    </h2>
                    <div className="bg-blue-50 rounded-xl px-4 py-2 border border-blue-100">
                      <span className="text-xs text-blue-600 font-medium block">
                        Total Price
                      </span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                          {trip?.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {trip?.description}
                  </p>

                  {/* Features Grid */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="h-4 w-4 text-slate-400" />
                      Trip Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <FeatureTag icon={Users} text="Private Group" />
                      <FeatureTag
                        icon={Clock}
                        text={`${trip?.duration} Hours`}
                      />
                      <FeatureTag
                        icon={User}
                        text={`Up to ${boat?.guests} people`}
                      />
                      {trip?.species?.map((species: string) => (
                        <FeatureTag key={species} icon={Tag} text={species} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captain Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Ship className="h-5 w-5 text-blue-500" />
              Captain Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetailCard
                icon={User}
                label="Captain Name"
                value={
                  captain ? `${captain.firstName} ${captain.lastName}` : "N/A"
                }
              />
              <DetailCard
                icon={Mail}
                label="Email"
                value={captain?.email || "N/A"}
                isEmail
              />
              <DetailCard
                icon={Ship}
                label="Boat Type"
                value={boat?.boatType || "N/A"}
              />
              <DetailCard
                icon={Star}
                label="Experience"
                value={
                  captain?.experience ? `${captain.experience} years` : "N/A"
                }
              />
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" />
              User Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailCard
                icon={User}
                label="User Name"
                value={
                  booking.user
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : "N/A"
                }
              />
              <DetailCard
                icon={Mail}
                label="Email"
                value={booking.user?.email || "N/A"}
                isEmail
              />
              <DetailCard
                icon={CreditCard}
                label="Booking Type"
                value={booking.bookingType || "N/A"}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetailCard
                icon={Calendar}
                label="Booking Date"
                value={new Date(booking.createdAt).toLocaleDateString()}
              />
              <DetailCard
                icon={Clock}
                label="Duration"
                value={`${trip?.duration || "N/A"} hours`}
              />
              <DetailCard
                icon={Users}
                label="Max Capacity"
                value={`${boat?.guests || "N/A"} people`}
              />
              <DetailCard
                icon={DollarSign}
                label="Price per person"
                value={trip?.price ? `$${trip.price}` : "N/A"}
              />
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-lg">
                  <Settings className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Actions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage your booking and make changes
                  </p>
                </div>
              </div>
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={booking.status?.toLowerCase() === "cancelled"}
              >
                <X className="h-5 w-5" />
                {booking.status?.toLowerCase() === "cancelled"
                  ? "Already Cancelled"
                  : "Cancel Trip"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components
const FeatureTag = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-700 transition-colors">
    <Icon className="h-3.5 w-3.5 text-slate-500" />
    {text}
  </span>
);

const DetailCard = ({
  icon: Icon,
  label,
  value,
  isEmail = false,
}: {
  icon: any;
  label: string;
  value: string;
  isEmail?: boolean;
}) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
      <Icon className="h-4 w-4 text-slate-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      {isEmail ? (
        <a
          href={`mailto:${value}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
      )}
    </div>
  </div>
);
