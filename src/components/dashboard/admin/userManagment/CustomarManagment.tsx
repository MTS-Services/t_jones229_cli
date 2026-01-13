"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";
import { FaArrowRight } from "react-icons/fa";
import PaginationButton from "./PaginationButton";

export default function CustomerManagement({ data = [], isLoading }: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users = data?.user || [];
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
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
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-base text-gray-500 text-center bg-white"
                >
                  No user found
                </td>
              </tr>
            ) : (
              currentUsers.map((customer: any) => (
                <tr
                  key={customer.id}
                  className="hover:bg-white transition bg-white/50"
                >
                  <td className="px-6 py-4 text-base font-medium text-gray-900">
                    {customer?.fullName}
                  </td>

                  <td className="px-6 py-4 text-base">
                    <a
                      href={
                        customer.email?.includes("@")
                          ? `mailto:${customer.email}`
                          : `https://${customer.email}`
                      }
                      className="text-blue-600 hover:underline break-all"
                    >
                      {customer.email}
                    </a>
                  </td>

                  <td className="px-6 py-4 text-base text-gray-700">
                    {customer.phoneNumber || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-base text-gray-700">
                    {customer.totalTrips ?? 0} trip
                    {(customer.totalTrips ?? 0) !== 1 ? "s" : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {users.length > itemsPerPage && (
          <div className="flex items-center justify-center py-4 border-t border-gray-100 bg-white">
            <PaginationButton
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
