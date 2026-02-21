"use client";

import logo2 from "@/assets/logo.svg";
import Button from "@/components/ReUsible/Button";
import Loader from "@/components/ui/Loader";
import { useSignupMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/slices/authSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInWithGoogle } from "../../../services/authService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const route = useRouter();
  const [registerFN, { isLoading }] = useSignupMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: any) => {
    const userInfo = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      registerType: "EMAILPASS",
    };

    console.log("Submitting registration with data:", userInfo);

    try {
      const res = await registerFN(userInfo).unwrap();
      console.log("Registration response:", res);
      if (res?.success) {
        toast.success(
          res?.message ||
            "Registration successful! Please check your email to verify your account.",
        );
        route.push("/login");
      } else {
        toast.error((res?.error as string) || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error data:", error?.data?.message);
      const errorMessage =
        error?.data?.message || // RTK Query error structure
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const password = watch("password");

  const handleLogin = async (providerFunc: any) => {
    try {
      const { user } = await providerFunc();
      const loginInfo = {
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user.email,
        registerType: "GOOGLE",
        password: "",
      };

      const res = await registerFN(loginInfo);
      console.log(res);
      if (res?.data?.success) {
        Cookies.set("token", res?.data?.data?.accessToken);
        Cookies.set("currentUserRole", res?.data?.data?.role);
      }
      // Dispatch to Redux
      dispatch(
        setUser({
          user: res?.data?.data,
          token: res?.data?.data?.accessToken,
          isAuthenticated: true,
        }),
      );

      route.push("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-lg">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <Link
            href={"/"}
            className="mb-2 transform hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={logo2}
              alt="logo"
              height={100}
              width={100}
              className="h-20 sm:h-24 w-auto object-contain"
              priority
            />
          </Link>

          <div className="text-center">
            <h2 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
              Register New Account
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#FF9500] font-medium hover:text-[#ffaa33] hover:underline transition-all duration-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#f7f7f7] p-6 sm:p-8 md:p-10 border border-[#d4e9fa] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="space-y-5">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1">
                <label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="John"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#70b6f0] focus:border-transparent
                       transition-all duration-200 placeholder:text-gray-400"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.firstName.message as string}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  placeholder="Doe"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#70b6f0] focus:border-transparent
                       transition-all duration-200 placeholder:text-gray-400"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 block"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="john.doe@example.com"
                className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-[#70b6f0] focus:border-transparent
                     transition-all duration-200 placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#70b6f0] focus:border-transparent
                       transition-all duration-200 placeholder:text-gray-400 pr-16"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#70b6f0] 
                       hover:text-[#105e9e] transition-colors duration-200 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-700 block"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3.5 text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#70b6f0] focus:border-transparent
                       transition-all duration-200 placeholder:text-gray-400 pr-16"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#70b6f0] 
                       hover:text-[#105e9e] transition-colors duration-200 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#70b6f0] text-white text-base font-medium py-3.5 rounded-lg
                     hover:bg-[#105e9e] focus:ring-4 focus:ring-[#70b6f0] focus:ring-opacity-50
                     transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                     ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Register"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#f7f7f7] text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              onClick={() => handleLogin(signInWithGoogle)}
              variant="ghost"
              className="flex items-center gap-3 w-full"
            >
              <FaGoogle /> <span className="text-white">Google</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
