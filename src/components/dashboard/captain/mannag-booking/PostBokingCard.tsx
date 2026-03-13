"use client";

import Image from "next/image";
import Link from "next/link";
import { TripsBookProps } from "@/types/tripsTypes";
import { useState } from "react";

// Simple icon components for better performance
const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
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
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const BoatIcon = () => (
  <svg
    className="w-5 h-5"
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
);

const MessageIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default function UpcomingBookingCard({
  tripDate,
  bookingType,
  member,
  trip,
  boat,
}: TripsBookProps) {
  const [imageError, setImageError] = useState(false);

  // Format date nicely
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

  // Get booking type badge color
  const isPrivate = bookingType === "PRIVATE";
  const badgeColor = isPrivate
    ? "bg-purple-100 text-purple-700 border-purple-200"
    : "bg-blue-100 text-blue-700 border-blue-200";

  return (
    <article className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-80 h-56 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {boat?.photos?.[0]?.url && !imageError ? (
            <Image
              src={boat.photos[0].url}
              alt={trip?.tripName || "Trip image"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 320px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BoatIcon />
            </div>
          )}

          {/* Booking Type Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold 
              border shadow-sm backdrop-blur-sm bg-white/90
              ${isPrivate ? "text-purple-700" : "text-blue-700"}
            `}
            >
              {isPrivate ? "🔒 Private" : "👥 Shared"} Trip
            </span>
          </div>

          {/* Member Count for Shared Trips */}
          {!isPrivate && member > 0 && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                <UsersIcon />
                {member} {member === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
                {trip?.tripName || "Unnamed Trip"}
              </h2>

              {/* Quick Info Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeColor}`}
                >
                  {isPrivate ? "🔒" : "👥"} {bookingType}
                </span>
                {boat?.name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <BoatIcon />
                    {boat.name}
                  </span>
                )}
              </div>
            </div>

            {/* Support Link */}
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all group"
            >
              <MessageIcon />
              <span className="text-sm font-medium">Get Support</span>
            </Link>
          </div>

          {/* Date & Time Section - Prominent */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <CalendarIcon />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
                  Scheduled Date & Time
                </p>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {formattedDate}
                </p>
                <p className="text-lg text-gray-700">{formattedTime}</p>
              </div>
            </div>
          </div>

          {/* Additional Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Boat Details */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 mb-2">BOAT DETAILS</p>
              <p className="font-semibold text-gray-900 mb-1">
                {boat?.name || "Boat name"}
              </p>
              <p className="text-sm text-gray-600">
                Capacity: {boat?.capacity || "N/A"} guests
              </p>
            </div>

            {/* Trip Details */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 mb-2">TRIP DETAILS</p>
              <p className="font-semibold text-gray-900 mb-1">
                {isPrivate ? "Private Charter" : "Shared Experience"}
              </p>
              <p className="text-sm text-gray-600">
                {!isPrivate && `${member} guest${member !== 1 ? "s" : ""} · `}
                {trip?.duration || "Full day"}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => window.print()}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Save details
            </button>

            <Link
              href={`/trips/${trip?.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1 group"
            >
              View full itinerary
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
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
