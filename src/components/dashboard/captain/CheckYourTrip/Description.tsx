"use client";

import { Divider } from "antd";
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

// 1. Input Fields Component
const DescriptionFormFields: React.FC = () => {
  const { register, watch } = useFormContext();

  // Watch values for character counting
  const titleValue = watch("listingTypeTitle") || "";
  const descValue = watch("listingTypeDescription") || "";

  return (
    <div className="">
      {/* Listing Type Section */}
      <section className="">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-6">
          Listing Type
        </h1>
        <div className="max-w-lg">
          <label className="block text-gray-600 text-base mb-2">Title:</label>
          <input
            type="text"
            maxLength={50}
            {...register("listingTypeTitle")}
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
            placeholder="Add your listing title"
          />
          <p className="text-gray-400 text-sm mt-1">
            {50 - titleValue.length} characters remaining
          </p>
        </div>
      </section>

      <div className="my-10">
        <Divider style={{ borderColor: "#eeeeee" }} />
      </div>

      {/* Description Section */}
      <section className="">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Add your listing description
        </h1>
        <p className="text-gray-500 mb-6">
          Add directions to your meeting point
        </p>

        <div className="max-w-4xl relative">
          <textarea
            rows={6}
            maxLength={500}
            {...register("listingTypeDescription")}
            // className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
            placeholder="Provide some instructions here"
          />
          <p className="text-gray-400 text-sm mt-1">
            {500 - descValue.length} characters remaining
          </p>
        </div>
      </section>

      <div className="my-10">
        <Divider style={{ borderColor: "#eeeeee" }} />
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between mt-12 pt-4">
        <button
          type="button"
          className="flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-2 rounded-full hover:bg-gray-50 transition-all font-medium"
        >
          <span className="text-lg">‹</span> Back
        </button>

        <button
          type="submit"
          className="bg-[#F2A93B] hover:bg-[#e0962d] text-white px-10 py-2 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-sm"
        >
          Next <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

// 2. Main Wrapper Component
const Description: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      listingTypeTitle: "",
      listingTypeDescription: "",
    },
  });

  // Next button click korle ei function call hobe
  const onHandleNext = (data: any) => {
    console.log("Submitted Form Data:", data);
    alert("Data check console: " + JSON.stringify(data));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onHandleNext)}>
        <DescriptionFormFields />
      </form>
    </FormProvider>
  );
};

export default Description;
