import React from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { CaptainUser } from "../types/types";
import { formatDate } from "../utils/utils";

interface PersonalInfoCardProps {
  user: CaptainUser;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Captain Personal Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
              {user.id}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Mail className="h-4 w-4 text-blue-300" />
              Email Address
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Phone className="h-4 w-4 text-blue-300" />
              Phone Number
            </label>
            <p className="text-gray-900">
              {user.phoneNumber || "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="text-gray-900">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-300" />
              Joined Date
            </label>
            <p className="text-gray-900">{formatDate(user.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-300" />
              Last Updated
            </label>
            <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
