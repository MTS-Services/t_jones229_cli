"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import PaginationButton from "./PaginationButton";

export default function CustomerManagement({ data = [], isLoading }: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
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
    <>
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
                <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                    <td className="px-6 py-4 text-base">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      >
                        View Details
                      </button>
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

      {/* Modal for Customer Details */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1 hover:bg-gray-100"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedCustomer?.fullName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedCustomer?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedCustomer?.phoneNumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Total Trips
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedCustomer?.totalTrips ?? 0} trip
                      {(selectedCustomer?.totalTrips ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Add more customer details here if available */}
                  {selectedCustomer?.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Address
                      </label>
                      <p className="text-base text-gray-900">
                        {selectedCustomer.address}
                      </p>
                    </div>
                  )}

                  {selectedCustomer?.createdAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Member Since
                      </label>
                      <p className="text-base text-gray-900">
                        {new Date(
                          selectedCustomer.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add action for edit or other operations
                    console.log("Edit customer:", selectedCustomer);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                >
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
