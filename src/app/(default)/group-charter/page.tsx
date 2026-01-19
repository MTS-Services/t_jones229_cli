"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateBookingMutation } from "@/redux/api/bookingApi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/components/ui/Loader";

export default function GroupBooking() {
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTripDate(localStorage.getItem("date"));
      setLocation(localStorage.getItem("location"));
      setNumberOfGuests(localStorage.getItem("Guests"));
    }
  }, []);

  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  const router = useRouter();
  const marketingConsent = watch("marketingConsent", false);
  const boatID = params.get("boatId");
  const tripId = params.get("tripId");

  const [bookingFN, { isLoading }] = useCreateBookingMutation();

  const onSubmit = async (data: any) => {
    // --- Console Log Form Data ---
    console.log("Form Data Captured:", data);

    const groupBookingInfo = {
      boatId: boatID ?? "",
      tripId: tripId ?? "",
      tripDate: tripDate ?? "",
      amount: "full",
      bookingType: false,
      groupSize: parseInt(numberOfGuests ?? "0", 10),
      memberInfo: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        fishingType: data?.fishingType,
        targetSpecies: data?.targetSpecies, // Optional field
        details: data?.details,
      },
    };

    // --- Console Log Final Payload ---
    console.log("Sending to API:", groupBookingInfo);

    try {
      const res = await bookingFN(groupBookingInfo);
      console.log("Server Response:", res);

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Booking successful!");
        if (typeof window !== "undefined") {
          localStorage.removeItem("date");
          localStorage.removeItem("location");
          localStorage.removeItem("Guests");
        }
        router.push("/group-confirmation");
      } else {
        toast.error(res?.data?.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-20">
      <ToastContainer />
      <div className="bg-[#F5F5F5] pt-[41px] pb-[31px]">
        <div className="container mx-auto xl:px-4 lg:px-3 px-2">
          <h1 className="text-xl md:text-2xl font-bold text-[#242424] leading-9">
            {location ?? "Location not set"} / {tripDate ?? "Date not set"} /{" "}
            {numberOfGuests ?? "Guests not set"} people
          </h1>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-10 xl:px-4 lg:px-3 px-2 py-10">
        {/* ... (Instruction steps and video section remain the same) ... */}

        <div className="bg-slate-50 rounded-lg p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-textSecondary mb-2">
            Enter your details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  First name*
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.firstName ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Last name*
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.lastName ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Email address*
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Mobile number*
                </label>
                <input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phoneNumber ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Fishing Type */}
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Fishing Type*
                </label>
                <div className="relative">
                  <select
                    {...register("fishingType", {
                      required: "Please select fishing type",
                    })}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                    onChange={(e) => {
                      register("fishingType").onChange(e);
                      setIsDropdownOpen(false);
                      trigger("fishingType");
                    }}
                    className={`w-full border rounded-md p-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${errors.fishingType ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  >
                    <option value="">Select Option</option>
                    <option value="Offshore">Offshore</option>
                    <option value="Inshore">Inshore</option>
                  </select>
                  <div
                    className={`absolute right-3 top-3 pointer-events-none transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <IoIosArrowDown className="text-gray-500" size={18} />
                  </div>
                </div>
                {errors.fishingType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fishingType.message as string}
                  </p>
                )}
              </div>

              {/* Target Species (OPTIONAL) */}
              <div className="space-y-1">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Target Species
                </label>
                <input
                  {...register("targetSpecies")}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 text-[#9E9E9E]"
                  placeholder="What fish would you like to catch? (Optional)"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <label className="text-base text-start font-medium text-[#171717] block mb-1">
                Details
              </label>
              <textarea
                {...register("details")}
                className="w-full max-h-40 min-h-40 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 text-[#9E9E9E]"
                placeholder="Additional details about your fishing trip..."
              />
            </div>

            {/* Consent & Submit */}
            <div className="flex items-start space-x-3">
              <input
                id="marketing"
                type="checkbox"
                {...register("marketingConsent")}
                className="mt-1"
              />
              <label
                htmlFor="marketing"
                className="text-sm md:text-lg text-textSecondary leading-7"
              >
                By providing us with your email address, you confirm that we can
                use it to share your booking information...
              </label>
            </div>

            <button
              type="submit"
              disabled={!marketingConsent}
              className={`px-6 py-2 rounded-md font-medium text-white w-48 ${marketingConsent ? "bg-orange-400 hover:bg-orange-500" : "bg-orange-200 cursor-not-allowed"}`}
            >
              {isLoading ? <Loader /> : "Submit Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
