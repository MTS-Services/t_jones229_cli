"use client";

import { useGetMyBoatQuery, useUpdateBoatMutation } from "@/redux/api/boatApi";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

// Types
type Boat = {
  id: string;
  description: string;
  manufacturer: string;
  modelYear: number;
  guests?: number;
};

type FormValues = {
  description: string;
  manufacturer: string;
  modelYear: number;
  guests?: number;
};

// --- Dropdown Data ---
const boatTypes = [
  { id: "30ft Sportfishing boat", label: "30ft Sportfishing boat" },
  { id: "40ft Luxury Yacht", label: "40ft Luxury Yacht" },
  { id: "25ft Center Console", label: "25ft Center Console" },
  { id: "Speedboat", label: "Speedboat" },
  { id: "Catamaran", label: "Catamaran" },
];

const listingCategories = [
  { id: 2024, label: "Fishing Boat" },
  { id: 2023, label: "Cruising Yacht" },
  { id: 2022, label: "Party Boat" },
  { id: 2021, label: "Sailing Vessel" },
];

export default function BoatInfo() {
  const { data, isLoading } = useGetMyBoatQuery({});
  const [updateBoat] = useUpdateBoatMutation();
  const boat: Boat | undefined = data?.data?.[0];

  // Dropdown States
  const [isBoatTypeOpen, setIsBoatTypeOpen] = useState(false);
  const [isListingTypeOpen, setIsListingTypeOpen] = useState(false);
  const boatTypeRef = useRef<HTMLDivElement>(null);
  const listingTypeRef = useRef<HTMLDivElement>(null);

  const { register, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      description: "30ft Sportfishing boat", // Set default value here
      manufacturer: "",
      modelYear: 0,
      guests: undefined,
    },
  });

  const selectedBoatType = watch("description");
  const selectedListingType = watch("modelYear");

  // Sync data with form when API data arrives
  useEffect(() => {
    if (boat) {
      reset({
        description: boat.description || "30ft Sportfishing boat",
        manufacturer: boat.manufacturer || "",
        modelYear: boat.modelYear || 0,
        guests: boat.guests || undefined,
      });
    }
  }, [boat, reset]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boatTypeRef.current &&
        !boatTypeRef.current.contains(event.target as Node)
      ) {
        setIsBoatTypeOpen(false);
      }
      if (
        listingTypeRef.current &&
        !listingTypeRef.current.contains(event.target as Node)
      ) {
        setIsListingTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputStyles =
    "w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all mt-2 bg-white text-left flex items-center justify-between";

  if (isLoading) {
    return (
      <div className="p-10 animate-pulse bg-gray-100 rounded-xl h-96"></div>
    );
  }

  return (
    <div className=" ">
      <form className="w-full mx-auto space-y-8">
        {/* Boat Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-2">
            Boat Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Boat Type Dropdown */}
            <div className="relative" ref={boatTypeRef}>
              <label className="block text-base font-medium text-gray-600">
                Boat type
              </label>
              <button
                type="button"
                onClick={() => setIsBoatTypeOpen(!isBoatTypeOpen)}
                className={inputStyles}
              >
                <span
                  className={
                    selectedBoatType ? "text-gray-900" : "text-gray-300"
                  }
                >
                  {selectedBoatType || "30ft Sportfishing boat"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isBoatTypeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isBoatTypeOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                  {boatTypes.map((type) => (
                    <div
                      key={type.id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors border-b last:border-none border-gray-50"
                      onClick={() => {
                        setValue("description", type.id);
                        setIsBoatTypeOpen(false);
                      }}
                    >
                      {type.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-base font-medium text-gray-600 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                {...register("manufacturer")}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                placeholder="e.g. Toyota"
              />
            </div>
          </div>
        </div>

        {/* Listing Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-2">
            Listing Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Listing Type Dropdown */}
            <div className="relative" ref={listingTypeRef}>
              <label className="block text-base font-medium text-gray-600">
                What type of listing do you have
              </label>
              <button
                type="button"
                onClick={() => setIsListingTypeOpen(!isListingTypeOpen)}
                className={inputStyles}
              >
                <span
                  className={
                    selectedListingType ? "text-gray-900" : "text-gray-300"
                  }
                >
                  {selectedListingType
                    ? listingCategories.find(
                        (l) => l.id === selectedListingType
                      )?.label
                    : "Choose boat"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isListingTypeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isListingTypeOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                  {listingCategories.map((list) => (
                    <div
                      key={list.id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors border-b last:border-none border-gray-50"
                      onClick={() => {
                        setValue("modelYear", list.id);
                        setIsListingTypeOpen(false);
                      }}
                    >
                      {list.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guests */}
            <div>
              <label className="block text-base font-medium text-gray-600 mb-2">
                How many guests?
              </label>
              <input
                type="number"
                {...register("guests", { valueAsNumber: true })}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                placeholder="Enter number of guests"
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>

        {/* Submit Link */}
        {boat && (
          <div>
            <Link
              className="inline-block w-fit"
              href={`/boat-list-form/Information?id=${boat.id}`}
            >
              <button className="flex items-center gap-1.5 justify-center w-full sm:w-[180px] h-[44px] rounded-lg px-4 py-2 bg-[#0f5e9e] text-white hover:opacity-90 transition mt-5 cursor-pointer">
                Edit Boat Info
                <MdOutlineKeyboardArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
