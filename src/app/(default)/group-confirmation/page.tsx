import Link from "next/link";
import React from "react";
import { MdEmail } from "react-icons/md";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-blue-100">
        {/* Success Icon or Illustration (Optional but Recommended) */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-sk-modernist text-slate-900 text-3xl md:text-4xl text-center font-extrabold tracking-tight mb-6">
          You're on the <span className="text-[#1a5483]">Shared Trip</span>{" "}
          list!
        </h1>

        <div className="space-y-6 text-center md:text-left">
          <p className="font-inter text-slate-600 text-base md:text-lg leading-relaxed">
            Thanks for registering your interest. We'll now work to pair you
            with like-minded anglers and a suitable charter based on your
            preferences.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
            <p className="text-blue-800 text-base font-medium">
              Next Step: As soon as a match is confirmed, you'll receive an
              email with full trip details.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <MdEmail className="text-blue-500 text-xl" />
              <span className="text-sm">Questions?</span>
              <a
                href="mailto:tom@fishingtripper.com"
                className="font-semibold text-slate-800 hover:text-blue-600 transition"
              >
                tom@fishingtripper.com
              </a>
            </div>

            {/* CTA Button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#105d9e] hover:bg-[#70b6f0] transition-colors shadow-md"
            >
              Search Private Hire instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
