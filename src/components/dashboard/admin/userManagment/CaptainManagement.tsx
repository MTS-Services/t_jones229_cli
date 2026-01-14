"use client";

import { useState } from "react";
import { TSkeleton } from "../TSkelton";
import PaginationButton from "./PaginationButton";

export default function CaptainManagement({ data = [], isLoading }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debug: Log the received data
  console.log("Received data in component:", data);
  console.log("Data type:", typeof data);
  console.log("Is array?", Array.isArray(data));
  
  // Handle different data structures
  let captainsData = [];
  
  if (data) {
    if (Array.isArray(data)) {
      // If data is already an array
      captainsData = data;
    } else if (data.captain && Array.isArray(data.captain)) {
      // If data is an object with captain property
      captainsData = data.captain;
    } else if (data.data?.captain && Array.isArray(data.data.captain)) {
      // If data is nested with data.captain
      captainsData = data.data.captain;
    }
  }
  
  console.log("Processed captainsData:", captainsData);
  console.log("captainsData length:", captainsData.length);

  const totalItems = captainsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCaptains = captainsData.slice(indexOfFirstItem, indexOfLastItem);

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

  // Add a debug message in UI
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
                  colSpan={4}
                  className="px-6 py-4 text-base text-gray-500 text-center"
                >
                  No captains found
                </td>
              </tr>
            ) : (
              currentCaptains.map((captain: any, index: number) => {
                console.log(`Captain ${index}:`, captain);
                return (
                  <tr
                    key={captain.id || captain._id || index}
                    className="hover:bg-white transition bg-white/50"
                  >
                    <td className="px-6 py-4 text-base font-medium text-gray-900">
                      {captain?.fullName || captain?.name || "N/A"}
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
                        {captain.email || "N/A"}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-base text-gray-700">
                      {captain.phoneNumber || captain.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-base text-gray-700">
                      {captain.totalTrips ?? captain.trips ?? 0} trip
                      {(captain.totalTrips ?? captain.trips ?? 0) !== 1 ? "s" : ""}
                    </td>
                  </tr>
                );
              })
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