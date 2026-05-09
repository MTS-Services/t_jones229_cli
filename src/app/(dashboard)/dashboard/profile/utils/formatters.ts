import { CheckCircle, Activity, Clock } from "lucide-react";
import { StatusConfig } from "../types/profile.types";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getRoleBadgeColor = (role: string): string => {
  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    CAPTAIN: "bg-blue-100 text-blue-700 border-blue-200",
    USER: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return roleColors[role] || roleColors.USER;
};

export const getStatusBadge = (status: string): StatusConfig => {
  const statusConfig: Record<string, StatusConfig> = {
    ACTIVE: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      icon: CheckCircle,
    },
    INACTIVE: {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-700",
      icon: Activity,
    },
    PENDING: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: Clock,
    },
  };
  return (
    statusConfig[status] || {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-700",
      icon: Activity,
    }
  );
};
