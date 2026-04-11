import React, { useState } from "react";
import { Lock, Eye, EyeOff, Globe } from "lucide-react";
import { PrivacySettings as PrivacySettingsType } from "../types";

export default function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettingsType>({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataSharing: false,
  });

  const handleToggle = (
    key: keyof Omit<PrivacySettingsType, "profileVisibility">,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleVisibilityChange = (
    visibility: "public" | "private" | "friends",
  ) => {
    setSettings((prev) => ({
      ...prev,
      profileVisibility: visibility,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Lock className="w-5 h-5 text-blue-600" />
        Privacy Settings
      </h2>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-start gap-3 mb-3">
            <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Control who can see your profile information
              </p>
            </div>
          </div>
          <div className="ml-8 flex gap-2">
            {(["public", "private", "friends"] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleVisibilityChange(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.profileVisibility === option
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Show Email */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-start gap-3 flex-1">
            {settings.showEmail ? (
              <Eye className="w-5 h-5 text-gray-400 mt-0.5" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900">Show Email Address</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Make your email visible on your public profile
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("showEmail")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showEmail ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showEmail ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Show Phone */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-start gap-3 flex-1">
            {settings.showPhone ? (
              <Eye className="w-5 h-5 text-gray-400 mt-0.5" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900">Show Phone Number</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Make your phone number visible on your public profile
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("showPhone")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showPhone ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showPhone ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Data Sharing */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-start gap-3 flex-1">
            <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Allow sharing anonymized data for platform improvement
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("dataSharing")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.dataSharing ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.dataSharing ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
