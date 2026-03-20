import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Type, Info, CheckCircle, AlertCircle } from "lucide-react";

export default function Description() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const titleValue = watch("listingTypeTitle") || "";
  const descriptionValue = watch("listingTypeDescription") || "";

  const titleRemaining = 50 - titleValue.length;
  const descriptionRemaining = 500 - descriptionValue.length;

  const isTitleValid = titleValue.length > 0 && titleValue.length <= 50;
  const isDescriptionValid =
    descriptionValue.length > 0 && descriptionValue.length <= 500;

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    ) : null;

  return (
    <div className="">
      {/* Listing Type Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Type</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Title Input */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              <Type className="inline-block h-5 w-5 mr-2 text-orange-500" />
              Listing Title
            </label>

            <input
              type="text"
              maxLength={51}
              {...register("listingTypeTitle", {
                required: "Listing title is required",
                maxLength: {
                  value: 50,
                  message: "Title must be at most 50 characters",
                },
                minLength: {
                  value: 10,
                  message: "Please provide at least 10 characters",
                },
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all ${
                errors?.listingTypeTitle
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : titleValue.length > 0 && titleValue.length <= 50
                    ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="e.g., Deep Sea Fishing Adventure, Luxury Yacht Charter, Sunset Cruise"
            />

            {/* Title Status */}
            <div className="flex justify-between items-center mt-2">
              <ErrorMessage
                error={errors?.listingTypeTitle?.message as string}
              />
              <div className="flex items-center gap-2">
                {titleValue.length > 0 &&
                  (isTitleValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ))}
                <span
                  className={`text-xs ${
                    titleRemaining < 10
                      ? "text-red-500 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {titleRemaining} characters remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Details Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Description
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              <FileText className="inline-block h-5 w-5 mr-2 text-orange-500" />
              Tell us about your charter
            </label>

            <textarea
              rows={6}
              maxLength={501}
              {...register("listingTypeDescription", {
                required: "Listing description is required",
                maxLength: {
                  value: 500,
                  message: "Description must be at most 500 characters",
                },
                minLength: {
                  value: 50,
                  message: "Please provide at least 50 characters",
                },
              })}
              className={`w-full p-4 border-2 rounded-lg outline-none transition-all resize-vertical ${
                errors?.listingTypeDescription
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : descriptionValue.length > 0 &&
                      descriptionValue.length <= 500
                    ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Describe your charter service in detail."
            />

            {/* Description Status */}
            <div className="flex justify-between items-center mt-2">
              <ErrorMessage
                error={errors?.listingTypeDescription?.message as string}
              />
              <div className="flex items-center gap-2">
                {descriptionValue.length > 0 &&
                  (isDescriptionValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ))}
                <span
                  className={`text-xs ${
                    descriptionRemaining < 50
                      ? "text-red-500 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {descriptionRemaining} characters remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
