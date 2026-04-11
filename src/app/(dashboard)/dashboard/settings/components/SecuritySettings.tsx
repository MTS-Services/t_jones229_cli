import React, { useState } from "react";
import { Shield, Smartphone, Monitor, MapPin, X } from "lucide-react";
import { SecuritySession } from "../types";
import { formatLastActive, getDeviceIcon } from "../utils";

export default function SecuritySettings() {
  const [sessions] = useState<SecuritySession[]>([
    {
      id: "1",
      device: "Desktop - Chrome",
      location: "New York, USA",
      lastActive: new Date().toISOString(),
      current: true,
    },
    {
      id: "2",
      device: "Mobile - Safari",
      location: "Los Angeles, USA",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      current: false,
    },
  ]);

  const handleTerminateSession = (sessionId: string) => {
    console.log("Terminating session:", sessionId);
    // Implementation would go here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Security Settings
      </h2>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Enable
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gray-600" />
            Active Sessions
          </h3>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">
                    {getDeviceIcon(session.device)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {session.device}
                      </p>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span>{formatLastActive(session.lastActive)}</span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Terminate session"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
