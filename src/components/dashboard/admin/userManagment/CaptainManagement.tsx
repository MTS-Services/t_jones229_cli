"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";
import PaginationButton from "./PaginationButton";

function MobileCaptainsView({ captains, itemsPerPage = 6 }: any) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((captains?.length || 0) / itemsPerPage));

  const start = (page - 1) * itemsPerPage;
  const pageCaptains = (captains || []).slice(start, start + itemsPerPage);

  const prev = () => setPage((p: number) => Math.max(1, p - 1));
  const next = () => setPage((p: number) => Math.min(totalPages, p + 1));

  if (!captains || captains.length === 0) return null;

  return (
    <div className="block md:hidden py-10 ">
      <div className="space-y-3">
        {pageCaptains.map((captain: any, idx: number) => (
          <div key={captain.id || idx} className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">{captain?.fullName || "Unknown"}</div>
                <div className="text-base text-gray-500 mt-1 break-words">{captain.email || "No Email"}</div>
                <div className="text-base text-gray-500 mt-1">{captain.phoneNumber || "N/A"}</div>
              </div>
              <div className="text-right">
                <div className="text-base text-gray-700">{captain.totalTrips ?? 0} trip{captain.totalTrips !== 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button onClick={prev} disabled={page === 1} className="px-3 py-1 rounded-md bg-gray-100 text-sm disabled:opacity-50">Prev</button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-md text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{i + 1}</button>
          ))}
        </div>
        <button onClick={next} disabled={page === totalPages} className="px-3 py-1 rounded-md bg-gray-100 text-sm disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

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
      <div className="bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm">
        {/* Desktop table (unchanged) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                {/* Name */}
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
        </div>

        {/* Mobile: card layout + mobile-only pagination */}
        <MobileCaptainsView captains={captains} itemsPerPage={6} />

        <div className="bg-white">
          {/* See All Button */}
    
          {/* Pagination Section */}
          {captains.length > itemsPerPage && (
            <div className="hidden md:flex items-center justify-center pb-4 border-t border-gray-100">
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
