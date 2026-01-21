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
  const [waitlistStatus, setWaitlistStatus] = useState<string>("none");

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
    setWaitlistStatus(customer?.waitlistStatus || "none");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setWaitlistStatus("none");
  };

  const handleWaitlistToggle = () => {
    if (waitlistStatus === "none" || waitlistStatus === "pending") {
      setWaitlistStatus("active");
      console.log("User added to active waitlist:", selectedCustomer);
      // API call here: updateUserWaitlistStatus(selectedCustomer.id, "active")
    } else {
      setWaitlistStatus("pending");
      console.log("User moved to pending waitlist:", selectedCustomer);
      // API call here: updateUserWaitlistStatus(selectedCustomer.id, "pending")
    }
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

          <div className="">
            {/* See All Button */}
            <div className="flex justify-end my-4">
              <button
                onClick={() => router.push("/dashboard/all-customer")}
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

            <div>
              {users.length > itemsPerPage && (
                <div className="flex items-center justify-center pb-4 border-t border-gray-100 bg-white">
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
      </div>

      {/* Modal for Customer Details */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Customer Activity</h3>
                <p className="text-blue-100 text-sm">
                  Review customer profile and status
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Timeline/Waitlist Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* List Items */}
                <div className="space-y-8">
                  {/* Item 1: Basic Info */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 w-8 h-8 bg-blue-100 border-2 border-blue-600 rounded-full flex items-center justify-center z-10">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Personal Identity
                      </h4>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Name:
                          </span>{" "}
                          {selectedCustomer.fullName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-800">
                            Email:
                          </span>{" "}
                          {selectedCustomer.email}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-800">
                            Phone:
                          </span>{" "}
                          {selectedCustomer.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Activity Stats */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 w-8 h-8 bg-green-100 border-2 border-green-600 rounded-full flex items-center justify-center z-10">
                      <span className="text-green-600 text-xs font-bold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Travel History
                      </h4>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100">
                          <span className="text-green-700 font-bold text-lg">
                            {selectedCustomer.totalTrips || 0}
                          </span>
                          <span className="text-green-600 text-sm ml-1">
                            Total Trips
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Active since{" "}
                          {new Date(
                            selectedCustomer.createdAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Account Status */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 w-8 h-8 bg-purple-100 border-2 border-purple-600 rounded-full flex items-center justify-center z-10">
                      <span className="text-purple-600 text-xs font-bold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        System Status
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <span className="flex h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                          <p className="text-sm font-medium text-gray-700">
                            Account Verified & Active
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`flex h-3 w-3 rounded-full mr-2 ${
                              waitlistStatus === "active"
                                ? "bg-green-500"
                                : waitlistStatus === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-gray-300"
                            }`}
                          ></span>
                          <p className="text-sm font-medium text-gray-700">
                            Waitlist Status:{" "}
                            <span className="capitalize font-semibold">
                              {waitlistStatus}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 4: Description */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 w-8 h-8 bg-yellow-100 border-2 border-yellow-600 rounded-full flex items-center justify-center z-10">
                      <span className="text-yellow-600 text-xs font-bold">
                        4
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Management Overview
                      </h4>
                      <div className="mt-2 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          User management is the process of controlling digital
                          identities and access for individuals to an
                          organization's systems, applications, and data,
                          involving account creation, authentication, defining
                          permissions, monitoring activity, and offboarding.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Waitlist Management
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        waitlistStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : waitlistStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {waitlistStatus}
                    </span>
                  </div>
                  <button
                    onClick={handleWaitlistToggle}
                    className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                      waitlistStatus === "active"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    }`}
                  >
                    {waitlistStatus === "active" ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Move to Pending
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Activate Waitlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
