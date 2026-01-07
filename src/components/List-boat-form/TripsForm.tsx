import React from "react";
import { useFormContext } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";
import { X } from "lucide-react";

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

      {/* Duration */}
      <div className="mb-4">
        <label className="block mb-1">Duration (hours)</label>
        <input
          type="number"
          {...register(`trips.${index}.tripsduration`, { valueAsNumber: true })}
          className="w-full border p-2"
        />
      </div>

      {/* Days */}
      <div className="mb-4">
        <label className="block mb-1">Available Days</label>
        <div className="flex flex-wrap gap-3">
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
        <label className="block mb-1">Departure Time</label>
        <select
          {...register(`trips.${index}.departureTime`)}
          className="w-full border p-2"
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
}
