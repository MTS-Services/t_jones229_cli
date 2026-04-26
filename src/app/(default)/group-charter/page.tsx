"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateBookingMutation } from "@/redux/api/bookingApi";
import { toast, ToastContainer } from "react-toastify";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { formatDisplayDate } from "../search-charter/[id]/utils";

const steps = [
  {
    id: 1,
    title: "Create Your Free Account",
    description: "Sign up or log in to get started.",
  },
  {
    id: 2,
    title: "Choose Your Fishing Style",
    description: "Select Offshore or Inshore and your target species.",
  },
  {
    id: 3,
    title: "Get Matched",
    description: "We connect you with anglers planning the same trip.",
  },
  {
    id: 4,
    title: "Confirm & Go Fishing",
    description:
      "Receive trip details by email and confirm securely. Full refund if cancelled.",
  },
];

export default function GroupBooking() {
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const params = useSearchParams();

  useEffect(() => {
    const urlLocation = params.get("location");
    const urlDate = params.get("date");
    const urlGuests = params.get("guests");

    if (urlLocation || urlDate || urlGuests) {
      setLocation(urlLocation);
      setTripDate(urlDate);
      setNumberOfGuests(urlGuests);
    } else if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("searchData");
        if (raw) {
          const parsed = JSON.parse(raw);
          setTripDate(parsed?.date ?? null);
          setLocation(parsed?.location ?? null);
          setNumberOfGuests(
            parsed?.guests != null ? String(parsed.guests) : null,
          );
        }
      } catch (err) {
        console.error("Failed to parse searchData from localStorage", err);
      }
    }
  }, [params]);
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
    console.log("=== Form submission started ===");

    // Validate required fields
    if (
      !data.firstName?.trim() ||
      !data.lastName?.trim() ||
      !data.email?.trim() ||
      !data.phoneNumber?.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const groupBookingInfo = {
      boatId: boatID || null,
      tripId: tripId || null,
      tripDate: tripDate || new Date().toISOString().split("T")[0],
      amount: "full",
      bookingType: false,
      groupSize: parseInt(numberOfGuests ?? "1", 10) || 1,
      memberInfo: {
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
        email: data.email?.trim() || "",
        phoneNumber: data.phoneNumber?.trim() || "",
        fishingType: data.fishingType || null,
        targetSpecies: data.targetSpecies?.trim() || null,
        details:
          data.details?.trim() ||
          `Group charter inquiry for ${location || "unspecified location"} on ${tripDate || "flexible date"}`,
      },
      where: location || "Location not specified",
      date: tripDate || new Date().toISOString().split("T")[0],
    };

    try {
      const res: any = await bookingFN(groupBookingInfo);

      console.log("Booking API Response:", res); // Debug log

      if (res?.data?.success) {
        // Try multiple paths for success message
        const successMessage =
          res?.data?.message ||
          res?.data?.data?.message ||
          "Group booking inquiry submitted successfully!";
        toast.success(successMessage);
        if (typeof window !== "undefined") {
          localStorage.removeItem("searchData");
        }
        router.push("/group-confirmation");
      } else if (res?.error) {
        // Better error message extraction
        const errorData = res.error as any;
        let errorMessage = "Booking submission failed";

        if (errorData?.data?.message) {
          errorMessage = errorData.data.message;
        } else if (errorData?.data?.error) {
          errorMessage = errorData.data.error;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData?.data === "string") {
          errorMessage = errorData.data;
        }

        console.error("Booking error:", res.error);
        toast.error(errorMessage);
      } else {
        toast.error("Booking submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-12 md:mt-20">
      <ToastContainer />
      {/* Search Criteria with Icons */}
      <div className="container mx-auto xl:px-4 lg:px-3 px-2 py-4">
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {location && (
            <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
              <IoLocationOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{location}</span>
            </div>
          )}

          {tripDate && (
            <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
              <IoCalendarOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
              <span>{formatDisplayDate(tripDate)}</span>
            </div>
          )}

          {numberOfGuests && parseInt(numberOfGuests, 10) > 0 && (
            <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 font-medium">
              <IoPeopleOutline className="text-[#FF9500] h-5 w-5 flex-shrink-0" />
              <span>
                {numberOfGuests}{" "}
                {parseInt(numberOfGuests, 10) === 1 ? "person" : "people"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto gap-4 md:gap-8 flex flex-col lg:px-4 md:px-3 px-2">
        <div className="bg-slate-50 rounded-t-xl md:p-4">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center">
            {/* Video Section */}
            <div className="relative h-full">
              <div className="h-full min-h-[400px] bg-gray-100 rounded flex items-center justify-center shadow-md">
                <button className="w-16 h-16 rounded-full bg-[#105d9e] hover:bg-[#70b6f0] flex items-center justify-center transition">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </button>
              </div>
            </div>

            {/* Steps Section */}
            <div className="p-4 md:p-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                How It Works
              </h2>

              <div className="space-y-4 md:space-y-8">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-start sm:items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center 
                        rounded-full bg-[#105d9e] text-white font-semibold 
                        shrink-0"
                    >
                      {step.id}
                    </div>

                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        {step.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-b-lg p-5 md:p-8 mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-textSecondary mb-2">
            Enter your details
          </h2>
          <p className="text-sm md:text-base text-textSecondary mb-2">
            We will take your contact details, and reach out to captains in the
            area to find you a match.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  First name*
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-300 text-[#9E9E9E]"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Last name*
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-300 text-[#9E9E9E]"
                  }`}
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
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 text-[#9E9E9E]"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Mobile number*
                </label>
                <input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300 text-[#9E9E9E]"
                  }`}
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
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Fishing Type
                </label>
                <div className="relative">
                  <select
                    {...register("fishingType")}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                    onChange={(e) => {
                      const onChangeHandler = register("fishingType").onChange;
                      onChangeHandler(e);
                      setIsDropdownOpen(false);
                      trigger("fishingType");
                    }}
                    className={`w-full border rounded-md p-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${
                      errors.fishingType
                        ? "border-red-500"
                        : "border-gray-300 text-[#9E9E9E]"
                    }`}
                  >
                    <option value="">Select Option</option>
                    <option value="Inshore">Inshore</option>
                    <option value="Offshore">Offshore</option>
                    <option value="Nearshore">Fly Fishing</option>
                    <option value="Freshwater">Freshwater</option>
                  </select>
                  <div
                    className={`absolute right-3 top-3 pointer-events-none transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <IoIosArrowDown className="text-gray-500" size={18} />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Target Species
                </label>
                <input
                  {...register("targetSpecies")}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 text-[#9E9E9E]"
                  placeholder="What fish would you like to catch?"
                />
              </div>
            </div>

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

            <div className="flex items-center gap-3">
              <input
                id="marketing"
                type="checkbox"
                {...register("marketingConsent")}
                className="h-6 w-6"
              />
              <label
                htmlFor="marketing"
                className="text-sm text-[#6e6e6e] leading-5"
              >
                By providing us with your email address, you confirm that we can
                use it to share your booking information with potential captains
                and send you updates about your trip. We will not share your
                email with third parties for marketing purposes without your
                consent.
              </label>
            </div>

            <button
              type="submit"
              disabled={!marketingConsent}
              className={`px-6 py-2 rounded-md font-medium text-white w-48 ${
                marketingConsent
                  ? "bg-[#FF7F50] hover:bg-[#FF7F50]"
                  : "bg-orange-200 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Loading..." : "Submit Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
