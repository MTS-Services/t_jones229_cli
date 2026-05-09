import React from "react";

interface InfoCardProps {
  icon: any;
  label: string;
  value: string | number;
  bgColor?: string;
  iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  bgColor = "bg-gray-50",
  iconColor = "text-gray-600",
}) => {
  return (
    <div
      className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 ${bgColor} rounded-lg`}
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center">
        <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs md:text-sm text-gray-600">{label}</p>
        <p className="text-sm md:text-base font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
