"use client";

import Button from "@/components/ReUsible/Button";
import Image from "next/image";
import React, { useState, Suspense } from "react";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/components/ui/Loader";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [resetPasswordFN, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const password = watch("newPassword");

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error("Token is missing from the URL.");
      return;
    }
    const passInfo = {
      newPassword: data?.newPassword,
      token,
    };

    try {
      const res = await resetPasswordFN(passInfo);
      if (res?.data?.success) {
        toast.success(`${res?.data?.message}`);
        router.push("/");
      } else {
        toast.error("Password change failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:bg-white md:p-10 rounded-lg md:shadow-lg space-y-4"
    >
      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "New password must be at least 6 characters",
              },
            })}
            placeholder="new password"
            className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {errors.newPassword.message as string}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
        >
          Confirm your password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            placeholder="Confirm password"
            className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {errors.confirmPassword.message as string}
          </p>
        )}
      </div>

      <Button type="submit" variant="secondary" className="w-full font-bold">
        {isLoading ? <Loader /> : "Change Password"}
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
        <div className="text-center mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2 w-full md:w-[450px]">
            Change your password
          </h2>

          {/* Wrap in Suspense */}
          <Suspense fallback={<Loader />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
