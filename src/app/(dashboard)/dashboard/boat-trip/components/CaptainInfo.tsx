import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { Captain } from "../types";

interface CaptainInfoProps {
  captain: Captain;
}

export const CaptainInfo: React.FC<CaptainInfoProps> = ({ captain }) => {
  return (
    <div className="mb-6 bg-slate-50 p-4 rounded-xl">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <User className="w-4 h-4 mr-2" />
        Captain Information
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>
            {captain.firstName} {captain.lastName}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <a
            href={`mailto:${captain.email}`}
            className="truncate hover:text-blue-600 transition-colors"
          >
            {captain.email}
          </a>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <a
            href={`tel:${captain.phoneNumber}`}
            className="hover:text-blue-600 transition-colors"
          >
            {captain.phoneNumber}
          </a>
        </div>
      </div>
    </div>
  );
};
