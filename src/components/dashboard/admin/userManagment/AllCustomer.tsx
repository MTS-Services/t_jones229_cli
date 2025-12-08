"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useAllUserQuery } from "@/redux/api/authApi";
import { useState } from "react";
import { Pagination } from "../button/Pagination";
import { TSkeleton } from "../TSkelton";

export default function AllCustomer() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useAllUserQuery({
    roles: ["USER"],
    limit,
    page,
  });

  const customers = data?.data?.data || [];
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
          Customer Management
        </h1>

        {/* Scrollable wrapper */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-white rounded-lg shadow-sm">
            {isLoading ? (
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 10 }).map((_, i) => (
                  <TSkeleton key={i} />
                ))}
              </div>
            ) : customers?.user?.length === 0 ? (
              <div className="p-6 text-gray-500">No customers found.</div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {customers?.user?.map((customer: any) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {customer.fullName || "Unknown"}
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

                      <div className="flex-1">
                        <div className="text-sm text-gray-900 whitespace-nowrap">
                          {customer._count?.booking ?? 0} trip
                          {customer._count?.booking === 1 ? "" : "s"}
                        </div>
                      </div>

                      <div className="flex-1">
                        <Link href={`/dashboard/all-customer/${customer.id}`}>
                          <Eye className="text-gray-600 hover:text-gray-900 cursor-pointer" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

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
    </div>
  );
}
