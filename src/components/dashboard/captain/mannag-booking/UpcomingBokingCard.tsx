"use client";

import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import CancelBookModal from "../../modal/CancelBookModal";
import EmailModal from "../../modal/SendEmailModal";
import { TripsBookProps } from "@/types/tripsTypes";
import { RootState } from "@/redux/store/store";
import { MdCancel, MdEmail } from "react-icons/md";

export default function UpcomingBookingCard({
  tripDate,
  bookingType,
  member,
  trip,
  boat,
  id,
  userId,
  status,
}: TripsBookProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Clean date formatting
  const date = new Date(tripDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Status color mapping
  const statusColors = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
    COMPLETED: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const statusColor =
    statusColors[status as keyof typeof statusColors] || statusColors.CONFIRMED;

  return (
    <>
      <CancelBookModal isOpen={isModalOpen} id={id} onClose={closeModal} />

      <article className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-4/12 h-56 md:h-auto bg-slate-100">
            <Image
              src={boat?.photos?.[0]?.url || "/images/boat-placeholder.jpg"}
              alt={trip?.tripName || "Boat trip"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 320px"
              priority={false}
            />

            {/* Booking Type Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`
                inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg
                ${
                  bookingType === "PRIVATE"
                    ? "bg-purple-600 text-white"
                    : "bg-blue-600 text-white"
                }
              `}
              >
                {bookingType}
              </span>
            </div>

            {/* Member Count */}
            {bookingType !== "PRIVATE" && member > 0 && (
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                👥 {member} {member === 1 ? "person" : "people"}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 lg:p-8">
            {/* Header Row */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 line-clamp-1">
                  {trip?.tripName || "Boat Trip"}
                </h2>

                {/* Status Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                >
                  {status || "CONFIRMED"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all group"
                  title="Message"
                >
                  <MdEmail className="w-5 h-5 text-blue-600" />
                  <EmailModal
                    reciverId={
                      userRole === "CAPTAIN" ? userId : boat?.captain?.id
                    }
                  />
                </button>

                {status !== "CANCELLED" && (
                  <button
                    onClick={openModal}
                    className="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-600 hover:text-rose-700 font-medium text-sm transition-all flex items-center gap-2"
                  >
                    <MdCancel className="w-5 h-5" />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Date Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">DATE</p>
                  <p className="font-semibold text-slate-800">
                    {formattedDate}
                  </p>
                  <p className="text-sm text-slate-600">{formattedTime}</p>
                </div>
              </div>

              {/* Boat Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-6 h-6 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">BOAT</p>
                  <p className="font-semibold text-slate-800">
                    {boat?.name || "Boat name"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Capacity: {boat?.capacity || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Captain Info & Booking ID */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              {userRole !== "CAPTAIN" && boat?.captain?.name && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {boat.captain.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Captain</p>
                    <p className="font-medium text-slate-800">
                      {boat.captain.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-right">
                <p className="text-xs text-slate-400">Booking ID</p>
                <p className="text-sm font-mono text-slate-500">
                  #{id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* View Details Link */}
            <div className="mt-4 text-right">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1 group">
                View trip details
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
