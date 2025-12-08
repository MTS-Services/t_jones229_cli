/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useDeleteUserMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function DeleteUserModal({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) {
  const [DeleteUser, { isLoading }] = useDeleteUserMutation();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    setError(null); // reset any previous error
    try {
      const res = await DeleteUser(id).unwrap();
      router.back();

      if (res?.success) {
      }
      toast.success("User deleted successfully");
      onClose();
    } catch (err: any) {
      setError("Failed to cancel the trip. Please try again.");
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
          <div className="text-orange-500 mb-3 text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">
            Are You Sure You Want to delete This User?
          </h2>

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
    </>
  );
}
