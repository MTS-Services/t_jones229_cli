import React, { useState } from "react";
import { Bell, Mail, Calendar, Tag } from "lucide-react";
import { NotificationSettings as NotificationSettingsType } from "../types";

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    emailNotifications: true,
    bookingUpdates: true,
    promotionalEmails: false,
    tripReminders: true,
  });

  const handleToggle = (key: keyof NotificationSettingsType) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // Here you would typically save to backend
  };

  const notificationOptions = [
    {
      key: "emailNotifications" as keyof NotificationSettingsType,
      icon: Mail,
      label: "Email Notifications",
      description: "Receive email updates about your account",
    },
    {
      key: "bookingUpdates" as keyof NotificationSettingsType,
      icon: Calendar,
      label: "Booking Updates",
      description: "Get notified about booking confirmations and changes",
    },
    {
      key: "tripReminders" as keyof NotificationSettingsType,
      icon: Bell,
      label: "Trip Reminders",
      description: "Receive reminders before your upcoming trips",
    },
    {
      key: "promotionalEmails" as keyof NotificationSettingsType,
      icon: Tag,
      label: "Promotional Emails",
      description: "Receive special offers and updates",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-600" />
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-3 flex-1">
                <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(option.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[option.key] ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[option.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
