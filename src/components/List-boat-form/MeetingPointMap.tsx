import { Divider } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import MapLoader from "./GoogleMap";

export default function MeetingPointMap() {
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

      <div className="py-12 px-5 md:px-14 min-h-screen">
        <h1 className=" text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-2">
          Adjust the pin
        </h1>
        <p className="text-base text-[#878787] font-normal leading-normal">
          Click and drag the pin to the desired meeting location and leave clear
          instructions for how customers can get there.
        </p>
        <div className="rounded-md py-5 w-full md:max-w-3xl">
          <MapLoader />
        </div>
        <div className=" max-w-4xl">
          {/*ZIP/Post code */}
          <div className="w-full">
            <label className="text-[#878787] text-base md:text-lg font-normal leading-8">
              Add directions to your meeting point
            </label>
            <textarea
              rows={5}
              {...register("direction")}
              className="w-full  px-3 py-2 text-base  border border-gray-300 mt-2"
              placeholder="Provide some instructions here "
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
