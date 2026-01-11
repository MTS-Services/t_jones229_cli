import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import MapLoader from "./GoogleMap";

export default function MeetingPointMap() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-4">
          Adjust the pin
        </h1>
        <p className="text-lg font-medium text-gray-600 mb-4">
          Click and drag the pin to the desired meeting location and leave clear
          instructions for how customers can get there.
        </p>
        <div className="space-y-6">
          <div className="rounded-md py-5 w-full">
            <MapLoader />
          </div>
          <div className="">
            {/*ZIP/Post code */}
            <div className="w-full">
              <label className="block text-base font-medium text-gray-600 mb-2">
                Add directions to your meeting point
              </label>
              <textarea
                rows={5}
                {...register("direction")}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
                placeholder="Provide some instructions here "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
