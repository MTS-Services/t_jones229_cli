// components/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useSupportMutation } from "@/redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";

export default function Support() {
  const [support, { isLoading }] = useSupportMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSend = async (data: any) => {
    try {
      const response = await support(data);

      if ("data" in response && response.data) {
        toast.success(
          response.data.message || "Support request sent successfully!"
        );
        reset();
      } else if ("error" in response && response.error) {
        toast.error("Failed to send support request.");
      }
    } catch (error) {
      console.error("Error sending support data:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <section className="mx-0 md:m-6 px-5 py-10 bg-white">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
      <p className="mb-8 text-gray-600">Leave us a message</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSend)}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-600 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-400 mt-2 bg-white"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-400 mt-2 bg-white"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-600 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                {...register("message", { required: "Message is required" })}
                rows={5}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-400 mt-2 bg-white"
                placeholder="How can we help you today?"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.message.message as string}
                </p>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#0f5e9e] hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left text-gray-700 text-sm space-y-3">
          <p className="mb-4 text-xl font-bold">Fishing Tripper Admin</p>
          <div>
            <p className="text-base hover:underline cursor-pointer">
              22-25 Portman Close,
            </p>
            <p className="text-base hover:underline cursor-pointer">
              London, W1H 6BS, United Kingdom
            </p>
          </div>
          <p className="text-base hover:underline cursor-pointer">
            +44 20 XXXXXXX
          </p>
          <p className="text-blue-600 text-base hover:underline cursor-pointer">
            superadmin@test.com
          </p>
        </div>
      </div>
    </section>
  );
}
