import {
  Wifi,
  Wind,
  Thermometer,
  Coffee,
  Navigation,
  Fish,
  Tag,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { StatusConfig } from "../types";

// Icon mapping for facilities
export const facilityIcons: Record<string, React.ComponentType<any>> = {
  WiFi: Wifi,
  "Air Conditioning": Wind,
  Heating: Thermometer,
  Kitchen: Coffee,
  Restroom: Coffee,
  Shower: Coffee,
  GPS: Navigation,
  "Fish Finder": Fish,
  "Live Bait Well": Fish,
};

// Default icon for unmapped facilities
export const DefaultIcon = Tag;

export const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "PENDING":
      return {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock3,
        label: "Pending Review",
      };
    case "APPROVED":
      return {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
        label: "Approved",
      };
    case "REJECTED":
      return {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        label: "Rejected",
      };
    default:
      return {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: AlertCircle,
        label: status,
      };
  }
};

export const getTripStatusColor = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "DRAFT":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "ARCHIVED":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};
