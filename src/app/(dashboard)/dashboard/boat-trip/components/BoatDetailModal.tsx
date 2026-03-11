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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ship className="w-6 h-6 text-blue-600" />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
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
        <div className="flex-1 overflow-y-auto p-6">
          {/* Boat Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {boat.manufacturer}
                </h3>
                <p className="text-gray-600 mt-1">
                  Listed by: {boat.captain.firstName} {boat.captain.lastName}
                </p>
              </div>
              <div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${statusConfig.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Boat Images */}
          <BoatPhotos photos={boat.photos} manufacturer={boat.manufacturer} />

          {/* Key Details Grid */}
          <BoatDetailsGrid boat={boat} />

          {/* Description */}
          {boat.description && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Description
              </h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
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

          {/* Captain Info */}
          <CaptainInfo captain={boat.captain} />

          {/* Meeting Points */}
          <MeetingPoints meetingPoints={boat.meetingPoint} />

          {/* Trips */}
          <TripsList trips={boat.trips} boatPhotos={boat.photos} />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
