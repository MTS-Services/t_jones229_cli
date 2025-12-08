"use client";

import Image from "next/image";
import Button from "@/components/ReUsible/Button";
import image from "@/assets/signup.png";
import logo2 from "@/assets/logo.svg";
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
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <ToastContainer />
      {/* Left Section */}
      <div className="w-full md:w-1/2 relative h-screen bg-blue-600 pb-5 flex flex-col justify-center items-start text-white px-5 md:px-10">
        <div className="xl:translate-x-56">
          <Link href={"/"}>
            <Image
              src={logo2}
              alt="logo"
              height={100}
              width={100}
              className="h-28 w-52"
            />
          </Link>
        </div>

        <div className="text-start w max-w-3xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2">
              Forgot Password!
            </h2>
            <p className="text-lg leading-7 font-normal mb-6">
              Enter a valid email address. <br />
              After submission, check your email to set a new password.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg mt-10"
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
              variant="secondary"
              className="w-full mt-6 font-bold"
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
