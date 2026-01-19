"use client";

import type React from "react";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateBookingMutation } from "@/redux/api/bookingApi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../ui/Loader";

export default function BookingSection() {
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

  // const router = useRouter();
  const [bookingFN, { isLoading }] = useCreateBookingMutation();

  const onSubmit = async (data: any) => {
    const tripDate =
      typeof window !== "undefined" ? localStorage.getItem("date") : null;
    const numberOfGuests =
      typeof window !== "undefined" ? localStorage.getItem("Guests") : null;
    try {
      const groupBookingInfo = {
        boatId: boatID ?? "",
        tripId: tripId ?? "",
        tripDate: tripDate ?? "",
        amount: "full", // fixed
        bookingType: false, // false = GROUP booking
        groupSize: parseInt(numberOfGuests ?? "0", 10),
        memberInfo: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phoneNumber: data?.phoneNumber,
        },
      };

      const res = await bookingFN(groupBookingInfo);

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Booking successful!");
        if (typeof window !== "undefined") {
          localStorage.removeItem("numberOfGuests");
          localStorage.removeItem("numberOfGuests");
        }
        router.push("/group-confirmation");
      } else {
        // Show error toast if success is false
        toast.error(res?.data?.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-10 xl:px-4 lg:px-3 px-2 py-10">
      {/* <ToastContainer /> */}
      {/* How it works section */}

      <h2 className="text-xl md:text-4xl font-bold text-textSecondary mb-2">
        How it works:
      </h2>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <ol className="list-disc space-y-4 pl-6 text-black font-normal text-sm md:text-base leading-normal tracking-tight font-sans">
            <li>Create a free account or sign in to your profile.</li>

            <li>
              Confirm your contact information and add some details about the
              type of fishing you would like to do (e.g. Offshore/Inshore and
              species youd like to target).
            </li>

            <li>
              Your information will be added to our database and well team you
              up with other anglers looking to do the same type of fishing as
              you, on your specified date(s).
            </li>

            <li>
              Well contact charter captains and guides in the area with
              availability and pair you up for a trip.
            </li>

            <li>
              An email will be sent to you with details of the proposed trip
              with a payment link to confirm the booking. Payments will be
              refunded if the trip does not go ahead.
            </li>
          </ol>
        </div>

        {/* Video placeholder */}
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

      {/* Enter your details section */}
      <div className="bg-slate-50 rounded-lg p-5 md:p-8">
        <div className="">
          <h2 className="text-xl md:text-3xl font-bold text-textSecondary mb-2">
            Enter your details
          </h2>
          <p className="text-sm md:text-base text-textSecondary mb-8">
            We will take your contact details, and reach out to captains in the
            area who we work with and get back to you.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-10">
            <div className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  First name*
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                errors.firstName
                  ? "border-red-500"
                  : "border-gray-300 text-[#9E9E9E]"
              }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  Last name*
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                errors.lastName
                  ? "border-red-500"
                  : "border-gray-300 text-[#9E9E9E]"
              }`}
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
                <label
                  htmlFor="email"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  Email address*
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 text-[#9E9E9E]"
              }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label
                  htmlFor="mobile"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  Mobile number*
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phoneNumber", {
                    required: "phone number is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                errors.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300 text-[#9E9E9E]"
              }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Marketing Consent Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                id="marketing"
                type="checkbox"
                {...register("marketingConsent")}
                className="mt-1"
              />
              <label
                htmlFor="marketing"
                className="text-sm md:text-lg text-textSecondary leading-7 font-normal"
              >
                By providing us with your email address, you confirm that we can
                use it to share your booking information with you and to send
                marketing collateral.
              </label>
            </div>

            <button
              type="submit"
              disabled={!marketingConsent}
              className={`px-6 py-2 rounded-md font-medium text-white w-48
          ${
            marketingConsent
              ? "bg-orange-400 hover:bg-orange-500"
              : "bg-orange-200 cursor-not-allowed"
          }`}
            >
              {isLoading ? <Loader /> : " Submit Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// <div className="p-3 border-2 my-10 border-[#FFE432] bg-[#FDFFD8]">
//   Once the group is full, you’ll receive a final confirmation that this trip is
//   going ahead.
// </div>;
