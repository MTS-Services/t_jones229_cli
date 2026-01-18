"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io"; // Added React Icon
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
  } = useForm();

  const router = useRouter();
  const marketingConsent = watch("marketingConsent", false);
  const boatID = params.get("boatId");
  const tripId = params.get("tripId");

  const [bookingFN, { isLoading }] = useCreateBookingMutation();

  const onSubmit = async (data: any) => {
    // This logs the header data + the form data to your console
    const finalDataForConsole = {
      headerData: {
        location,
        tripDate,
        numberOfGuests,
      },
      formData: data,
      queryParams: { boatID, tripId },
    };

    console.log("Full Submission Data:", finalDataForConsole);

    try {
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
          fishingType: data?.fishingType, // New field
          targetSpecies: data?.targetSpecies, // New field
        },
      };

      const res = await bookingFN(groupBookingInfo);

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
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-20">
      <div className="bg-[#F5F5F5] pt-[41px] pb-[31px]">
        <div className="container mx-auto xl:px-4 lg:px-3 px-2">
          <h1 className="text-xl md:text-2xl font-bold text-[#242424] leading-9">
            {location ?? "Location not set"} / {tripDate ?? "Date not set"} /{" "}
            {numberOfGuests ?? "Guests not set"} people
          </h1>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-10 xl:px-4 lg:px-3 px-2 py-10">
        <h2 className="text-xl md:text-4xl font-bold text-textSecondary mb-2">
          How it works:
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <ol className="list-disc space-y-4 pl-6 text-black font-normal text-sm md:text-base leading-normal tracking-tight font-sans">
              <li>Create a free account or sign in to your profile.</li>
              <li>
                Confirm your contact information and add some details about the
                type of fishing you would like to do i.e. Offshore/Inshore and
                species you'd like to target.
              </li>
              <li>
                Your information will be added to our database and we'll team
                you up with other anglers looking to do the same type of fishing
                as you, on your specified date(s).
              </li>
              <li>
                We'll contact charter captains and guides in the area with
                availability and pair you up for a trip.
              </li>
              <li>
                5. An email will be sent to you with details of the proposed
                trip with a payment link to confirm the booking. Payments will
                be refunded if the trip does not go ahead.
              </li>
            </ol>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-6 h-6 ml-1" fill="white" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-textSecondary mb-2">
            Enter your details
          </h2>
          <p className="text-sm md:text-base text-textSecondary mb-8">
            We will take your contact details, and reach out to captains in the
            area...
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-10">
            <div className="grid md:grid-cols-2 gap-4">
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
              </div>
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
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Email address*
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="Enter your email"
                />
              </div>
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
              </div>
            </div>

            {/* NEW ADDITIONS: Fishing Type & Species */}
            <div className="grid md:grid-cols-2 gap-4">
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
                    onChange={() => setIsDropdownOpen(false)}
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
              </div>

              <div className="space-y-2">
                <label className="text-base text-start font-medium text-[#171717] block mb-1">
                  Target Species*
                </label>
                <input
                  {...register("targetSpecies", {
                    required: "Target species is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.targetSpecies ? "border-red-500" : "border-gray-300 text-[#9E9E9E]"}`}
                  placeholder="What fish would you like to catch?"
                />
              </div>
            </div>

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
