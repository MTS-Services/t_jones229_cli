import React from "react";
import { Tag, Users, Ruler, Calendar } from "lucide-react";
import { Boat } from "../types";

interface BoatDetailsGridProps {
  boat: Boat;
}

export const BoatDetailsGrid: React.FC<BoatDetailsGridProps> = ({ boat }) => {
  const details = [
    {
      icon: Tag,
      label: "List Type",
      value: boat.listingType,
    },
    {
      icon: Tag,
      label: "Boat Type",
      value: boat.boatType,
    },
    {
      icon: Users,
      label: "Guests",
      value: boat.guests.toString(),
    },
    {
      icon: Ruler,
      label: "Length",
      value: `${boat.boatLength} ft`,
    },
    {
      icon: Calendar,
      label: "Year",
      value: boat.modelYear.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {details.map((detail, index) => {
        const Icon = detail.icon;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                {detail.label}
              </span>
            </div>
            <p className="font-semibold text-gray-900">{detail.value}</p>
          </div>
        );
      })}
    </div>
  );
};
