import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { MeetingPoint } from "../types";

interface MeetingPointsProps {
  meetingPoints: MeetingPoint[];
}

export const MeetingPoints: React.FC<MeetingPointsProps> = ({
  meetingPoints,
}) => {
  if (meetingPoints.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
        Meeting Points ({meetingPoints.length})
      </h4>
      <div className="space-y-3">
        {meetingPoints.map((point) => (
          <div key={point.id} className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-start space-x-2">
              <Navigation className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {point.street}, {point.city}, {point.country}
                </p>
                <p className="text-sm text-gray-600">
                  Post Code: {point.postCode}
                </p>
                {point.direction && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Directions:</span>{" "}
                    {point.direction}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
