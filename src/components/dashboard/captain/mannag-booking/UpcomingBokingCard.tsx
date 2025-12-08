"use client";

// components/TripCard.tsx
import EmailIcon from "@/components/icon/EmailIcon";
import Image from "next/image";
import { useState } from "react";
import CancelBookModal from "../../modal/CancelBookModal";
import { TripsBookProps } from "@/types/tripsTypes";
import EmailModal from "../../modal/SendEmailModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export default function UpcomingBokingCard({
  tripDate,
  bookingType,
  member,
  trip,
  boat,
  id,
  userId,
  status,
}: TripsBookProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <>
      <CancelBookModal isOpen={isModalOpen} id={id} onClose={closeModal} />

      <div className="flex flex-col md:flex-row bg-e md:h-[200px] items-center h-[460px] rounded-md shadow-lg">
        <div className="sm:w-[339px] w-[239px] h-[200px] relative  rounded-l-md">
          <Image
            src={boat?.photos?.[0]?.url}
            alt="trip image"
            fill
            className="rounded-l-md"
          />
        </div>
        <div className="w-full flex flex-col justify-center p-4">
          <div>
            <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
              <div>
                <h2 className="text-lg font-semibold">{trip?.tripName}</h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <EmailModal
                    reciverId={
                      userRole === "CAPTAIN" ? userId : boat?.captain?.id
                    }
                  />
                  {/* <h1>Email the captain</h1> */}
                  <EmailIcon />
                </div>

                {status === "CANCEL" ? (
                  <button className="w-auto h-8 px-2 flex items-center gap-1 rounded-[14px] opacity-80 bg-[#FF0000] text-white hover:opacity-100 transition">
                    cancel booking
                  </button>
                ) : (
                  <button
                    onClick={openModal}
                    id={id}
                    className="w-auto h-8 px-2 flex items-center gap-1 rounded-[14px]  bg-[#ffaa33] text-white hover:opacity-100 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-sm text-gray-500 mt-2">{tripDate}</h1>
              <h1 className="text-sm text-gray-500 mt-2">
                {tripDate &&
                  new Date(tripDate).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "UTC",
                  })}
              </h1>
              {bookingType === "PRIVATE" ? (
                <h1 className="text-sm text-gray-500 mt-2">
                  {bookingType} booking
                </h1>
              ) : (
                <h1 className="text-sm text-gray-500 mt-2">
                  {bookingType} booking {member} members
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
