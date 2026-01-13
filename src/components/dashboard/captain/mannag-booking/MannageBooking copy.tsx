"use client";

import React, { useState } from "react";
import { Mail, AlertCircle, X } from "lucide-react";

const UpcomingTrips: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirmCancel = () => {
    // Add your cancellation logic here
    console.log("Booking cancelled");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-start gap-4">
        {/* Trip Image */}
        <div className="flex-shrink-0 h-40 w-40">
          <img
            src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop"
            alt="Ocean water"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

        {/* Trip Details */}
        <div className="flex-1 min-w-0 p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Trip title goes here
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            12th January 2025, 10:00 AM
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Florida - Meeting point: Full address for meeting point will go
            here.
          </p>
          <p className="text-sm text-gray-600">
            Group booking: 4/6 spots filled
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-start gap-3 p-4">
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Message the captain</span>
          </button>
          <button
            onClick={handleCancelClick}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 rounded-full p-3">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Modal Content */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Are You Sure You Want to Cancel This Trip?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              We will keep your deposit but you will not be charged further.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-colors"
              >
                Confirm cancellation
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingTrips;
