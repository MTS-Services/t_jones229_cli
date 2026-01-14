"use client";

import Button from "@/components/ReUsible/Button";
import Image from "next/image";
import React, { useState } from "react";
import logo2 from "@/assets/logo.svg";
import { useForm } from "react-hook-form";
import { useSendOtpMutation } from "@/redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/components/ui/Loader";
// import { useRouter } from "next/navigation";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  // const router = useRouter();
  const [sendOtpFN, { isLoading }] = useSendOtpMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("newPassword");

  const onSubmit = async (data: any) => {
    const passInfo = {
      newPassword: data?.newPassword,
      oldPassword: data?.oldPassword,
    };

    try {
      const res = await sendOtpFN(passInfo);
      // route.push("/dashboard/reset-password/send-otp");
      if (res?.data?.success) {
        toast.success(
          `${res?.data?.message}. Please check your email and reset your password!`
        );
      } else {
        toast.error("Password change failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full">
      <TitleSection />
      <div className=" relative bg-[#ffffff] flex flex-col justify-center items-center">
        <ToastContainer />

        <div className="container mx-auto px-4 py-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-[500px] text-center">
            <h2 className="text-black text-2xl md:text-4xl font-bold leading-tight mb-8">
              Change your password
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white p-6 md:p-10 border border-[#0f5d9d] rounded-xl shadow-lg space-y-6"
            >
              {/* Old Password */}
              <div className="text-left">
                <label
                  htmlFor="oldPassword"
                  className="text-base font-bold text-[#171717] block mb-1"
                >
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="oldPassword"
                    {...register("oldPassword", {
                      required: "Old password is required",
                      minLength: {
                        value: 6,
                        message: "Old password must be at least 6 characters",
                      },
                    })}
                    placeholder="old password"
                    className="w-full border text-[#4b4b4b] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600 font-medium"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message as string}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="text-left">
                <label
                  htmlFor="newPassword"
                  className="text-base font-bold text-[#171717] block mb-1"
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
                    className="w-full border text-[#4b4b4b] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600 font-medium">
                    {/* Note: Logic usually shares the same toggle for simplicity or separate ones */}
                  </span>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message as string}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="text-left">
                <label
                  htmlFor="confirmPassword"
                  className="text-base font-bold text-[#171717] block mb-1"
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
                        value === watch("newPassword") ||
                        "Passwords do not match",
                    })}
                    placeholder="Confirm password"
                    className="w-full border text-[#4b4b4b] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600 font-medium"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-[#105e9e] hover:bg-[#0d4d82] text-white text-base py-3 rounded-lg w-full font-medium transition-all duration-300"
              >
                {isLoading ? <Loader /> : "Change Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
