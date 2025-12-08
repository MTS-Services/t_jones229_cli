"use client";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";

export default function CustomerManagement({ data = [], isLoading }: any) {
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
    <div className="bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          Customer Management
        </h1>

        {/* Scrollable Container */}
        <div className="overflow-x-auto">
          {/* Customer List */}
          <div className="min-w-[700px] bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-100">
              {data?.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">
                  No customers found.
                </div>
              ) : (
                data?.user?.map((customer: any) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {customer?.fullName}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 px-4">
                      <a
                        href={
                          customer.email.includes("@")
                            ? `mailto:${customer.email}`
                            : `https://${customer.email}`
                        }
                        className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {customer.email}
                      </a>
                    </div>

                    <div className="flex-1 min-w-0 px-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {customer.phoneNumber || "N/A"}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {customer.totalTrips ?? 0} trip
                        {customer.totalTrips > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* See All Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.push("/dashboard/all-customer")}
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
