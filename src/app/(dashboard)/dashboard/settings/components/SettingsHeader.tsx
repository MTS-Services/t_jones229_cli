import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
    </div>
  );
}
