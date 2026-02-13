"use client";

// import { stepsData } from "@/constant/stepsData";
import { useRouter } from "next/navigation";

import { Sailboat, CalendarCheck, Wallet } from "lucide-react";

export const stepsData = [
  {
    id: 1,
    icon: <Sailboat />,
    title: "Create Your Listing",
    description: "Upload details, pricing, availability.",
    button: "List your boat",
  },
  {
    id: 2,
    icon: <CalendarCheck />,
    title: "Get Booked",
    description: "Customers book directly through the platform.",
  },
  {
    id: 3,
    icon: <Wallet />,
    title: "Get Paid & Go Fishing",
    description: "Earn money on your terms.",
  },
];

export default function StepsSection() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#f8fafc] lg:py-16 md:py-12 py-8 overflow-hidden">
      <div className="container mx-auto xl:px-6 lg:px-5 md:px-4 px-3">
        {/* Header Section */}
        <div className="md:mb-10 mb-7 text-center">
          <h2 className="lg:text-4xl md:text-3xl text-2xl font-black text-slate-900 md:mb-4 mb-2.5">
            How it works
          </h2>
          <div className="h-1.5 w-24 bg-[#0f5d9e] mx-auto rounded-full" />
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 md:gap-6.5 gap-5">
          {stepsData?.map((step, index) => {
            // Logic to check if it's the 3rd item in a 2-column layout
            const isLast = index === stepsData.length - 1;

            return (
              <div
                key={step.id}
                className={`group relative bg-white p-8 rounded-xl shadow-sm transition-all duration-300 border border-slate-100
                ${
                  isLast
                    ? "md:col-span-2 lg:col-span-1 md:w-[360px] md:mx-auto lg:max-w-full"
                    : ""
                }`}
              >
                {/* Large Background Number */}
                <span className="absolute top-4 right-6 lg:text-7xl md:text-6xl text-5xl font-black group-hover:text-[#d0dfeb] text-[#e3ecf5] transition-colors">
                  0{step.id}
                </span>

                {/* Icon / Dot */}
                <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#0f5d9e] transition-colors duration-300">
                  <span className=" text-white font-bold text-xl">
                    {step.icon}
                  </span>
                </div>

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
