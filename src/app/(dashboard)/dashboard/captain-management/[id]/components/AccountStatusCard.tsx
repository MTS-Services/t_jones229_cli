import React from "react";
import {
  Shield,
  Ship,
  CreditCard,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CaptainUser } from "../types/types";
import { getStatusConfig } from "../utils/utils";
import InfoCard from "./InfoCard";

interface AccountStatusCardProps {
  user: CaptainUser;
  boatCount: number;
}

const AccountStatusCard: React.FC<AccountStatusCardProps> = ({
  user,
  boatCount,
}) => {
  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 py-3 md:py-4 bg-blue-100 border-b border-gray-100">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Account Status
        </h2>
      </div>
      <div className="p-3 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <InfoCard
            icon={StatusIcon}
            label="Status"
            value={user.status}
            bgColor={statusConfig.bg}
            iconColor={statusConfig.text}
          />
          <InfoCard
            icon={Shield}
            label="Role"
            value={user.role}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <InfoCard
            icon={user.isDeleted ? XCircle : CheckCircle}
            label="Account"
            value={user.isDeleted ? "Deleted" : "Active"}
            bgColor={user.isDeleted ? "bg-red-50" : "bg-emerald-50"}
            iconColor={user.isDeleted ? "text-red-600" : "text-emerald-600"}
          />
          <InfoCard
            icon={Ship}
            label="Total Trips"
            value={`${boatCount} boats`}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <InfoCard
            icon={CreditCard}
            label="Charge Status"
            value={user.chargeEnable ? "Enabled" : "Disabled"}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <InfoCard
            icon={Activity}
            label="Register Type"
            value={user.registerType}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountStatusCard;
