"use client";

import Image from "next/image";
import dolphine from "@/assets/placeholder.webp";
import clock from "@/assets/icon/clock.svg";
import men from "@/assets/icon/men.svg";
import { IoLocationOutline } from "react-icons/io5";
import { useDeleteTripMutation } from "@/redux/api/boatApi";
import Swal from "sweetalert2";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

type TripProps = {
  trip: {
    id: string;
    price: string;
    description: string;
    features: string[];
    duration: string;
    bookingType: string;
    tripName: string;
    fishingLocation: string[];
  };
  image?: string; // optional image URL
  guest: number;
  location?: string;
};

export default function TripCard({ trip, image, guest, location }: TripProps) {
  const hasValidImage = image && image.startsWith("http");

  const [deleteTrip] = useDeleteTripMutation();
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this trip!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteTrip(id);
        if (res?.data?.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your trip has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 lg:gap-8 md:gap-6 gap-6 bg-white md:h-[260px] h-auto rounded-xl shadow p-4 items-stretch">
      {/* Column 1: Image - Spans 1 column */}
      <div className="w-full md:col-span-1 md:h-full h-[230px] relative rounded-lg overflow-hidden">
        {hasValidImage ? (
          <Image
            src={image as string}
            alt="boat image"
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={dolphine}
            alt="default image"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Column 2 & 3: Content - Spans 2 columns and pushes content to bottom */}
      <div className="w-full md:col-span-2 flex flex-col justify-between md:pl-4">
        {/* TOP SECTION: Name, Price, and Description */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="flex-1 sm:text-lg text-[24px] font-semibold">
              {trip?.tripName}
            </h2>

            <div className="flex flex-col justify-end items-end gap-1.5 w-full md:w-72">
              <p className="text-[#9E9E9E] text-base font-normal leading-7 flex items-center gap-1">
                <IoLocationOutline className="text-[#FF9500] h-6 w-6 font-bold" />
                {location}
              </p>
              <p className="font-bold text-gray-800">Price: {trip?.price}</p>
            </div>
          </div>
          <p className="text-base text-[#878787] mt-2 line-clamp-2">
            {trip?.description}
          </p>
        </div>

        {/* BOTTOM SECTION: Key Features and Buttons - Always stays at the bottom */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center md:items-end mt-4">
          <div className="">
            <p className="font-semibold mb-2">Key features:</p>
            <div className="flex flex-wrap sm:flex-row w-full items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={clock}
                  alt={"doller"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                {trip.bookingType} Group
              </div>

              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={clock}
                  alt={"clock"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                {trip.duration} Hours
              </div>

              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={men}
                  alt={"men"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                Up to {guest} people
              </div>
            </div>
          </div>

          <div className="flex md:flex-col xl:flex-row items-center md:gap-5 gap-3">
            <Link
              href={`/dashboard/edit-trip?id=${trip?.id}`}
              className="bg-[#FF9500] flex items-center gap-4 text-white text-base rounded-lg py-3 px-5 text-center  font-medium font-shatosi hover:bg-[#E08500] transition-colors duration-300 ease-in-ou"
            >
              Edit Trip
              <MdOutlineKeyboardArrowRight className="w-6 h-6" />
            </Link>
            <button
              onClick={() => handleDelete(trip?.id)}
              className="bg-[#FF9500] flex items-center gap-4 text-white text-base rounded-lg py-3 px-5 text-center  font-medium font-shatosi hover:bg-[#E08500] transition-colors duration-300 ease-in-ou"
            >
              Delete Trip
              <MdOutlineKeyboardArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
