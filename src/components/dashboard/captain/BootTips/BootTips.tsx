"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import BoatInfo from "./BoatInfo";

export default function BootTips() {
  const {
    isLoading: isUserLoading,
    isFetching,
    isError: isUserError,
  } = useGetMeQuery("");

  if (isUserLoading || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

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
    <div className="">
      <BoatInfo />
    </div>
  );
}
