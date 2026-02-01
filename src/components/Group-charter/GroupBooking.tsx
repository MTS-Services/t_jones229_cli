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

  // const onSubmit = async (data: any) => {
  //   console.log("Form data submitted:", data);

  //   const tripDate =
  //     typeof window !== "undefined" ? localStorage.getItem("date") : null;
  //   const numberOfGuests =
  //     typeof window !== "undefined" ? localStorage.getItem("Guests") : null;

  //   try {
  //     const groupBookingInfo = {
  //       boatId: boatID || null,
  //       tripId: tripId || null,
  //       tripDate: tripDate || new Date().toISOString().split("T")[0],
  //       amount: "full",
  //       bookingType: false, // false = GROUP booking
  //       groupSize: parseInt(numberOfGuests ?? "1", 10),
  //       memberInfo: {
  //         firstName: data?.firstName || "",
  //         lastName: data?.lastName || "",
  //         email: data?.email || "",
  //         phoneNumber: data?.phoneNumber || "",
  //         fishingType: data?.fishingType || "Offshore",
  //         targetSpecies: data?.targetSpecies || "",
  //         details: data?.details || "",
  //       },
  //       where:
  //         typeof window !== "undefined"
  //           ? localStorage.getItem("location")
  //           : null,
  //       date: tripDate,
  //     };

  //     console.log("Sending group booking info:", groupBookingInfo);

  //     const res = await bookingFN(groupBookingInfo);
  //     console.log("Booking response:", res);

  //     if (res?.data?.success) {
  //       toast.success(res?.data?.message || "Booking successful!");
  //       if (typeof window !== "undefined") {
  //         localStorage.removeItem("numberOfGuests");
  //         localStorage.removeItem("Guests");
  //         localStorage.removeItem("date");
  //       }
  //       router.push("/group-confirmation");
  //     } else if (res?.error) {
  //       // Handle RTK Query error structure
  //       let errorMessage = "Booking failed. Please try again.";

  //       if (
  //         "data" in res.error &&
  //         typeof res.error.data === "object" &&
  //         res.error.data !== null
  //       ) {
  //         errorMessage = (res.error.data as any)?.message || errorMessage;
  //       } else if ("message" in res.error) {
  //         errorMessage = res.error.message || errorMessage;
  //       }

  //       console.error("Booking error:", res.error);
  //       toast.error(errorMessage);
  //     } else {
  //       toast.error("Booking failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Network error:", error);
  //     toast.error("Something went wrong. Please try again later.");
  //   }
  // };




const onSubmit = async (data: any) => {
  console.log("Form data submitted:", data);

  // 1️⃣ Safely get localStorage values
  const tripDate =
    typeof window !== "undefined"
      ? localStorage.getItem("date") || params.get("date")
      : null;
  const numberOfGuests =
    typeof window !== "undefined"
      ? localStorage.getItem("Guests") || params.get("guests")
      : null;
  const bookingType =
    typeof window !== "undefined"
      ? localStorage.getItem("bookingType") || params.get("bookingType")
      : null;

  // 2️⃣ Validate before sending
  if (!tripDate || !numberOfGuests || !bookingType) {
    toast.error(
      "Trip date, number of guests or booking type is missing. Please select them before submitting."
    );
    return;
  }

  // 3️⃣ Build booking payload safely
  const groupBookingInfo = {
    boatId: boatID || null,
    tripId: tripId || null,
    tripDate,
    amount: "full",
    bookingType: bookingType === "full" ? true : false, // convert string to boolean if needed
    groupSize: parseInt(numberOfGuests ?? "1", 10),
    memberInfo: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber || "",
      fishingType: data?.fishingType || "Offshore",
      targetSpecies: data?.targetSpecies || "",
      details: data?.details || "",
    },
    where:
      typeof window !== "undefined"
        ? localStorage.getItem("location") || "Unknown"
        : "Unknown",
    date: tripDate,
  };

  console.log("Sending group booking info:", groupBookingInfo);

  try {
    const res = await bookingFN(groupBookingInfo);
    console.log("Booking response:", res);

    if (res?.data?.success) {
      toast.success(res?.data?.message || "Booking successful!");
      // 4️⃣ Clean up
      if (typeof window !== "undefined") {
        localStorage.removeItem("Guests");
        localStorage.removeItem("date");
        localStorage.removeItem("bookingType");
      }
      router.push("/group-confirmation");
    } else if (res?.error) {
      let errorMessage = "Booking failed. Please try again.";
      if ("data" in res.error && typeof res.error.data === "object") {
        errorMessage = (res.error.data as any)?.message || errorMessage;
      } else if ("message" in res.error) {
        errorMessage = res.error.message || errorMessage;
      }
      toast.error(errorMessage);
    } else {
      toast.error("Booking failed. Please try again.");
    }
  } catch (error) {
    console.error("Network error:", error);
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
              {/* Fishing Type */}
              <div className="space-y-2">
                <label
                  htmlFor="fishingType"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  Fishing type*
                </label>
                <select
                  id="fishingType"
                  {...register("fishingType", {
                    required: "Fishing type is required",
                  })}
                  className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                errors.fishingType
                  ? "border-red-500"
                  : "border-gray-300 text-[#9E9E9E]"
              }`}
                >
                  <option value="">Select fishing type</option>
                  <option value="Offshore">Offshore</option>
                  <option value="Inshore">Inshore</option>
                  <option value="Nearshore">Nearshore</option>
                  <option value="Freshwater">Freshwater</option>
                </select>
                {errors.fishingType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fishingType.message as string}
                  </p>
                )}
              </div>

              {/* Target Species */}
              <div className="space-y-2">
                <label
                  htmlFor="targetSpecies"
                  className="text-base text-start font-bold text-[#171717] block mb-1"
                >
                  Target Species
                </label>
                <input
                  id="targetSpecies"
                  type="text"
                  placeholder="e.g., Redfish, Grouper, etc."
                  {...register("targetSpecies")}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#9E9E9E]"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label
                htmlFor="details"
                className="text-base text-start font-bold text-[#171717] block mb-1"
              >
                Details
              </label>
              <textarea
                id="details"
                placeholder="Any additional details about your fishing preferences"
                {...register("details")}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#9E9E9E] resize-none"
              />
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
                    required: "Phone number is required",
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
