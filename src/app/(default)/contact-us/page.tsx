"use client";
import React from "react";
import { useSupportMutation } from "@/redux/api/authApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
  email: string;
  name: string;
  description: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [support] = useSupportMutation();
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await support(data);

      console.log("Support API Response:", response); // Debug log

      if ("data" in response && response.data) {
        // Try multiple paths for success message
        const successMessage =
          response.data?.message ||
          response.data?.data?.message ||
          "Message sent successfully!";
        toast.success(successMessage);
        reset();
      } else if ("error" in response && response.error) {
        // Better error message extraction
        const errorData = response.error as any;
        let errorMessage = "Failed to send message. Please try again.";

        if (errorData?.data?.message) {
          errorMessage = errorData.data.message;
        } else if (errorData?.data?.error) {
          errorMessage = errorData.data.error;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData?.data === "string") {
          errorMessage = errorData.data;
        }

        console.error("Support error:", response.error);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0f5a8b] mb-3">
              Contact Us
            </h1>
            <p className="text-gray-600 text-lg">
              We're here to help with any questions about your fishing trips.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left: Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your name"
                      {...register("name", {
                        required: "Please enter your name",
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Please enter your email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-gray-700 mb-2"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a8b] focus:border-[#0f5a8b] outline-none transition resize-none"
                      placeholder="Tell us how we can help..."
                      {...register("description", {
                        required: "Please enter your message",
                      })}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <button
                    className="w-full rounded-full bg-[#0f5a8b] hover:bg-[#1376af] text-white py-3 text-lg mt-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Right: Contact Info */}
              <div className="lg:pl-8 border-l border-gray-200 lg:border-l">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Get in Touch
                  </h2>

                  <div className="space-y-6">
                    {/* Email Support */}
                    <div className="flex items-start gap-4">
                      <div className="bg-[#0f5a8b] p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Email Support
                        </h3>
                        <a
                          href="mailto:tom@fishingtripper.com"
                          className="text-[#0f5a8b] hover:text-[#1376af] transition-colors"
                        >
                          tom@fishingtripper.com
                        </a>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start gap-4">
                      <div className="bg-[#0f5a8b] p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Response Time
                        </h3>
                        <p className="text-gray-700">Within 24 hours</p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start gap-4">
                      <div className="bg-[#0f5a8b] p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Business Hours
                        </h3>
                        <p className="text-gray-700">
                          Monday – Friday, 9AM – 6PM EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image/Placeholder */}
                <div className="mt-8 bg-gradient-to-r from-[#0f5a8b] to-[#2a8bcc] rounded-xl p-6">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-xl shadow-sm mb-4">
                      <svg
                        className="w-12 h-12 text-[#0f5a8b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      We Love Helping Anglers
                    </h4>
                    <p className="text-white text-sm">
                      Your fishing adventure is important to us
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
