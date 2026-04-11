import React from "react";
import {
  Shield,
  Activity,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { User } from "../types/profile.types";
import { formatDate } from "../utils/formatters";

interface AccountDetailsProps {
  user: User;
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Account Details
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-gray-900 font-medium capitalize">
              {user.status?.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-900 font-medium">{user.role}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="text-gray-900 font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-gray-900 font-medium">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>

        {user.role === "CAPTAIN" && (
          <>
            <div className="flex items-start gap-3 py-3 border-t border-gray-100">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Stripe Account</p>
                <p className="text-gray-900 font-medium">
                  {user.accountId ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Charges Enabled</p>
                <p className="text-gray-900 font-medium">
                  {user.chargeEnable ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
