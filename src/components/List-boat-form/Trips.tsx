import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import TripForm from "./TripsForm";

export default function Trips() {
  const { control } = useFormContext();

  // Manage the trips array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trips",
  });

  // Add an initial trip if the array is empty (only runs once)
  React.useEffect(() => {
    if (fields.length === 0) {
      append({});
    }
  }, [fields, append]);

  return (
    <div className="px-5 md:px-14 py-8">
      <h1 className="text-3xl font-bold mb-6">Trips</h1>
      <p className="text-base text-textPrimary mb-4">
        Add one or more trips you offer.
      </p>

      {/* Render each trip form */}
      {fields.map((field, index) => (
        <TripForm
          key={field.id}
          index={index}
          onRemove={index > 0 ? () => remove(index) : undefined}
        />
      ))}

      <div className="  py-10">
        <div className="border border-blue-500 p-3 rounded-md max-w-4xl ">
          <h2 className="text-base md:text-lg font-bold text-gray-900 leading-7 ">
            Please note
          </h2>
          <p className="text-sm md:text-base text-textPrimary font-normal leading-5 md:leading-8">
            You can add multiple trips, if you wanted to add different durations
            for each trip for example, or allow users to fish different species
            etc.
          </p>
        </div>
      </div>
      {/* Add another trip */}
      <button
        type="button"
        onClick={() => append({})}
        className="bg-[#ffaa33] text-white px-4 py-2 rounded-[14px] text-lg mt-4"
      >
        + Add another trip
      </button>
    </div>
  );
}
