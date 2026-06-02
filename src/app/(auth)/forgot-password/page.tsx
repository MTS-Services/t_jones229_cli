"use client";

import Image from "next/image";
import Button from "@/components/ReUsible/Button";
import image from "@/assets/signup.png";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

const ForgotPassword = () => {
  const [forgotPassFN, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await forgotPassFN({ email: data.email }).unwrap();

      if (res?.success) {
        toast.success(`${res.message}. Please check your email!`);
        // route.push("/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <ToastContainer />
      {/* Left Section */}
      <div className="w-full md:w-1/2 relative h-screen bg-[#0e5d9d] pb-5 flex flex-col justify-center items-center text-white px-5 md:px-10">
        {/* Logo */}
        <Link href={"/"} className="mb-5">
          <Image
            src={BRAND_LOGO_URL}
            alt="logo"
            height={100}
            width={100}
            unoptimized
            className="h-28 w-52 mx-auto object-contain"
          />
        </Link>

        {/* Content */}
        <div className="w-full max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2">
            Forgot Password!
          </h2>

          <p className="text-lg leading-7 mx-auto max-w-xl font-normal mb-6">
            Enter a valid email address. After submission, check your email to
            set a new password.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto mt-10 text-left"
          >
            <label
              htmlFor="email"
              className="text-base font-bold text-[#171717] block mb-1"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full border text-textPrimary border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-6 font-bold rounded-lg bg-[#0c4a7a] text-white hover:bg-[#1577c2] transition-colors duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-full md:w-1/2 relative max-h-screen">
        <Image
          src={image}
          alt="Fishing Trip"
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
