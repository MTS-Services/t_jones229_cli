import { Divider } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapPin,
  Building2,
  Globe,
  Mail,
  Phone,
  Navigation,
  LocateFixed,
  Search,
  Loader2,
} from "lucide-react";
import AddressMap from "./AddressMap";

const COUNTRY_CODE_MAP: Record<string, string> = {
  us: "United States",
  gb: "United Kingdom",
  ca: "Canada",
  au: "Australia",
};

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

export default function MeetingPoint() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  // Controlled values — re-render whenever AddressMap calls setValue
  const watchedStreet = watch("street") || "";
  const watchedCity = watch("city") || "";
  const watchedState = watch("state") || "";
  const watchedCountry = watch("country") || "";
  const watchedPostCode = watch("postCode") || "";

  // Pre-extract register props so we can add value + override onChange
  const cityProps = register("city", { required: "City is required" });
  const stateProps = register("state", { required: "State/Province is required" });
  const countryProps = register("country", { required: "Country is required" });
  const postCodeProps = register("postCode", {
    required: "ZIP/Postal code is required",
    pattern: { value: /^[A-Z0-9\s-]+$/i, message: "Please enter a valid postal code" },
  });

  const [streetQuery, setStreetQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced autocomplete search (only US, UK, Canada, Australia)
  useEffect(() => {
    if (streetQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(streetQuery)}&format=json&limit=5&countrycodes=us,gb,ca,au&addressdetails=1`,
          { headers: { "Accept-Language": "en" } },
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      }
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [streetQuery]);

  const handleSuggestionSelect = (s: Suggestion) => {
    const a = s.address;
    const street =
      [a.house_number, a.road].filter(Boolean).join(" ") || a.road || "";
    const city =
      a.city || a.town || a.village || a.municipality || a.county || "";
    const countryCode = a.country_code?.toLowerCase() || "";
    const country = COUNTRY_CODE_MAP[countryCode] || "";
    setValue("street", street);
    setValue("city", city);
    setValue("state", a.state || "");
    setValue("postCode", a.postcode || "");
    if (country) setValue("country", country);
    setValue("location", {
      latitude: parseFloat(s.lat),
      longitude: parseFloat(s.lon),
    });
    setStreetQuery(street);
    setShowSuggestions(false);
  };

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <span className="text-red-500">⚠️</span>
        {error}
      </p>
    ) : null;

  const streetProps = register("street", { required: "Street address is required" });

  return (
    <div className="">
      {/* Location Tips */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Location Tips
            </h3>
            <p className="text-sm text-blue-700">
              Be specific with your meeting point. Include landmarks, dock
              numbers, or marina names to help guests find you easily.
            </p>
          </div>
        </div>
      </div>

      {/* Address Details + Embedded Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <LocateFixed className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street Address with autocomplete */}
          <div className="md:col-span-2 relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Street Address
            </label>
            <div className="relative">
              <input
                type="text"
                {...streetProps}
                value={watchedStreet}
                onChange={(e) => {
                  streetProps.onChange(e);
                  setStreetQuery(e.target.value);
                }}
                className={`w-full p-3 pr-10 border-2 rounded-lg outline-none transition-all bg-white ${
                  errors?.street
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                }`}
                placeholder="Enter street address, marina name, or dock number"
                autoComplete="off"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </span>
            </div>
            <ErrorMessage error={errors?.street?.message as string} />
            <p className="text-xs text-gray-500 mt-1">
              Include specific details like &quot;Dock B, Slip 12&quot; or &quot;Main Marina
              Entrance&quot;
            </p>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0 flex items-start gap-2"
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur before click
                      handleSuggestionSelect(s);
                    }}
                  >
                    <MapPin className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{s.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              {...cityProps}
              value={watchedCity}
              onChange={(e) => cityProps.onChange(e)}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.city
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter city name"
            />
            <ErrorMessage error={errors?.city?.message as string} />
          </div>

          {/* State/Province */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State / Province
            </label>
            <input
              type="text"
              {...stateProps}
              value={watchedState}
              onChange={(e) => stateProps.onChange(e)}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.state
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter state or province"
            />
            <ErrorMessage error={errors?.state?.message as string} />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Country
            </label>
            <select
              {...countryProps}
              value={watchedCountry}
              onChange={(e) => countryProps.onChange(e)}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.country
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
            >
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
            <ErrorMessage error={errors?.country?.message as string} />
          </div>

          {/* ZIP/Post code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              {...postCodeProps}
              value={watchedPostCode}
              onChange={(e) => postCodeProps.onChange(e)}
              className={`w-full p-3 border-2 rounded-lg outline-none transition-all bg-white ${
                errors?.postCode
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
              placeholder="Enter ZIP or postal code"
            />
            <ErrorMessage error={errors?.postCode?.message as string} />
          </div>
        </div>

        {/* Map — inside Address Details card */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">Pin Your Location</span>
            <span className="text-xs text-gray-400 ml-1">— auto-filled from address, or click map to adjust</span>
          </div>
          <AddressMap />
        </div>
      </div>

      {/* Meeting Instructions (Optional) */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Meeting Instructions (Optional)
          </h2>
        </div>

        <div>
          <textarea
            {...register("meetingInstructions")}
            rows={3}
            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white resize-none"
            placeholder="Add any additional details to help guests find you, such as: 'Look for the blue fishing boat with a white canopy' or 'Park in the main lot and walk to Dock A'"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("contactPhone")}
              className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              placeholder="+1 (555) 123-4567"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Share for day-of coordination
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline-block h-4 w-4 mr-2 text-gray-500" />
              Email Address
            </label>
            <input
              type="email"
              {...register("contactEmail")}
              className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              placeholder="captain@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Alternative contact method
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

