import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  MapPin,
  Building2,
  Globe,
  Mail,
  Phone,
  Navigation,
  LocateFixed,
} from "lucide-react";

export default function MeetingPoint() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <span className="text-red-500">⚠️</span>
        {error}
      </p>
    ) : null;

  return (
    <div className="">
      {/* Header Section */}

      {/* Map Preview Placeholder (Optional Enhancement) */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Location Tips
            </h3>
            <p className="text-sm text-blue-700">
              Be specific with your meeting point. Include landmarks, dock
              numbers, or marina names to help guests find you easily.
            </p>
          </div>
        </div>
      </div>

      {/* Address Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <LocateFixed className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Street Address
            </label>
            <input
              type="text"
              {...register("street", {
                required: "Street address is required",
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.street
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter street address, marina name, or dock number"
            />
            <ErrorMessage error={errors?.street?.message as string} />
            <p className="text-xs text-gray-500 mt-1">
              Include specific details like "Dock B, Slip 12" or "Main Marina
              Entrance"
            </p>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              {...register("city", {
                required: "City is required",
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.city
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter city name"
            />
            <ErrorMessage error={errors?.city?.message as string} />
          </div>

          {/* State/Province */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State / Province
            </label>
            <input
              type="text"
              {...register("state", {
                required: "State/Province is required",
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.state
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter state or province"
            />
            <ErrorMessage error={errors?.state?.message as string} />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Country
            </label>
            <select
              {...register("country", {
                required: "Country is required",
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.country
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
            >
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              {/* Add more countries as needed */}
            </select>
            <ErrorMessage error={errors?.country?.message as string} />
          </div>

          {/* ZIP/Post code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              {...register("postCode", {
                required: "ZIP/Postal code is required",
                pattern: {
                  value: /^[A-Z0-9\s-]+$/i,
                  message: "Please enter a valid postal code",
                },
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.postCode
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter ZIP or postal code"
            />
            <ErrorMessage error={errors?.postCode?.message as string} />
          </div>
        </div>
      </div>

      {/* Additional Meeting Instructions (Optional) */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Meeting Instructions (Optional)
          </h2>
        </div>

        <div>
          <textarea
            {...register("meetingInstructions")}
            rows={3}
            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white resize-none"
            placeholder="Add any additional details to help guests find you, such as: 'Look for the blue fishing boat with a white canopy' or 'Park in the main lot and walk to Dock A'"
          />
        </div>
      </div>

      {/* Contact Information (Optional Enhancement) */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("contactPhone")}
              className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              placeholder="+1 (555) 123-4567"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Share for day-of coordination
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Email Address
            </label>
            <input
              type="email"
              {...register("contactEmail")}
              className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              placeholder="captain@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Alternative contact method
            </p>
          </div>
        </div>
      </div>

      {/* Map Integration Suggestion */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 rounded-lg p-2">
            <MapPin className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Need to update your location?
            </h4>
            <p className="text-xs text-gray-600">
              You can add a Google Maps link or exact coordinates in the
              additional instructions to help guests navigate precisely to your
              meeting point.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
