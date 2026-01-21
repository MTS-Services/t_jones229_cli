"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAllUserQuery } from "@/redux/api/authApi";
import { TSkeleton } from "../TSkelton";
import PaginationButton from "./PaginationButton";

export default function AllCustomer() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // RTK Query call
  const { data, isLoading } = useAllUserQuery({
    roles: ["USER"],
    limit,
    page,
  });

  const customers = data?.data?.data?.user || [];
  const totalPages = data?.data?.meta?.totalPage || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100 p-6 bg-white">
        {Array.from({ length: 10 }).map((_, i) => (
          <TSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="w-full mx-auto">
        <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Total Trips
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 bg-white"
                  >
                    No customers found in the database.
                  </td>
                </tr>
              ) : (
                customers.map((customer: any) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-blue-50/30 transition-colors bg-white"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {customer.fullName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={
                          customer.email?.includes("@")
                            ? `mailto:${customer.email}`
                            : "#"
                        }
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors break-all"
                      >
                        {customer.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {customer.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {customer._count?.booking ?? 0} Trip
                        {(customer._count?.booking ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 pl-10 text-sm">
                      <Link
                        href={`/dashboard/all-customer/${customer.id}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
                      >
                        <Eye
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Section */}
          <div className="flex items-center justify-center py-6 border-t border-gray-100 bg-white">
            <PaginationButton
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
