"use client";

import { useCancelBookingWithRefundMutation } from "@/redux/api/bookingApi";
import { RootState } from "@/redux/store/store";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

type Actor = "CUSTOMER" | "CAPTAIN" | "WEATHER" | "ADMIN";

export default function CancelTripModal({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) {
  const [cancelBookingWithRefund, { isLoading }] =
    useCancelBookingWithRefundMutation();
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isPrivileged =
    userRole === "ADMIN" ||
    userRole === "SUPER_ADMIN" ||
    userRole === "CAPTAIN";
  const [actor, setActor] = useState<Actor>(
    userRole === "CAPTAIN" ? "CAPTAIN" : "CUSTOMER",
  );

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    setError(null);
    try {
      const res: any = await cancelBookingWithRefund({
        id,
        reason: reason.trim() || undefined,
        actor: isPrivileged ? actor : "CUSTOMER",
      });
      if (res?.error) {
        const msg = res.error?.data?.message ?? "Failed to cancel the trip.";
        setError(msg);
        return;
      }
      onClose();
      router.back();
    } catch (err: any) {
      setError(
        err?.data?.message ?? "Failed to cancel the trip. Please try again.",
      );
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <Trash2 size={25} className="mx-auto mb-4 text-red-500" />
        <h2 className="text-lg font-semibold mb-2">
          Are You Sure You Want to Cancel This Trip?
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Refund depends on how close to the trip date you cancel. 7+ days early
          refunds the full deposit; closer to the trip date a partial refund
          applies.
        </p>

        {isPrivileged && (
          <div className="mb-3 text-left">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cancellation reason actor
            </label>
            <select
              value={actor}
              onChange={(e) => setActor(e.target.value as Actor)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="CAPTAIN">Captain</option>
              <option value="WEATHER">Weather</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}

        <div className="mb-3 text-left">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us briefly why you're cancelling..."
            rows={3}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirmCancel}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Confirm"}
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
