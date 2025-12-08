"use client";

import ChargeEnable from "@/components/ReUsible/ChargeEnable";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useUpdateChargeEnabledMutation } from "@/redux/api/userDashboardApi/userBooking";
import { useEffect, useState } from "react";
import BoatInfo from "./BoatInfo";

export default function BootTips() {
  const [chargeStatusChecked, setChargeStatusChecked] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const {
    data: userInfo,
    isLoading: isUserLoading,
    isFetching,
    isError: isUserError,
  } = useGetMeQuery("");

  const [
    updateChargeEnabled,
    { isLoading: isUpdateLoading, isError: isUpdateError },
  ] = useUpdateChargeEnabledMutation();

  useEffect(() => {
    // Check if user data is available
    if (userInfo) {
      // If charge is already enabled, show the BoatInfo immediately
      if (userInfo.operation?.chargeEnable) {
        setChargeStatusChecked(true);
        return;
      }

      // If charge is not enabled, try to update it
      if (!userInfo.operation?.chargeEnable && userInfo.data?.accountId) {
        const updateChargeStatus = async () => {
          try {
            await updateChargeEnabled(userInfo.data.accountId).unwrap();
            setChargeStatusChecked(true);
          } catch (error: any) {
            console.error("Failed to update charge status:", error);
            setUpdateError(
              error.data?.message ||
                "Failed to enable payment capabilities. Please try again later."
            );
            // Still show the BoatInfo even if update failed
            setChargeStatusChecked(true);
          }
        };

        updateChargeStatus();
      } else {
        // If no accountId is available, still show the BoatInfo
        setChargeStatusChecked(true);
      }
    }
  }, [userInfo, updateChargeEnabled]);

  // Show loading state while checking user data or updating charge status
  if (isUserLoading || isFetching || isUpdateLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Checking your payment status...</p>
      </div>
    );
  }

  // Show error state if user data fetching failed
  if (isUserError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-medium">Error loading user data</h3>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Boat Information</h1>
        <p className="text-gray-600 mt-2">
          Manage your boat details and payment settings
        </p>
      </div>

      {/* Status indicators */}
      {userInfo?.data?.chargeEnable === true ? null : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-red-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Status
          </h2>

          {userInfo?.operation?.chargeEnable ? (
            <div className="flex items-center text-green-600">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Charges are enabled for your account</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center text-yellow-600 mb-2">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                <span>Payment capabilities not yet enabled</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You can still manage your boat information, but you won't be
                able to receive payments until verification is complete.
              </p>
            </div>
          )}

          {isUpdateError && (
            <div className="mt-4 p-3 bg-red-50 rounded-md">
              <div className="flex items-center text-red-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{updateError || "Error updating payment status"}</span>
              </div>
            </div>
          )}

          {<ChargeEnable />}
        </div>
      )}

      {/* Show BoatInfo only after charge status has been checked */}
      {chargeStatusChecked && <BoatInfo />}
    </div>
  );
}
