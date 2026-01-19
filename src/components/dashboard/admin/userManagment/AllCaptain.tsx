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
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm">
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
              {/* Added border-b border-gray-200 here to fix the last border issue */}
              <table className="min-w-full divide-y divide-gray-200 border-b border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                      Trips
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {captains?.captain?.map((captain: any) => (
                    <tr
                      key={captain.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {captain?.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {captain.phoneNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {captain.totalTrips ?? 0} trip
                          {captain.totalTrips >= 2 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/all-captain/${captain.id}`)
                          }
                          className={`flex flex-row items-center justify-center h-[28px] px-2 py-1 gap-1 rounded-[4px] text-white text-xs
                            ${captain.status === "APPROVE" ? "bg-green-600" : "bg-[#FF9500]"}`}
                        >
                          {captain.status === "APPROVE"
                            ? "Approved"
                            : "Pending Approval"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Section */}
              <div className="flex items-center justify-center pb-4 bg-white">
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