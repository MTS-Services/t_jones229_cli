import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function MeetingPoint() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 md:gap-6 gap-4">
          {/* Street address */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Street address
            </label>
            <input
              type="text"
              {...register("street")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between bg-white"
              placeholder="Enter your street no"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between bg-white"
              placeholder="Enter your city"
            />
          </div>
          {/*Country */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Country
            </label>
            <input
              type="text"
              {...register("country")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between bg-white"
              placeholder="Enter your country"
            />
          </div>
          {/*ZIP/Post code */}
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              ZIP/Post code
            </label>
            <input
              type="text"
              {...register("postCode")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between bg-white"
              placeholder="Enter your zip code"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
