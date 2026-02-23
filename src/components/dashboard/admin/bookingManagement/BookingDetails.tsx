"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookingQuery } from "@/redux/api/bookingApi";
import { ArrowLeft } from "lucide-react";
import StatusButton from "../button/StatusButton";

export default function BookingDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useGetBookingQuery(id);
  const booking = data?.data;

  const getStatusButtonProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { color: "#42DF3A", className: "text-white" };
      case "pending":
        return { color: "#FDA831", className: "text-white" };
      case "cancelled":
      case "cancel":
        return { color: "#FF0000", className: "text-white" };
      case "completed":
        return { color: "#4CAF50", className: "text-white" };
      default:
        return { color: "#8C8C8C", className: "text-white" };
    }
  };

  const getPaymentStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { color: "#42DF3A", className: "text-white" };
      case "unpaid":
        return { color: "#FDA831", className: "text-white" };
      case "partial":
        return { color: "#2196F3", className: "text-white" };
      default:
        return { color: "#8C8C8C", className: "text-white" };
    }
  };

  if (isLoading) {
    return (
      <div className="">
        <div className="max-w-6xl mx-auto items-center justify-center p-8">
          <div className="text-gray-500">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-red-500">Failed to load booking details</div>
        </div>
      </div>
    );
  }

  const statusProps = getStatusButtonProps(booking.status);
  const paymentProps = getPaymentStatusProps(booking.paymentStatus);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Bookings
          </button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Trip Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Trip Name</p>
                  <p className="font-medium">
                    {booking.trip?.tripName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trip Type</p>
                  <p className="font-medium">
                    {booking.trip?.tripType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{booking.trip?.duration} hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departure Time</p>
                  <p className="font-medium">{booking.trip?.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trip Date</p>
                  <p className="font-medium">
                    {booking.tripDate
                      ? new Date(booking.tripDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trip Days</p>
                  <p className="font-medium">
                    {booking.trip?.tripDays?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
              {booking.trip?.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{booking.trip.description}</p>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{booking.user?.email}</p>
                </div>
                {booking.groupMember && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {booking.groupMember.phoneNumber || "N/A"}
                      </p>
                    </div>
                    {booking.groupMember.fishingType && (
                      <div>
                        <p className="text-sm text-gray-500">Fishing Type</p>
                        <p className="font-medium">
                          {booking.groupMember.fishingType}
                        </p>
                      </div>
                    )}
                    {booking.groupMember.targetSpecies && (
                      <div>
                        <p className="text-sm text-gray-500">Target Species</p>
                        <p className="font-medium">
                          {booking.groupMember.targetSpecies}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              {booking.groupMember?.details && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Additional Details</p>
                  <p className="text-gray-700">{booking.groupMember.details}</p>
                </div>
              )}
            </div>

            {/* Boat & Captain Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Boat & Captain Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Captain Name</p>
                  <p className="font-medium">
                    {booking.boat?.captain?.firstName}{" "}
                    {booking.boat?.captain?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Captain Email</p>
                  <p className="font-medium">{booking.boat?.captain?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Boat Type</p>
                  <p className="font-medium">
                    {booking.boat?.boatType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium">{booking.boat?.guests} guests</p>
                </div>
              </div>
              {booking.boat?.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Boat Description</p>
                  <p className="text-gray-700">{booking.boat.description}</p>
                </div>
              )}
              {booking.boat?.photos && booking.boat.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Boat Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {booking.boat.photos.slice(0, 3).map((photo: any) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Boat"
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono text-sm">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Type</p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {booking.bookingType}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Group Size</p>
                  <p className="font-medium">{booking.groupSize || 1} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusButton
                    color={statusProps.color}
                    className={statusProps.className}
                  >
                    {booking.status}
                  </StatusButton>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <StatusButton
                    color={paymentProps.color}
                    className={paymentProps.className}
                  >
                    {booking.paymentStatus}
                  </StatusButton>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-medium">${booking.payFirst}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Amount</span>
                  <span className="font-medium">${booking.payDue}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-lg">
                    ${booking.payFirst + booking.payDue}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-sm">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
