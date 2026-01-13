"use client";

import { useState } from "react";
import { TSkeleton } from "../TSkelton";
import PaginationButton from "./PaginationButton";

const DUMMY_CAPTAINS = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  fullName: `Captain ${i + 1}`,
  email: `captain${i + 1}@example.com`,
  phoneNumber: `+88017000000${i}`,
  totalTrips: Math.floor(Math.random() * 20),
}));

export default function CaptainManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const isLoading = false;

  const totalItems = DUMMY_CAPTAINS.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCaptains = DUMMY_CAPTAINS.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <TSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">

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
                  colSpan={4}
                  className="px-6 py-4 text-base text-gray-500 text-center"
                >
                  No captains found
                </td>
              </tr>
            ) : (
              currentCaptains.map((captain: any) => (
                <tr
                  key={captain.id}
                  className="hover:bg-white transition bg-white/50"
                >
                  <td className="px-6 py-4 text-base font-medium text-gray-900">
                    {captain?.fullName}
                  </td>
                  <td className="px-6 py-4 text-base">
                    <a
                      href={
                        captain.email?.includes("@")
                          ? `mailto:${captain.email}`
                          : `https://${captain.email}`
                      }
                      className="text-blue-600 hover:underline break-all"
                    >
                      {captain.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700">
                    {captain.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-700">
                    {captain.totalTrips ?? 0} trip
                    {(captain.totalTrips ?? 0) !== 1 ? "s" : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-center py-4 border-t border-gray-100 bg-white">
          <PaginationButton
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
