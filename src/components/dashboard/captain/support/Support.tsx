// components/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSupportMutation } from "@/redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";

export default function Support() {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isMessageFocused, setIsMessageFocused] = useState(false);
  const [support, { isLoading }] = useSupportMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Watch input values
  const nameValue = watch("name");
  const emailValue = watch("email");
  const messageValue = watch("message");

  const handleSend = async (data: any) => {
    try {
      const response = await support(data);

      if ("data" in response && response.data) {
        toast(response.data.message || "Support request sent successfully!");
        reset();
      } else if ("error" in response && response.error) {
        toast.error("Failed to send support request.");
      }
    } catch (error) {
      console.error("Error sending support data:", error);
      // Optionally handle error (e.g., show error message)
    }
  };

  return (
    <section className=" mx-0 md:m-6 px-5 py-10 bg-white">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
      <p className="mb-8 text-gray-600">Leave us a message</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <div className="">
          <form className="space-y-4" onSubmit={handleSubmit(handleSend)}>
            {/* Name Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="name"
                  className={`absolute text-base left-3 px-1 transition-all  font-medium ${
                    isNameFocused || nameValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="email"
                  className={`absolute text-base left-3 px-1 transition-all  font-medium ${
                    isEmailFocused || emailValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="message"
                  className={`absolute text-base left-3 px-1 transition-all font-medium ${
                    isMessageFocused || messageValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required",
                  })}
                  rows={5}
                  onFocus={() => setIsMessageFocused(true)}
                  onBlur={() => setIsMessageFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.message.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className="w-full bg-[#ffaa33] hover:bg-orange-600 text-white font-medium py-3 rounded-lg"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
        {/* Contact Info */}
        <div className="text-gray-700 text-sm">
          <p className="mb-4">Fishing Tripper Admin </p>

          <p className="text-blue-600 hover:underline cursor-pointer">
            tom@fishingtripper.com
          </p>
        </div>
      </div>
    </section>
  );
}
