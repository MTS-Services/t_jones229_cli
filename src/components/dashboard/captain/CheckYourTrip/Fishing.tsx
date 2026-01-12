"use client";

import { Divider } from "antd";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { BsSearch } from "react-icons/bs";
import CheckboxGroupTwo from "./CheckboxGroupPropsTwo";

// Define form data interface
interface FishingFormData {
  fishingSpecies: string[];
  fishingLocation: string[];
  fishingTechnique: string[];
  policies: string[];
  includedPrice: string[];
}

// Options
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
];

export default function Fishing() {
  // 1. Initialize useForm with proper typing
  const methods = useForm<FishingFormData>({
    defaultValues: {
      fishingSpecies: [],
      fishingLocation: [],
      fishingTechnique: [],
      policies: [],
      includedPrice: [],
    },
  });

  // 2. Destructure methods directly
  const { register, setValue, watch, handleSubmit } = methods;

  const [searchQuery, setSearchQuery] = useState("");

  // Watch fishingSpecies with proper typing
  const fishingSpecies = watch("fishingSpecies");

  const onSubmit = (data: FishingFormData) => {
    console.log("Collected Form Data:", data);
    alert("Form Submitted! Check Console.");
  };

  const addSpecies = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || fishingSpecies.includes(trimmedQuery)) {
      setSearchQuery("");
      return;
    }
    setValue("fishingSpecies", [...fishingSpecies, trimmedQuery]);
    setSearchQuery("");
  };

  const removeSpecies = (value: string) => {
    setValue(
      "fishingSpecies",
      fishingSpecies.filter((f: string) => f !== value)
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white">
          <div className="bg-[#F5F5F5] px-5 py-6">
            <h1 className="text-3xl font-bold">Fishing</h1>
          </div>

          <div className="px-5 py-10">
            <h2 className="text-xl font-bold mb-2">Targeted Species</h2>
            <div className="max-w-md">
              <div className="flex gap-3 border rounded-full px-4 py-2 bg-white">
                <BsSearch className="text-gray-300 mt-1" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSpecies();
                    }
                  }}
                  placeholder="Search species..."
                  className="w-full outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addSpecies}
                className="mt-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition-colors"
              >
                Add Species
              </button>

              <div className="flex flex-wrap gap-2 mt-4">
                {fishingSpecies.map((item: string) => (
                  <span
                    key={item}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer text-red-500"
                      onClick={() => removeSpecies(item)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <Divider />

            <CheckboxGroupTwo
              title="Fishing Locations"
              name="fishingLocation"
              options={["Inshore", "Offshore", "Reef"]}
              register={register}
            />
            <CheckboxGroupTwo
              title="Fishing Techniques"
              name="fishingTechnique"
              options={fishingTechniquesOptions}
              register={register}
            />
            <CheckboxGroupTwo
              title="Policies"
              name="policies"
              options={policiesOptions}
              register={register}
            />
            <CheckboxGroupTwo
              title="Included in Price"
              name="includedPrice"
              options={priceInclusionsOptions}
              register={register}
            />

            <button
              type="submit"
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
            >
              Submit Fishing Details
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
