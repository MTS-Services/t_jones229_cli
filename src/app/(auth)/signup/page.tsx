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

    try {
      const res = await registerFN(userInfo).unwrap();
      if (res?.success) {
        toast.success(
          res?.message ||
            "Registration successful! Please check your email to verify your account."
        );
        route.push("/login");
      } else {
        toast.error((res?.error as string) || "Registration failed");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.data?.message || // in case it's RTK Query
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
      console.log(res)
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
        })
      );

      route.push("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-blue-600">
      <div className="container mx-auto py-3 md:py-28 flex flex-col justify-center items-center text-white">
        <Link href={"/"}>
          <Image
            src={logo2}
            alt="logo"
            height={100}
            width={100}
            className="h-28 w-52"
          />
        </Link>

        <div className="text-center mx-auto">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2 w-full md:w-[450px]">
              Register a new account
            </h2>
            <p className="text-lg font-normal font-satoshi mb-6">
              Already have an account?
              <Link href="/login" className="text-[#FF9500] cursor-pointer">
                {" "}
                Log in
              </Link>
            </p>
          </div>

          {/* Signup Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:bg-white md:p-10 rounded-lg md:shadow-lg space-y-4"
          >
            {/* first  Name */}
            <div>
              <label
                htmlFor="name"
                className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
              >
                Enter your first name
              </label>
              <input
                type="text"
                id="fristName"
                {...register("firstName", {
                  required: "Frist name is required",
                })}
                placeholder="Enter your first name"
                className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.firstName.message as string}
                </p>
              )}
            </div>
            {/* last  Name */}
            <div>
              <label
                htmlFor="name"
                className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
              >
                Enter your last name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                placeholder="Enter your last name"
                className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.lastName.message as string}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email address"
                className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
              >
                Password
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
                  placeholder="Set your password"
                  className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-sm text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.password.message as string}
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
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
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

            <Button
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className={`w-full font-bold ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <Loader /> : "Register"}
            </Button>

            <h1 className="text-base font-normal text-white md:text-[#616161] pt-8 pb-4">
              Or continue with
            </h1>

            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => handleLogin(signInWithGoogle)}
                variant="ghost"
                className="flex items-center gap-3"
              >
                <FaGoogle /> <span className="text-white">Google</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
