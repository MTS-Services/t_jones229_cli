"use client";

import { useGetBookingQuery } from "@/redux/api/bookingApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import CancelTripsModal from "../../modal/CancelTripModal";

export default function TripsDetails() {
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const bookingId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetBookingQuery(bookingId, {
    skip: !bookingId,
  });


  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-6 text-center text-gray-500">No booking found</div>
    );
  }

  const booking = data?.data;
  const trip = booking.trip;
  const boat = booking.boat;
  const captain = boat?.captain;

  return (
    <>
      <CancelTripsModal
        isOpen={isModalOpen}
        id={bookingId as string}
        onClose={closeModal}
      />

      <div className="bg-gray-50 min-h-screen p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {trip?.tripName || "Trip Name"}
              </h1>
              <p className="text-gray-600 text-sm">
                {trip?.description || "No description available."}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {booking.status || "Status"}
            </span>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Date
              </label>
              <input
                type="text"
                value={new Date(booking.tripDate).toLocaleDateString()}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group size
              </label>
              <input
                type="text"
                value={`${booking.groupSize} people`}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={trip?.fishingLocation?.join(", ") || "N/A"}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Main Trip Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 flex-shrink-0">
                <div className="w-full h-48 lg:h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {trip?.tripName}
                  </h2>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Price</span>
                    <div className="text-lg font-semibold text-gray-900">
                      ${trip?.price}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {trip?.description}
                </p>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Key features:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Group type */}
                    <span className="flex items-center justify-center gap-2 w-[135px] h-[32px] rounded-full border border-[#EDF1FF] px-2 py-1">
                      Private Group
                    </span>

                    {/* Duration */}
                    <span className="flex items-center justify-center gap-2 w-[135px] h-[32px] rounded-full border border-[#EDF1FF] px-2 py-1">
                      {trip?.duration} Hours
                    </span>

                    {/* Capacity */}
                    <span className="flex items-center justify-center gap-2 w-[135px] h-[32px] rounded-full border border-[#EDF1FF] px-2 py-1">
                      Up to {boat?.guests} people
                    </span>

                    {/* Species */}
                    {trip?.species?.map((s: any) => (
                      <span
                        key={s}
                        className="flex items-center justify-center gap-2 w-[135px] h-[32px] rounded-full border border-[#EDF1FF] px-2 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captain Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-[24px] text-[#242424] mb-4">Captain details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Captain name</span>
                <div>
                  {captain ? `${captain.firstName} ${captain.lastName}` : "N/A"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <div>
                  <a
                    href={`mailto:${captain?.email}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {captain?.email || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Boat Type</span>
                <div>{boat?.boatType || "N/A"}</div>
              </div>
            </div>
          </div>
          {/* User Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              User details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">User name</span>
                <div>
                  {booking.user
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : "N/A"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <div>
                  <a
                    href={`mailto:${booking.user?.email}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {booking.user?.email || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Booking Type</span>
                <div>{booking.bookingType || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Action Panel
            </h2>
            <button
              onClick={openModal}
              className="w-full md:w-auto px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200"
            >
              Cancel Trip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
