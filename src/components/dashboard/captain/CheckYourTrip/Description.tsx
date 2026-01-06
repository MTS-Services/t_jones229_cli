"use client";

import { Divider } from "antd";
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

const DescriptionFormFields: React.FC = () => {
  const { register, watch } = useFormContext();

  return (
    <div className="space-y-6 ">

      <div className=" min-h-screen">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-6">
          Listing Type
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4 pb-8">
          {/* Listing Type */}
          <div>
            <label className="text-textSecondary text-base md:text-lg font-normal leading-8">
              Title:
            </label>
            <input
              type="text"
              maxLength={51}
              {...register("listingTypeTitle")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Add your listing title"
            />

            {watch("listingTypeTitle") ? (
              <p
                className={`text-sm ${
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
              <p className="text-gray-500">50 characters remaining</p>
            )}
          </div>
        </div>
        <Divider style={{ borderColor: "#d9d9d9" }} />

        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-6">
          Add your listing description
        </h1>
        <div className="max-w-4xl pb-8">
          <div>
            <label className="text-textSecondary text-base font-normal leading-8 mb-2">
              Tell us about the charter services you offer.
            </label>
            <textarea
              rows={5}
              maxLength={501}
              {...register("listingTypeDescription")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Provide some instructions here"
            />
            {watch("listingTypeDescription") ? (
              <p
                className={`text-sm ${
                  watch("listingTypeDescription")?.length >= 500
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {watch("listingTypeDescription")?.length <= 500
                  ? `${
                      500 - watch("listingTypeDescription")?.length
                    } characters remaining`
                  : "Description must be at most 500 characters"}
              </p>
            ) : (
              <p className="text-gray-500">500 characters remaining</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-14">
        <Divider style={{ borderColor: "#d9d9d9" }} />
      </div>
    </div>
  );
};

const Description: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      listingTypeTitle: "",
      listingTypeDescription: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <DescriptionFormFields />
      </form>
    </FormProvider>
  );
};

export default Description;
