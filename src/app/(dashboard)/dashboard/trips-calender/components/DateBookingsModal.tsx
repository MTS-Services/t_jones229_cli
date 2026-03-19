"use client";

import { X, CalendarIcon } from "lucide-react";
import { Booking } from "../types/types";
import { BookingCard } from "./BookingCard";

interface DateBookingsModalProps {
  selectedDate: string | null;
  bookings: Booking[];
  onClose: () => void;
}

export default function DateBookingsModal({
  selectedDate,
  bookings,
  onClose,
}: DateBookingsModalProps) {
  if (!selectedDate) return null;

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#035292] to-blue-500 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{formattedDate}</h2>
              <p className="text-sm text-blue-100">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div>
          {bookings.length > 0 ? (
            <div>
              {bookings.map((booking) => (
                <BookingCard key={booking?.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Bookings
              </h3>
              <p className="text-sm text-gray-500">
                No bookings found for this date
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end border-t border-gray-100 pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
