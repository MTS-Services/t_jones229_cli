"use client";

import { useSingleUserQuery } from "@/redux/api/authApi";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserModal from "../../modal/DeleteUserModal";
import { useState } from "react";

export default function CustomerDetails() {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const userId = params?.id;
  const { data, isLoading, error } = useSingleUserQuery(userId);

  if (isLoading) {
    return (
      <div className="mx-auto p-6 bg-white">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="mt-6">
          <Skeleton className="h-6 w-32 mb-4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-6 bg-white">
        <p className="text-red-600">
          Failed to load customer details. Please try again.
        </p>
      </div>
    );
  }

  const user = data?.data?.user;
  const trips = data?.data?.trip || [];

  return (
    <>
      <DeleteUserModal
        isOpen={isModalOpen}
        id={userId as string}
        onClose={closeModal}
      />
      <div className="mx-auto p-6 bg-white pt-20 xl:pt-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-gray-600">Customer details</p>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First name*
            </label>
            <input
              id="firstName"
              type="text"
              readOnly
              value={user?.firstName || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last name*
            </label>
            <input
              id="lastName"
              type="text"
              readOnly
              value={user?.lastName || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address*
            </label>
            <input
              id="email"
              type="email"
              readOnly
              value={user?.email || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="mobile"
              className="text-sm font-medium text-gray-700"
            >
              Mobile number*
            </label>
            <input
              id="mobile"
              type="tel"
              readOnly
              value={user?.phoneNumber || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* All Trips Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All trips
          </h2>
          {trips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Trip Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Captain
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Guests
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trips?.map((trip: any) => (
                    <tr
                      key={trip.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-blue-600">
                        {trip.trip?.tripName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(trip.tripDate).toLocaleDateString()}{" "}
                        {trip.trip?.departureTime}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {trip.boat?.captain?.email || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {trip.boat?.guests || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {trip.boat?.meetingPoint?.[0]?.city || "N/A"},{" "}
                        {trip.boat?.meetingPoint?.[0]?.country || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trip.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : trip.status === "COMPLETE"
                              ? "bg-gray-100 text-gray-800"
                              : trip.status === "CANCELLED"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No trips found.</p>
          )}
        </div>

        {/* Action Panel */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Action Panel
          </h3>
          <button
            onClick={openModal}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Delete Contact
          </button>
        </div>
      </div>
    </>
  );
}
