"use client";

import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";

export default function CaptainManagement({ data = [], isLoading }: any) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 10 }).map((_, i) => (
          <TSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-5 bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          Captain Management
        </h1>

        {/* Captain List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-100">
            {data?.captain?.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">
                No captains found.
              </div>
            ) : (
              data?.captain?.map((captain: any) => (
                <div
                  key={captain.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {captain?.fullName}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 px-4">
                    <a
                      href={
                        captain.email.includes("@")
                          ? `mailto:${captain.email}`
                          : `https://${captain.email}`
                      }
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {captain.email}
                    </a>
                  </div>

                  <div className="flex-1 min-w-0 px-4">
                    <div className="text-sm text-gray-900">
                      {captain.phoneNumber || "N/A"}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="text-sm text-gray-900">
                      {captain.totalTrips ?? 0} trip
                      {captain.totalTrips > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* See All Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.push("/dashboard/all-captain")}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            See all
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
