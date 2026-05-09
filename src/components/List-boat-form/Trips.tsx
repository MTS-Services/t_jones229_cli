import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import TripForm from "./TripsForm";
import { Plus, Info, Calendar, Clock, AlertCircle } from "lucide-react";

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

  const handleAddTrip = () => {
    append({});
    // Scroll to the new trip form
    setTimeout(() => {
      const tripForms = document.querySelectorAll("[data-trip-form]");
      const lastForm = tripForms[tripForms.length - 1];
      if (lastForm) {
        lastForm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="">
      {/* Header Section */}

      {/* Trip Counter */}
      <div className="mb-6 flex items-center justify-between">
        {fields.length >= 5 && (
          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <AlertCircle className="h-3 w-3" />
            Maximum 5 trips recommended
          </div>
        )}
      </div>

      {/* Trips List */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} data-trip-form className="relative">
            <TripForm
              index={index}
              onRemove={index > 0 ? () => remove(index) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Add Trip Button */}
      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={handleAddTrip}
          className="group bg-white border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 text-orange-600 hover:text-orange-700 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center gap-2"
          disabled={fields.length >= 10}
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
          Add Another Trip Package
        </button>
        {fields.length >= 10 && (
          <p className="text-xs text-red-500 mt-2">
            Maximum 10 trips allowed per listing
          </p>
        )}
        {fields.length === 1 && fields.length < 5 && (
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Add more trips to offer more options to your guests
          </p>
        )}
      </div>

      {/* Information Note */}
      <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Why add multiple trips?
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              You can add multiple trips to offer different experiences for your
              guests. For example, you might want to offer:
            </p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Half-day vs. full-day fishing trips</span>
              </li>
              <li className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  Different target species (Tuna fishing vs. Bottom fishing)
                </span>
              </li>
              <li className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Sunset cruises vs. daytime adventures</span>
              </li>
              <li className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Private charters vs. shared group experiences</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Section (Optional Enhancement) */}
      {fields.length > 1 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            Trip Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {fields.map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Trip {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
