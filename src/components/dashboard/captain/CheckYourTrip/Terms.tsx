"use client"; // Add this if using Next.js App Router

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form"; // 1. Import these
import PaymentDetails from "./PaymentDetails";
import Image from "next/image";
import USAPaymentSection from "./USAPaymentSection";
import { FiCheck } from "react-icons/fi";

interface CountryOption {
  id: "USA" | "UK";
  name: string;
  flag: string;
}

const Terms: React.FC = () => {
  const [agreed, setAgreed] = useState<boolean>(true);
  const [selected, setSelected] = useState("USA");

  // 2. Initialize the form methods
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      marketingConsent: false,
    },
  });

  const inclusions: string[] = [
    "6-Month Free Trial",
    "Flat $65/month after the free trial",
    "Unlimited Trip Listings",
    "Cancel Anytime",
  ];

  const options: CountryOption[] = [
    { id: "USA", name: "USA", flag: "/country/usa.png" },
    { id: "UK", name: "UK", flag: "/country/uk.png" },
  ];

  return (
    // 3. Wrap everything inside FormProvider
    <FormProvider {...methods}>
      <div className="">
        {/* Card and Terms Section */}

        <div className="flex items-center justify-center">
          <div className="w-full flex flex-col md:flex-row items-start gap-12">
            {/* Left Side: Pricing Card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 p-10 w-full md:w-[420px] border border-gray-100/50">
              {/* Membership Badge */}
              <div className="inline-block bg-[#4F6EF7] text-white text-[13px] font-bold px-7 py-2.5 rounded-full mb-8 tracking-wide">
                Membership
              </div>

              <h2 className="text-[#1A1A1A] text-[26px] font-bold mb-2 tracking-tight">
                Fishing Tripper Membership
              </h2>

              <p className="text-gray-400 text-[15px] mb-8 font-medium">
                Free 6 month trial then $50 per month.
              </p>

              <div className="flex items-baseline gap-2 mb-8 border-b border-gray-100 pb-10">
                <span className="text-6xl font-bold text-[#1A1A1A] tracking-tighter">
                  $65
                </span>
                <span className="text-gray-400 text-xl font-medium">/mo</span>
              </div>

              <div className="space-y-5">
                <p className="text-[11px] font-extrabold text-gray-900 uppercase tracking-[0.15em] mb-6">
                  WHAT'S INCLUDED...
                </p>

                <FeatureItem text="6-Month Free Trial" />
                <FeatureItem text="Flat $65/month after the free trial" />
                <FeatureItem text="Unlimited Trip Listings" />
                <FeatureItem text="Cancel Anytime" />
              </div>
            </div>

            {/* Right Side: Terms & Conditions */}
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-extrabold text-[#1A1A1A] mb-10 tracking-tight">
                Terms & Conditions Summary
              </h1>

              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-[17px] text-gray-700 leading-relaxed">
                  <span className="mt-3 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>You will not be charged for the first 6 months.</span>
                </li>
                <li className="flex items-start gap-4 text-[17px] text-gray-700 leading-relaxed">
                  <span className="mt-3 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>
                    After the free trial, $65/month will be charged
                    automatically.
                  </span>
                </li>
                <li className="flex items-start gap-4 text-[17px] text-gray-700 leading-relaxed">
                  <span className="mt-3 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>
                    You can cancel anytime before the next billing cycle to
                    avoid charges.
                  </span>
                </li>
                <li className="flex items-start gap-4 text-[17px] text-gray-700 leading-relaxed">
                  <span className="mt-3 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>
                    If you cancel, your listings will be removed from the
                    platform.
                  </span>
                </li>
                <li className="flex items-start gap-4 text-[17px] text-gray-700 leading-relaxed">
                  <span className="mt-3 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>
                    Payments are processed securely via Stripe (or relevant
                    payment provider).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="">
          <h2 className="text-[22px] font-semibold text-[#1a1a1a] mb-5 tracking-tight">
            Select your bank account country
          </h2>

          <div className="flex gap-4">
            {options.map((option) => (
              <label
                key={option.id}
                className={`
              flex items-center w-[280px] p-4 border rounded-xl cursor-pointer transition-all duration-200
              ${
                selected === option.id
                  ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="bankCountry"
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => setSelected(option.id)}
                    className="sr-only"
                  />
                  <div
                    className={`
                w-5 h-5 rounded-full border flex items-center justify-center
                ${
                  selected === option.id ? "border-blue-600" : "border-gray-300"
                }
              `}
                  >
                    {selected === option.id && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </div>

                <span className="ml-4 font-bold text-gray-800 flex items-center gap-2 text-lg">
                  <Image
                    src={option.flag}
                    width={60}
                    height={60}
                    alt="Picture of the country"
                  />
                </span>
              </label>
            ))}
          </div>
        </div> */}

        {/* Payment Section */}
        <div className="py-16">
          <USAPaymentSection />
        </div>
      </div>
    </FormProvider>
  );
};

export default Terms;

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4">
    <div className="flex-shrink-0 w-[26px] h-[26px] border-[2.5px] border-[#4F6EF7] rounded-full flex items-center justify-center">
      <FiCheck className="text-[#4F6EF7] text-sm stroke-[4px]" />
    </div>
    <span className="text-gray-600 font-semibold text-[15px]">{text}</span>
  </div>
);
