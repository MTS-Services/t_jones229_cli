import React from "react";

export default function BookingCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72 h-52 lg:h-auto bg-gray-200" />
        <div className="flex-1 p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
