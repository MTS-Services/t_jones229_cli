import React from "react";
import { getStatusConfig } from "../utils/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} ${className}`}
    >
      <StatusIcon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
};

export default StatusBadge;
