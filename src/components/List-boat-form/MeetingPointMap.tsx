import {
  MapPin,
  Navigation,
  Info,
  Compass,
  Clock,
  Phone,
  Map,
  PenTool,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import MapLoader from "./GoogleMap";

export default function MeetingPointMap() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const [showTips, setShowTips] = useState(false);
  const directions = watch("direction");

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    ) : null;

  return (
    <div className="">
      {/* Header Section */}

      {/* Instructions Card */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              How to set your meeting point
            </h3>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Click anywhere on the map to place a pin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>The pin shows exactly where customers will meet you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Add detailed directions below to help customers find you
                  easily
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Interactive Map
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Click anywhere on the map to set your exact meeting location
            </p>
          </div>
          <div className="relative">
            <MapLoader />
            {/* Map Overlay Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 pointer-events-none">
              <MapPin className="h-3 w-3" />
              Click on map to set meeting point
            </div>
          </div>
        </div>
      </div>

      {/* Directions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Meeting Instructions
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Help guests find you with clear, detailed directions
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <PenTool className="h-4 w-4" />
            {showTips ? "Hide Tips" : "Writing Tips"}
          </button>
        </div>

        {/* Writing Tips Collapsible */}
        {showTips && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Tips for Great Directions:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">📍</span>
                  <span>
                    Mention nearby landmarks ("Next to the red lighthouse")
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">🅿️</span>
                  <span>Include parking information if needed</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">⚓</span>
                  <span>Specify which dock, pier, or entrance to use</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">📞</span>
                  <span>Add your contact info for last-minute questions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">👕</span>
                  <span>
                    Mention what you'll be wearing or how to identify you
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-600">⏰</span>
                  <span>Specify arrival time and where to wait</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Detailed Meeting Instructions *
          </label>
          <textarea
            rows={6}
            {...register("direction", {
              required: "Please provide meeting point directions",
              minLength: {
                value: 20,
                message: "Please provide at least 20 characters of detail",
              },
            })}
            className={`w-full p-4 border-2 rounded-lg outline-none transition-all resize-vertical min-h-[140px] ${
              errors?.direction
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            }`}
            placeholder="Example: Meet at the main dock next to Harbor Master's office. Look for a blue and white boat named 'Sea Adventure'. I'll be wearing a red captain's hat. Parking is available in the marina lot - $5 for the day. Please arrive 15 minutes before departure. If you can't find me, call (555) 123-4567."
          />
          <div className="flex justify-between items-center mt-2">
            <ErrorMessage error={errors?.direction?.message as string} />
            <span className="text-xs text-gray-400">
              {directions?.length || 0} characters
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Be as specific as possible. Clear directions help guests arrive on
            time and stress-free.
          </p>
        </div>

        {/* Quick Reference Template */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700">
              Quick Reference Template:
            </h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 font-mono">
            <p className="mb-1">• Meeting location: ___________</p>
            <p className="mb-1">• What to look for: ___________</p>
            <p className="mb-1">• Parking: ___________</p>
            <p className="mb-1">• Arrival time: ___________</p>
            <p className="mb-1">• Contact: ___________</p>
          </div>
        </div>

        {/* Pro Tip Banner */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-lg p-1.5">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-blue-700">
                Clear, detailed directions reduce confusion and ensure your
                customers arrive on time and ready for their adventure! Consider
                sharing a WhatsApp or phone number for day-of coordination.
              </p>
            </div>
          </div>
        </div>

        {/* Success Indicator */}
        {directions && directions.length > 50 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">
                Great! Your directions are detailed and will help guests find
                you easily.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
