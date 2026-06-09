"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import CheckboxGroup from "./CheckboxGroup";
import TripSchedulePicker from "@/components/availability/TripSchedulePicker";

export interface Trip {
  tripName?: string;
  tripsdescription?: string;
  tripsduration?: number;
  tripDays?: string[];
  departureTime?: string;
  tripsprice?: number;
  tripsSpecies?: string[];
  fishingLocation?: string[];
  fishingTechnique?: string[];
}

const fishingLocationsOptions = [
  "Reefs",
  "Wrecks",
  "Inshore",
  "Offshore",
  "River",
  "Lake",
  "Harbor",
];

const fishingTechniquesOptions = [
  "Trolling",
  "Jigging",
  "Bottom Fishing",
  "Fly Fishing",
  "Spearfishing",
];

const TripForm: React.FC<{
  index: number;
  onRemove?: () => void;
}> = ({ index, onRemove }) => {
  const { register, setValue, watch } = useFormContext<any>();
  const filters = watch(`trips.${index}.tripsSpecies`) || [];
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !filters.includes(searchQuery.trim())) {
      setValue(`trips.${index}.tripsSpecies`, [...filters, searchQuery.trim()]);
      setSearchQuery("");
    }
  };

  const removeFilter = (filter: string) => {
    const updated = filters.filter((f: string) => f !== filter);
    setValue(`trips.${index}.tripsSpecies`, updated);
  };

  return (
    <div className="border border-gray-300 rounded-md p-6 mb-8 relative">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 text-sm text-red-500"
        >
          Remove
        </button>
      )}

      <h2 className="text-xl font-semibold mb-4">Trip {index + 1}</h2>

      {/* Trip Name */}
      <div className="mb-4">
        <label className="block mb-1">Trip name</label>
        <input
          type="text"
          {...register(`trips.${index}.tripName`)}
          className="w-full border p-2"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          rows={3}
          {...register(`trips.${index}.tripsdescription`)}
          className="w-full border p-2"
        />
      </div>

      <div className="mb-4">
        <TripSchedulePicker
          value={watch(`trips.${index}.schedules`) || []}
          onChange={(val) => setValue(`trips.${index}.schedules`, val)}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block mb-1">Price ($)</label>
        <input
          type="number"
          {...register(`trips.${index}.tripsprice`)}
          className="w-full border p-2"
        />
      </div>

      {/* Targeted Species */}
      <div className="mb-4">
        <label className="block mb-1">Targeted Species</label>
        <div className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border p-2"
            placeholder="Search species..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.map((filter: string) => (
            <span
              key={filter}
              className="bg-gray-200 px-3 py-1 rounded-full flex items-center text-sm"
            >
              {filter}
              <button onClick={() => removeFilter(filter)}>
                <X className="h-3 w-3 ml-2" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Fishing Locations */}
      <div className="mb-4">
        <label className="block mb-1">Fishing Locations</label>
        <CheckboxGroup
          name={`trips.${index}.fishingLocation`}
          options={fishingLocationsOptions}
          selectedValues={[]}
          register={register}
        />
      </div>

      {/* Fishing Techniques */}
      <div className="mb-4">
        <label className="block mb-1">Fishing Techniques</label>
        <CheckboxGroup
          name={`trips.${index}.fishingTechnique`}
          options={fishingTechniquesOptions}
          selectedValues={[]}
          register={register}
        />
      </div>
    </div>
  );
};

export default TripForm;
