"use client";

import { useAllUserQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "../button/Pagination";
import { TSkeleton } from "../TSkelton";

export default function AllCaptain() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useAllUserQuery({
    roles: ["CAPTAIN"],
    limit,
    page,
  });

  const captains = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPage || 1;



  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };
  return (
    <div className="pt-5 bg-gray-50 p-6">
      <div className="mx-auto">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          Captain Management
        </h1>

        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 10 }).map((_, i) => (
                <TSkeleton key={i} />
              ))}
            </div>
          ) : captains?.captain?.length === 0 ? (
            <div className="p-6 text-gray-500">No captains found.</div>
          ) : (
            <>
              {captains?.captain?.map((captain: any) => (
                <div
                  key={captain.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition-colors"
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

                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      {captain.totalTrips ?? 0} trip
                      {captain.totalTrips >= 2 ? "s" : ""}
                    </div>
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/all-captain/${captain.id}`)
                      }
                      className={`flex flex-row items-center justify-center h-[28px] px-2 py-1 gap-1 rounded-[4px] text-white
          ${captain.status === "APPROVE" ? "bg-green-600" : "bg-[#FF9500]"}`}
                    >
                      {captain.status === "APPROVE"
                        ? "Approved"
                        : "Pending Approval"}
                    </button>
                  </div>
                </div>
              ))}

              <div className="py-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
