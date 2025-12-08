import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function MeetingPoint() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
        <h1 className="text-3xl font-bold text-textPrimary leading-normal mb-2">
          Meeting Point
        </h1>
        <p className="text-base text-textPrimary font-normal leading-normal">
          Upload high quality photos and videos to maximise conversion rates
          with potential customers.
        </p>
      </div>

      <div className="py-12 px-5 md:px-14 max-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
          {/* Street address */}
          <div>
            <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
              Street address
            </label>
            <input
              type="text"
              {...register("street")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your street no"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your city"
            />
          </div>
          {/*Country */}
          <div>
            <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
              Country
            </label>
            <input
              type="text"
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your country"
            />
          </div>
          {/*ZIP/Post code */}
          <div>
            <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
              ZIP/Post code
            </label>
            <input
              type="text"
              {...register("postCode")}
              className="w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your zip code"
            />
          </div>
        </div>
      </div>
      <div className="px-14">
        <Divider style={{ borderColor: "#d9d9d9" }}></Divider>
      </div>
    </div>
  );
}
