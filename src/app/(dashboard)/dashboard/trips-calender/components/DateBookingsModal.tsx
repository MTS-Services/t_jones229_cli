"use client";

import { X, CalendarIcon } from "lucide-react";
import { Booking, AvailabilityBlock } from "../types/types";
import { BookingCard } from "./BookingCard";
import BlockAvailabilityForm from "@/components/availability/BlockAvailabilityForm";
import AvailabilityBlocksList from "@/components/availability/AvailabilityBlocksList";

interface DateBookingsModalProps {
  selectedDate: string | null;
  bookings: Booking[];
  blocks?: AvailabilityBlock[];
  onClose: () => void;
  onRefresh?: () => void;
}

export default function DateBookingsModal({
  selectedDate,
  bookings,
  blocks = [],
  onClose,
  onRefresh,
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:rounded-2xl sm:max-w-4xl sm:max-h-[90vh] max-h-[85dvh] rounded-t-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#035292] to-blue-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/15 rounded-xl">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-white">
                {formattedDate}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                {blocks.length > 0 && ` · ${blocks.length} blocked`}
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
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <AvailabilityBlocksList blocks={blocks} onDeleted={onRefresh} />

          {bookings.length > 0 ? (
            <div>
              {bookings.map((booking) => (
                <BookingCard key={booking?.id} booking={booking} />
              ))}
            </div>
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Bookings
              </h3>
              <p className="text-sm text-gray-500">
                No bookings found for this date
              </p>
            </div>
          ) : null}

          {selectedDate && (
            <BlockAvailabilityForm
              date={selectedDate}
              onSuccess={onRefresh}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-5 flex justify-end border-t border-gray-100 pt-3 sm:pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
