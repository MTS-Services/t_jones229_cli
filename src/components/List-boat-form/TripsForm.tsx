import React from "react";
import { useFormContext } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";
import { X } from "lucide-react";

const fishingLocationsOptions = [
  "River",
  "Lake",
  "Inshore",
  "Nearshore",
  "Offshore",
  "Reef",
  "Wreck",
  "Flats",
  "Backcountry",
];

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
  "Handline",
  "Spearfishing",
  "Ice fishing",
  "Flounder gigging",
];

export default function TripForm({
  index,
  onRemove,
}: {
  index: number;
  onRemove?: () => void;
}) {
  const { register, setValue, watch } = useFormContext();
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
        <label className="block text-base font-medium text-gray-600 mb-2">
          Trip name
        </label>
        <input
          type="text"
          {...register(`trips.${index}.tripName`)}
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
        />
      </div>
      {/* Description */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          {...register(`trips.${index}.tripsdescription`)}
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
        />
      </div>
      {/* Duration */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Duration (hours)
        </label>
        <input
          type="number"
          {...register(`trips.${index}.tripsduration`, { valueAsNumber: true })}
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
        />
      </div>
      {/* Days */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Select days this trip is available:
        </label>
        <div className="flex flex-wrap gap-3 text-base font-medium text-gray-600">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                {...register(`trips.${index}.tripDays`)}
              />{" "}
              {day}
            </label>
          ))}
        </div>
      </div>
      {/* Departure Time */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Departure Time
        </label>
        <select
          {...register(`trips.${index}.departureTime`)}
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
        >
          <option value="">Select time</option>
          {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((h) => (
            <option key={h} value={h}>
              {h < 12
                ? `${h}:00 AM`
                : h === 12
                ? "12:00 PM"
                : `${h - 12}:00 PM`}
            </option>
          ))}
        </select>
      </div>
      {/* Price */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Price ($)
        </label>
        <input
          type="number"
          {...register(`trips.${index}.tripsprice`)}
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
        />
      </div>
      {/*  Shared group */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Shared group bookings or private booking only?
        </label>
        <div className="flex flex-wrap gap-3 text-base font-medium text-gray-600">
          {["Private", "Group booking"].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                {...register(`trips.${index}.tripDays`)}
              />{" "}
              {day}
            </label>
          ))}
        </div>
      </div>
      {/* Add another trip */}{" "}
      <div className="border border-[#0f5e9e] p-3 rounded-md w-full my-5">
        <h2 className="text-base md:text-lg font-bold text-gray-900 leading-7 ">
          Please note
        </h2>
        <p className="text-sm md:text-base text-textPrimary font-normal leading-5 md:leading-8">
          Group bookings allow users to sign up to the trip individually, if the
          date fills with enough people then the book will be confirmed.
        </p>
      </div>
      {/* Targeted Species */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-600 mb-2">
          Targeted Species
        </label>
        <div className="flex items-center gap-2 ">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between"
            placeholder="Search species..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-3 rounded h-12"
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
      <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-6 gap-4">
        {/* Fishing Techniques */}
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-600 mb-2">
            Fishing Techniques
          </label>
          <CheckboxGroup
            name={`trips.${index}.fishingTechnique`}
            options={fishingTechniquesOptions}
            selectedValues={[]}
            register={register}
          />
        </div>

        {/* Fishing Locations */}
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-600 mb-2">
            Fishing Locations
          </label>
          <CheckboxGroup
            name={`trips.${index}.fishingLocation`}
            options={fishingLocationsOptions}
            selectedValues={[]}
            register={register}
          />
        </div>
      </div>
    </div>
  );
}
