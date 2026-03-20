import React from "react";
import { useFormContext } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";
import {
  X,
  Plus,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Fish,
  MapPin,
  Wrench,
  Trash2,
  Info,
  Search,
  Clock3,
  CalendarDays,
} from "lucide-react";

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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const bookingTypes = [
  {
    value: "Private",
    label: "Private ",
    description: "Exclusive to your group only",
  },
  {
    value: "Group",
    label: "Group ",
    description: "Open to individual sign-ups",
  },
];

export default function TripForm({
  index,
  onRemove,
}: {
  index: number;
  onRemove?: () => void;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const filters = watch(`trips.${index}.tripsSpecies`) || [];
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showTips, setShowTips] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && !filters.includes(trimmedQuery)) {
      setValue(`trips.${index}.tripsSpecies`, [...filters, trimmedQuery]);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const removeFilter = (filter: string) => {
    const updated = filters.filter((f: string) => f !== filter);
    setValue(`trips.${index}.tripsSpecies`, updated);
  };

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <Info className="h-3 w-3" />
        {error}
      </p>
    ) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
      {/* Header with Remove Button */}
      <div className="bg-gradient-to-r from-green-200 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 rounded-lg p-2">
              <Calendar className="h-5 w-5 text-orange-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Trip Package {index + 1}
              </h2>
              <p className="text-xs text-gray-500">
                Configure your trip details
              </p>
            </div>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
              aria-label="Remove trip"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Trip Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Name
            </label>
            <input
              type="text"
              {...register(`trips.${index}.tripName`, {
                required: "Trip name is required",
              })}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all ${
                errors?.trips?.[index]?.tripName
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="e.g., Morning Fishing Adventure"
            />
            <ErrorMessage
              error={errors?.trips?.[index]?.tripName?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register(`trips.${index}.tripsduration`, {
                  required: "Duration is required",
                  min: { value: 1, message: "Minimum 1 hour" },
                  valueAsNumber: true,
                })}
                className={`flex-1 p-3 border-2 rounded-lg outline-none transition-all ${
                  errors?.trips?.[index]?.tripsduration
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                }`}
                placeholder="Hours"
              />
              <div className="px-3 py-3 bg-gray-100 rounded-lg text-gray-600 text-sm">
                hours
              </div>
            </div>
            <ErrorMessage
              error={errors?.trips?.[index]?.tripsduration?.message as string}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            {...register(`trips.${index}.tripsdescription`, {
              required: "Description is required",
              minLength: {
                value: 20,
                message: "Please provide at least 20 characters",
              },
            })}
            className={`w-full p-3 border-2 rounded-lg outline-none transition-all resize-none ${
              errors?.trips?.[index]?.tripsdescription
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            }`}
            placeholder="Describe what guests can expect on this adventure..."
          />
          <ErrorMessage
            error={errors?.trips?.[index]?.tripsdescription?.message as string}
          />
        </div>

        {/* Days & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Users className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Booking Type
            </label>
            <div className="flex  gap-3">
              {bookingTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={type.value}
                    {...register(`trips.${index}.bookingType`)}
                    className="mt-2 w-4 h-4 cursor-pointer text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-700 group-hover:text-orange-600">
                      {type.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <CalendarDays className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Available Days
            </label>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={day}
                    {...register(`trips.${index}.tripDays`)}
                    className="w-4 h-4 text-orange-500 cursor-pointer border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                    {day.slice(0, 3)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <hr />
        {/* Price & Booking Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Price per person
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                {...register(`trips.${index}.tripsprice`, {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                className={`w-full pl-8 p-3 border-2 rounded-lg outline-none transition-all ${
                  errors?.trips?.[index]?.tripsprice
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                }`}
                placeholder="e.g., 199"
              />
            </div>
            <ErrorMessage
              error={errors?.trips?.[index]?.tripsprice?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock3 className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Departure Time
            </label>
            <select
              {...register(`trips.${index}.departureTime`, {
                required: "Departure time is required",
              })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
            >
              <option value="">Select departure time</option>
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
            <ErrorMessage
              error={errors?.trips?.[index]?.departureTime?.message as string}
            />
          </div>
        </div>

        {/* Note Box */}
        <div className="bg-slate-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                About Group Bookings
              </h3>
              <p className="text-sm text-blue-700">
                Group bookings allow users to sign up individually. The trip
                will be confirmed once enough people have booked.
              </p>
            </div>
          </div>
        </div>

        {/* Targeted Species */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Fish className="inline-block h-4 w-4 mr-2 text-orange-500" />
            Targeted Species
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-9 pr-3 p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Search for species..."
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Species Tags */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.map((filter: string) => (
                <span
                  key={filter}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                >
                  <Fish className="h-3 w-3" />
                  {filter}
                  <button
                    type="button"
                    onClick={() => removeFilter(filter)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Techniques & Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Wrench className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Fishing Techniques
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <CheckboxGroup
                name={`trips.${index}.fishingTechnique`}
                options={fishingTechniquesOptions}
                selectedValues={[]}
                register={register}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="inline-block h-4 w-4 mr-2 text-orange-500" />
              Fishing Locations
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <CheckboxGroup
                name={`trips.${index}.fishingLocation`}
                options={fishingLocationsOptions}
                selectedValues={[]}
                register={register}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
