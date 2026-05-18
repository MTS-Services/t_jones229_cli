import React, { useCallback, useEffect } from "react";
import { Ship, Anchor, Info, X } from "lucide-react";
import { BoatDetailModalProps } from "../types";
import { getStatusConfig } from "../utils";
import { BoatPhotos } from "./BoatPhotos";
import { BoatDetailsGrid } from "./BoatDetailsGrid";
import { FacilitiesList } from "./FacilitiesList";
import { CaptainInfo } from "./CaptainInfo";
import { MeetingPoints } from "./MeetingPoints";
import { TripsList } from "./TripsList";

export const BoatDetailModal: React.FC<BoatDetailModalProps> = ({
  boat,
  isOpen,
  onClose,
}) => {
  // Handle ESC key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyPress]);

  if (!isOpen) return null;

  const statusConfig = getStatusConfig(boat.approvalStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — full-screen on mobile, centered card on sm+ */}
      <div className="relative bg-white w-full sm:rounded-2xl sm:max-w-5xl sm:mx-4 sm:max-h-[90vh] h-[95dvh] sm:h-auto rounded-t-2xl flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
          {/* Drag handle (mobile only) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h2
              id="modal-title"
              className="text-base sm:text-xl font-bold text-gray-900"
            >
              Boat Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Boat Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {boat.manufacturer}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Listed by: {boat.captain.firstName} {boat.captain.lastName}
                </p>
              </div>
              <div
                className={`self-start inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-sm ${statusConfig.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium">{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Boat Images */}
          <BoatPhotos photos={boat.photos} manufacturer={boat.manufacturer} />

          {/* Key Details Grid */}
          <BoatDetailsGrid boat={boat} />

          {/* Description */}
          {boat.description && (
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Description
              </h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-xl">
                {boat.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          <FacilitiesList facilities={boat.facilities} title="Facilities" />

          {/* Gear & Crew */}
          <FacilitiesList
            facilities={boat.gearAndCrew}
            title="Gear & Crew"
            className="bg-blue-50 rounded-full border-blue-100"
            itemClassName="text-blue-600"
          />

          {/* Charter Types */}
          {boat.charterTypes?.length > 0 && (
            <FacilitiesList
              facilities={boat.charterTypes}
              title="Charter Types"
              className="bg-purple-50 rounded-full border-purple-100"
              itemClassName="text-purple-600"
            />
          )}

          {/* Captain Info */}
          <CaptainInfo captain={boat.captain} />

          {/* Meeting Points */}
          <MeetingPoints meetingPoints={boat.meetingPoint} />

          {/* Trips */}
          <TripsList trips={boat.trips} boatPhotos={boat.photos} />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
