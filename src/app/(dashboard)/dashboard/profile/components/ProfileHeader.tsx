import React, { useState } from "react";
import {
  Mail,
  Shield,
  Edit,
  Camera,
  Settings,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "../types/profile.types";
import { getRoleBadgeColor, getStatusBadge } from "../utils/formatters";
import { getUserInitials } from "../utils/helpers";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter();
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const statusBadge = getStatusBadge(user.status);
  const StatusIcon = statusBadge.icon;
  const userInitials = getUserInitials(user.firstName, user.lastName);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 gap-4">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div
              className="relative group"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-4xl font-bold text-white">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>
              {isHoveringAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl cursor-pointer transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)}`}
                >
                  <Shield className="w-4 h-4" />
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {user.status}
                </span>
                {user.isEmailVerified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/dashboard/edit-user-details")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => router.push("/dashboard/reset-password")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
