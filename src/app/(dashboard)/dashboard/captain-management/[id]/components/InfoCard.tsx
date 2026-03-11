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
    <div className={`flex items-center gap-3 p-4 ${bgColor} rounded-lg`}>
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
