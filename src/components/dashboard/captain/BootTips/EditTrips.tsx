"use client";

import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import CheckboxGroup from "@/components/List-boat-form/CheckboxGroup";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetTripQuery, useUpdateTripMutation } from "@/redux/api/boatApi";
import { toast } from "react-toastify";

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

type TripFormValues = {
  tripName: string;
  description: string;
  duration: number;
  tripDays: string[];
  departureTime: string;
  price: number;
  species: string[];
  fishingLocation: string[];
  fishingTechnique: string[];
};

export default function EditTrip() {
  const params = useSearchParams();
  const tripId = params.get("id");
  const route = useRouter();
  const { data } = useGetTripQuery(tripId);

  const { register, setValue, watch, handleSubmit, reset } =
    useForm<TripFormValues>();

  useEffect(() => {
    if (data?.data) {
      const tripData = data.data;
      reset({
        tripName: tripData.tripName || "",
        description: tripData.description || "",
        duration: tripData.duration || 0,
        tripDays: tripData.tripDays || [],
        departureTime: tripData.departureTime || "",
        price: tripData.price || 0,
        species: tripData.features || [],
        fishingLocation: tripData.fishingLocation || [],
        fishingTechnique: tripData.fishingTechnique || [],
      });
    }
  }, [data, reset]);

  const filters = watch("species") || [];
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !filters.includes(searchQuery.trim())) {
      setValue("species", [...filters, searchQuery.trim()]);
      setSearchQuery("");
    }
  };

  const removeFilter = (filter: string) => {
    const updated = filters.filter((f: string) => f !== filter);
    setValue("species", updated);
  };

  const [updateFN, { isLoading }] = useUpdateTripMutation();
  const onSubmit = async (data: TripFormValues) => {
    try {
      const res = await updateFN({ tripId: tripId, data }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Trip updated successfully");
        route.push("/dashboard/boat-trip");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-300 rounded-md p-6 mb-8 relative"
    >
      <h2 className="text-xl font-semibold mb-4">Fishing Trip</h2>

      {/* Trip Name */}
      <div className="mb-4">
        <label className="block mb-1">Trip name</label>
        <input
          type="text"
          {...register("tripName")}
          className="w-full border p-2"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          rows={3}
          {...register("description")}
          className="w-full border p-2"
        />
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block mb-1">Duration (hours)</label>
        <input
          type="number"
          {...register("duration", { valueAsNumber: true })}
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
              <input type="checkbox" value={day} {...register("tripDays")} />{" "}
              {day}
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-4">
        <label className="block mb-1">Departure Time</label>
        <select {...register("departureTime")} className="w-full border p-2">
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
          {...register("price")}
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
          name="fishingLocation"
          options={fishingLocationsOptions}
          selectedValues={[]}
          register={register}
        />
      </div>

      {/* Fishing Techniques */}
      <div className="mb-4">
        <label className="block mb-1">Fishing Techniques</label>
        <CheckboxGroup
          name="fishingTechnique"
          options={fishingTechniquesOptions}
          selectedValues={[]}
          register={register}
        />
      </div>

      {/* Submit */}
      <div className="mt-6">
        <button
          type="submit"
          className="bg-[#ff9500] text-white px-6 py-2 rounded"
        >
          {isLoading ? "Updating..." : "Update Trip"}
        </button>
      </div>
    </form>
  );
}
