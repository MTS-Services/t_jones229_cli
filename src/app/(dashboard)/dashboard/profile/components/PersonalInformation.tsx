import React from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  CheckCircle,
} from "lucide-react";
import { User } from "../types/profile.types";

interface PersonalInformationProps {
  user: User;
}

export default function PersonalInformation({
  user,
}: PersonalInformationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-blue-600" />
        Personal Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-gray-900 font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
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

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-gray-900 font-medium">
              {user.phoneNumber || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Registration Type</p>
            <p className="text-gray-900 font-medium capitalize">
              {user.registerType?.toLowerCase() || "Standard"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
