import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function Discription() {
  const { register, watch } = useFormContext();

  return (
    <div className="space-y-6 ">
      <div className="">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-4">
          Listing Type
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
          {/* Listing Type */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Title:
            </label>
            <input
              type="text"
              maxLength={51}
              {...register("listingTypeTitle")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
              placeholder="Add your listing title"
            />

            {watch("listingTypeTitle") ? (
              <p
                className={`text-sm mt-2 ${
                  watch("listingTypeTitle").length >= 50
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {watch("listingTypeTitle").length < 50
                  ? `${
                      50 - watch("listingTypeTitle").length
                    } characters remaining`
                  : "Title must be at most 50 characters"}
              </p>
            ) : (
              <p className="text-gray-500 mt-2">50 characters remaining</p>
            )}
          </div>
        </div>
        <Divider style={{ borderColor: "#d9d9d9" }}></Divider>

        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-4">
          Add your listing description
        </h1>
        <div className=" max-w-4xl  pb-8">
          {/* Listing Type */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Tell us about the charter services you offer.
            </label>
            <textarea
              rows={5}
              maxLength={501}
              {...register("listingTypeDescription")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
              placeholder="Provide some instructions here"
            />
            {watch("listingTypeDescription") ? (
              <p
                className={`text-sm mt-2 ${
                  watch("listingTypeDescription")?.length >= 500
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {watch("listingTypeDescription")?.length <= 500
                  ? `${
                      500 - watch("listingTypeDescription")?.length
                    } characters remaining`
                  : "Discription must be at most 500 characters"}
              </p>
            ) : (
              <p className="text-gray-500 mt-2">500 haracters remaining</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
