"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetMyBoatQuery, useUpdateBoatMutation } from "@/redux/api/boatApi";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";


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

export default function BoatInfo() {
  const { data, isLoading } = useGetMyBoatQuery({});
  const [updateBoat] = useUpdateBoatMutation();
  const boat: Boat | undefined = data?.data?.[0];

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      description: "",
      manufacturer: "",
      modelYear: 0,
      guests: undefined,
    },
  });

  useEffect(() => {
    if (boat) {
      reset({
        description: boat.description || "",
        manufacturer: boat.manufacturer || "",
        modelYear: boat.modelYear || 0,
        guests: boat.guests || undefined,
      });
    }
  }, [boat, reset]);

  if (isLoading) {
    return (
      <div className="px-[24px] pt-16 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/3 mt-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-[247px] mt-6"></div>
      </div>
    );
  }

  return (
    <div className=" ">
      <form className="w-full mx-auto space-y-8">
        {/* Boat Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Boat Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Boat Type */}
            <div>
              <label className="text-textSecondary text-base md:text-lg font-normal leading-8">
                Boat Description
              </label>
              <textarea
                {...register("description", {
                  required: "Please enter short description",
                })}
                className="w-full px-3 py-2 border border-[#E0E0E0]"
                placeholder="Write a short description of your boat"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm mb-1">Manufacturer</label>
              <input
                type="text"
                {...register("manufacturer")}
                className="w-full border p-2 rounded"
                placeholder="e.g. Toyota"
              />
            </div>
          </div>
        </div>

        {/* Listing Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Listing Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Listing Type */}
            <div>
              <label className="block text-sm mb-1">Model Year</label>
              <input
                type="number"
                {...register("modelYear", {
                  valueAsNumber: true,
                })}
                className="w-full px-3 py-2 border border-[#E0E0E0]"
                placeholder="your boat model year, e.g. 2023"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm mb-1">How many guests?</label>
              <input
                type="number"
                {...register("guests", { valueAsNumber: true })}
                className="w-full border p-2 rounded"
                placeholder="Enter number of guests"
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {boat && (
          <Link href={`/boat-list-form/Information?id=${boat.id}`}>
            <div className="flex items-center gap-2 justify-center w-full sm:w-[237px] h-[44px] rounded-lg px-4 py-2 bg-[#FF9500] text-white hover:opacity-90 transition mt-5">
              Edit Boat Info
              <svg
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.0019 16.9997C10.7361 17.0012 10.4806 16.8969 10.2919 16.7097C9.89977 16.3208 9.89717 15.6876 10.2861 15.2955C10.288 15.2935 10.29 15.2916 10.2919 15.2897L13.6019 11.9997L10.4219 8.68969C10.0342 8.29965 10.0342 7.66973 10.4219 7.27968C10.8108 6.88756 11.444 6.88497 11.8361 7.27389C11.838 7.27581 11.84 7.27774 11.8419 7.27968L15.7019 11.2797C16.083 11.6685 16.083 12.2908 15.7019 12.6797L11.7019 16.6797C11.5206 16.8755 11.2686 16.9907 11.0019 16.9997Z"
                  fill="white"
                />
              </svg>
            </div>
          </Link>
        )}
      </form>
    </div>
  );
}
