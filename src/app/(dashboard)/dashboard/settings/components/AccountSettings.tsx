import React from "react";
import { User, Mail, Phone, Shield, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { User as UserType } from "../types";

interface AccountSettingsProps {
  user: UserType;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Account Settings
      </h2>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-start gap-3 flex-1">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
              {user.isEmailVerified && (
                <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/edit-user-details")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Change
          </button>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-start gap-3 flex-1">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-gray-900 font-medium">
                {user.phoneNumber || "Not set"}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/edit-user-details")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {user.phoneNumber ? "Change" : "Add"}
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-start gap-3 flex-1">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Password</p>
              <p className="text-gray-900 font-medium">••••••••</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/reset-password")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
