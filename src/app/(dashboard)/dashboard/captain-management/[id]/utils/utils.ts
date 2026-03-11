import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatusConfig } from "../types/types";

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusConfig = (status: string): StatusConfig => {
  const statusMap: Record<string, StatusConfig> = {
    ACTIVE: {
      icon: CheckCircle,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    INACTIVE: {
      icon: XCircle,
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
    },
    PENDING: {
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
  };
  return (
    statusMap[status] || {
      icon: Activity,
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
    }
  );
};
