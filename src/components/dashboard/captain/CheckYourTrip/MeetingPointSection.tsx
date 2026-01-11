"use client";
import React from "react";
import { Divider } from "antd";
import { useFormContext } from "react-hook-form";

const MeetingPointSection: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 ">
      <div className="py-12 px-5 md:px-14 max-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
          <div>
            <label className="block text-sm mb-1">
              Street address
            </label>
            <input
              type="text"
              {...register("street")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-300"
              placeholder="Enter your street no"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-300"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Country
            </label>
            <input
              type="text"
              {...register("country")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-300"
              placeholder="Enter your country"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              ZIP/Post code
            </label>
            <input
              type="text"
              {...register("postCode")}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-300"
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
};

export default MeetingPointSection;
