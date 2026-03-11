import React from "react";
import { facilityIcons, DefaultIcon } from "../utils";

interface FacilitiesListProps {
  facilities: string[];
  title: string;
  className?: string;
  itemClassName?: string;
}

export const FacilitiesList: React.FC<FacilitiesListProps> = ({
  facilities,
  title,
  className = "bg-gray-50 rounded-full border-gray-200",
  itemClassName = "text-gray-600",
}) => {
  if (facilities.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {facilities.map((facility) => {
          const Icon = facilityIcons[facility] || DefaultIcon;
          return (
            <span
              key={facility}
              className={`inline-flex items-center space-x-2 px-4 py-2 text-sm border ${className}`}
            >
              <Icon className={`w-4 h-4 ${itemClassName}`} />
              <span className={itemClassName}>{facility}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
