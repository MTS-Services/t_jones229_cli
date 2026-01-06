"use client";

import { Divider } from "antd";
import { X } from "lucide-react";
import React from "react";
import { BsSearch } from "react-icons/bs";
// import CheckboxGroup from "./CheckboxGroup";
import { fishingLocationsOptions } from "@/constant/CheckBoxLevel";

const fishingTechniquesOptions = [
  "Light tackle",
  "Heavy tackle",
  "Bottom Fishing",
  "Deep Sea Fishing",
  "Trolling",
  "Spinning",
  "Jigging",
  "Popping",
  "Fly fishing",
  "Drift fishing",
  "Kite fishing",
  "Bow fishing",
  "Spearfishing",
  "Flounder gigging",
  "Livebaiting",
  "Lure Fishing",
];

const policiesOptions = [
  "Catch and Release",
  "Keep Catch",
  "No Smoking",
  "Alcohol Allowed",
];

const priceInclusionsOptions = [
  "Bait",
  "Tackle",
  "Water",
  "Snacks",
  "Lunch",
  "Ice",
  "Fuel",
];

const fishingLocationsInitial = ["Lake", "River"];
const fishingTechniquesInitial = ["Trolling"];
const policiesInitial = ["Catch and Release"];
const priceInclusionsInitial = ["Bait", "Water"];

const FishingUI: React.FC = () => {
  const staticFilters = ["Salmon", "Tuna", "Bass"];

  return (
    <div className="bg-white">

      {/* Targeted Species */}
      <div className="">
        <h1 className="text-xl md:text-3xl font-bold mb-2">Targeted Species</h1>
        <p className="text-[#878787] mb-4">
          Choose which species customers can target on your trip.
        </p>

        <div className="w-full max-w-md py-6 space-y-4">
          <div>
            <div className="flex gap-3 rounded-full py-3 border px-4">
              <BsSearch className="text-[#e0e0e0] h-6 w-6" />
              <input
                type="text"
                placeholder="Search species..."
                className="w-full outline-none"
              />
            </div>

            <button className="mt-2 bg-[#ffaa33] text-white px-4 py-2 rounded-md">
              Add Species
            </button>
          </div>

          {staticFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {staticFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  <span>{filter}</span>
                  <button>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider />
      </div>

      {/* Checkbox Sections */}
      {/* <div className="px-5 md:px-14 space-y-6">
        <CheckboxGroup
          name="fishingLocation"
          options={fishingLocationsOptions}
          selectedValues={fishingLocationsInitial}
        />

        <CheckboxGroup
          name="fishingTechnique"
          options={fishingTechniquesOptions}
          selectedValues={fishingTechniquesInitial}
        />

        <CheckboxGroup
          name="policies"
          options={policiesOptions}
          selectedValues={policiesInitial}
        />

        <CheckboxGroup
          name="includedPrice"
          options={priceInclusionsOptions}
          selectedValues={priceInclusionsInitial}
        />
      </div> */}
    </div>
  );
};

export default FishingUI;
