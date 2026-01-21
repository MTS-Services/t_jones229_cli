"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";
import PaginationButton from "./PaginationButton";

export default function CaptainManagement({ data = [], isLoading }: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  // Note: setSelectedCustomer and showModal are defined but not used in the JSX below.
  // I kept them so your logic remains intact if you plan to add a modal later.
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  // Safely access captains array
  const captains = data?.captain || [];
  const totalPages = Math.ceil(captains.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentCaptains = captains.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 7 }).map((_, i) => (
          <TSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
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
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentCaptains.length === 0 ? (
              <tr>
                <td
                  colSpan={4} // Adjusted to 4 to match your header columns
                  className="px-6 py-4 text-base text-gray-500 text-center bg-white"
                >
                  No captains found
                </td>
              </tr>
            ) : (
              currentCaptains.map((captain: any, index: number) => (
                <tr
                  key={captain.id || index}
                  className="hover:bg-white transition bg-white/50"
                >
                  <td className="px-6 py-4 text-base font-medium text-gray-900">
                    {captain?.fullName || "Unknown"}
                  </td>

                  <td className="px-6 py-4 text-base">
                    {captain.email ? (
                      <a
                        href={`mailto:${captain.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {captain.email}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No Email</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-base text-gray-700">
                    {captain.phoneNumber || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-base text-gray-700">
                    {captain.totalTrips ?? 0} trip
                    {captain.totalTrips !== 1 ? "s" : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="bg-white">
          {/* See All Button */}
          <div className="flex justify-end p-4">
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

          {/* Pagination Section */}
          {captains.length > itemsPerPage && (
            <div className="flex items-center justify-center pb-4 border-t border-gray-100">
              <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
