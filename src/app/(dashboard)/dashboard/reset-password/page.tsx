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
    <div className="w-full h-screen relative bg-[#ffffff]">
      <ToastContainer />
      <div className="container mx-auto py-28 flex flex-col justify-center items-center text-white">
        <Image
          src={logo2}
          alt="logo"
          height={100}
          width={100}
          className="h-28 w-52"
        />

        <div className="text-center mx-auto">
          <h2 className="text-black text-2xl md:text-4xl font-bold leading-[52px] mb-2 w-full md:w-[450px] mb-6">
            Change your password
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:bg-white md:p-10 rounded-lg md:shadow-lg space-y-4 md:bg-white  md:p-10 border border-[#0f5d9d] rounded-lg"
          >
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
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
                  className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.oldPassword.message as string}
                </p>
              )}
            </div>

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
                  className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            <Button
              type="submit"
              variant="secondary"
              className="bg-[#70b6f0] text-white text-base rounded-lg w-full text-center  font-medium font-shatosi hover:bg-[#105e9e] transition-colors duration-300 ease-in-out"
            >
              {isLoading ? <Loader /> : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
