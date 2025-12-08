"use client";
import { useGetMeQuery } from "@/redux/api/authApi";
import { Divider } from "antd";
import { useFormContext } from "react-hook-form";
import PaymentDetailsForm from "../dashboard/userDashboard/PaymentDetailsForm";
import { usePathname } from "next/navigation";

export default function PaymentDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const pathName = usePathname();

  const { data: userIno, isLoading } = useGetMeQuery({});

  if (isLoading) {
    return (
      <div className="animate-pulse w-full">
        {/* Skeleton UI */}
        <div className="h-6 md:h-8 w-48 bg-gray-300 rounded mb-3" />
        <div className="h-4 w-full max-w-md bg-gray-200 rounded mb-6" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-3xl text-[#242424] font-bold">
        Your details
      </h2>
      <p className="text-[#878787] font-normal mt-3 mb-3 md:mb-0">
        We just need a few details to get your Fishing Tripper day booked.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-base font-bold">First name*</label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            defaultValue={userIno?.data?.firstName}
            placeholder="Enter your first name"
            className={`w-full mt-2 border border-[#E0E0E0] px-4 py-2 focus:ring-2 focus:ring-blue-500
            `}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">
              {String(
                errors.firstName.message + pathName === "/boat-list-form/terms"
                  ? "you need to update your profile from user dashboard"
                  : ""
              )}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-base font-bold">Last name*</label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            defaultValue={userIno?.data?.lastName}
            placeholder="Enter your last name"
            className={`w-full mt-2 border border-[#E0E0E0] px-4 py-2 focus:ring-2 focus:ring-blue-500 `}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">
              {String(errors.lastName.message)}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-base font-bold">Email*</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            defaultValue={userIno?.data?.email}
            placeholder="Enter your email"
            className={`w-full mt-2 border border-[#E0E0E0] px-4 py-2 focus:ring-2 focus:ring-blue-500 `}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-base font-bold">Mobile number*</label>
          <input
            type="tel"
            {...register("mobile", { required: "Mobile number is required" })}
            defaultValue={userIno?.data?.phoneNumber}
            placeholder="Enter your mobile number"
            className={`w-full mt-2 border border-[#E0E0E0] px-4 py-2 focus:ring-2 focus:ring-blue-500 `}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">
              {String(errors.mobile.message)}
            </p>
          )}
        </div>

        {/* Marketing consent */}
        <div className="col-span-2 flex gap-2 mt-2">
          <input type="checkbox" {...register("marketingConsent")} />
          <p className="text-[#9E9E9E] text-sm">
            By providing us with your email, you confirm that we can use it to
            share booking info and send marketing material.
          </p>
        </div>

        {/* <LoginModal
          isOpen={!!isOpen}
          onClose={(open: boolean) => setIsOpen?.(open)}
        /> */}

        <Divider className="col-span-2" />

        <div className="col-span-2">
          <PaymentDetailsForm paymentInfo={userIno?.data?.paymentMethod} />
        </div>
      </div>
    </div>
  );
}
