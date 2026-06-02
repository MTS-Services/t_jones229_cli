"use client";

import Button from "@/components/ReUsible/Button";
import Image from "next/image";
import React, { Suspense } from "react";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { useRouter, useSearchParams } from "next/navigation";

function OtpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [changPssFN, { isLoading }] = useChangePasswordMutation();
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error("Token is missing from the URL.");
      return;
    }

    const otpInfo = {
      otp: data.otp,
      token,
    };

    try {
      const res = await changPssFN(otpInfo).unwrap();
      toast.success(res.message);
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:bg-white md:p-10 rounded-lg md:shadow-lg"
    >
      <div>
        <label
          htmlFor="otp"
          className="text-base text-start font-bold text-white md:text-[#171717] block mb-2"
        >
          Enter 6-digit OTP
        </label>
        <input
          type="text"
          id="otp"
          maxLength={6}
          {...register("otp", {
            required: "OTP is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "OTP must be exactly 6 digits",
            },
          })}
          placeholder="Enter your 6-digit OTP"
          className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          inputMode="numeric"
        />
        {errors.otp && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {errors.otp.message as string}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="w-full font-bold mt-3"
      >
        {isLoading ? <Loader /> : "Submit OTP"}
      </Button>
    </form>
  );
}

export default function Page() {
  return (
    <div className="w-full min-h-screen relative bg-blue-600">
      <ToastContainer />
      <div className="container mx-auto py-28 flex flex-col justify-center items-center text-white">
        <Image
          src={BRAND_LOGO_URL}
          alt="logo"
          height={100}
          width={100}
          unoptimized
          className="h-28 w-52"
        />
        <div className="text-center mx-auto w-full md:w-2/4 px-5">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2 w-full md:w-[450px]">
              Enter OTP
            </h2>
          </div>

          {/* Suspense Boundary Required for useSearchParams */}
          <Suspense fallback={<p className="text-white">Loading...</p>}>
            <OtpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
