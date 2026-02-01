"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TSkeleton } from "../TSkelton";
import { FaArrowRight } from "react-icons/fa";
import CustomerDetailsModal from "./CustomerDetailsModal";
import PaginationButton from "./PaginationButton";

function MobileUsersView({ users, itemsPerPage = 5, onView }: any) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((users?.length || 0) / itemsPerPage));

  const start = (page - 1) * itemsPerPage;
  const pageUsers = (users || []).slice(start, start + itemsPerPage);

  const prev = () => setPage((p: number) => Math.max(1, p - 1));
  const next = () => setPage((p: number) => Math.min(totalPages, p + 1));

  if (!users || users.length === 0) return null;

  return (
    <div className="block md:hidden py-10">
      <div className="space-y-3">
        {pageUsers.map((u: any) => (
          <div key={u.id} className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">{u.fullName}</div>
                <div className="text-base text-gray-500 mt-1 break-words">{u.email}</div>
                <div className="text-base text-gray-500 mt-1">{u.phoneNumber || 'N/A'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-700">{u.totalTrips ?? 0} trip{(u.totalTrips ?? 0) !== 1 ? 's' : ''}</div>
                <button onClick={() => onView(u)} className="mt-3 text-blue-600 text-sm">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button onClick={prev} disabled={page === 1} className="px-3 py-1 rounded-md bg-gray-100 text-sm disabled:opacity-50">Prev</button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-md text-sm ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{i + 1}</button>
          ))}
        </div>
        <button onClick={next} disabled={page === totalPages} className="px-3 py-1 rounded-md bg-gray-100 text-sm disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

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
        <div className="bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm">
          {/* Desktop table (unchanged) */}
          <div className="hidden md:block overflow-x-auto">
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
          </div>

          {/* Mobile: card layout + mobile-only pagination */}
          <MobileUsersView users={users} itemsPerPage={5} onView={handleViewDetails} />

          <div className="">
     

            <div>
              {users.length > itemsPerPage && (
                <div className="hidden md:flex items-center justify-center pb-4 border-t border-gray-100 bg-white">
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

      <CustomerDetailsModal
        isOpen={showModal}
        customer={selectedCustomer}
        waitlistStatus={waitlistStatus}
        onClose={handleCloseModal}
        onToggleWaitlist={handleWaitlistToggle}
      />
    </>
  );
}
