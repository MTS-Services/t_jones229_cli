"use client";

import { useCancelBookingMutation } from "@/redux/api/bookingApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelBookModal({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    setError(null); // reset any previous error
    try {
      await cancelBooking(id).unwrap();
      onClose();
      router.back();
    } catch (err: any) {
      setError("Failed to cancel the trip. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="text-orange-500 mb-3 text-4xl">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">
          Are You Sure You Want to Cancel This Trip?
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Cancelling this trip will free up your reserved spot(s). We won’t
          charge you anymore for this cancellation.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirmCancel}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Confirm cancellation"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
