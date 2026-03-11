import React, { useState } from "react";
import {
  Ship,
  X,
  Users,
  Ruler,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Image as ImageIcon,
  Wrench,
  MapPin,
  Fish,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useUpdateBoatStatusMutation } from "@/redux/api/boatApi";
import { toast } from "react-toastify";

interface BoatDetailsModalProps {
  boat: any;
  onClose: () => void;
}

const BoatDetailsModal: React.FC<BoatDetailsModalProps> = ({
  boat,
  onClose,
}) => {
  const [updateBoatStatus, { isLoading: isUpdating }] =
    useUpdateBoatStatusMutation();
  const [currentStatus, setCurrentStatus] = useState(boat.approvalStatus);

  const handleStatusUpdate = async (status: "APPROVE" | "DECLINE") => {
    try {
      await updateBoatStatus({ id: boat.id, status }).unwrap();
      setCurrentStatus(status);
      toast.success(
        `Boat ${status === "APPROVE" ? "approved" : "declined"} successfully`,
      );
    } catch {
      toast.error("Failed to update boat status");
    }
  };

  const getApprovalStyle = (status: string) => {
    switch (status) {
      case "APPROVE":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
        };
      case "PENDING":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          icon: <Clock className="h-4 w-4 text-amber-600" />,
        };
      case "DECLINE":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <XCircle className="h-4 w-4 text-red-600" />,
        };

      default:
        return {
          bg: "bg-gray-200",
          text: "text-gray-800",
          icon: <XCircle className="h-4 w-4 text-gray-600" />,
        };
    }
  };

  const approvalStyle = getApprovalStyle(currentStatus);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {boat.manufacturer || "Boat Details"}
              </h2>
              <p className="text-sm text-blue-100 mt-0.5">
                Boat ID: {boat.id?.substring(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Ship className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {boat.boatType || "N/A"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {boat.guests || 0}
              </p>
              <p className="text-xs text-gray-500">max guests</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Length
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {boat.boatLength || 0}&apos;
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {boat.modelYear || "N/A"}
              </p>
            </div>
          </div>

          {/* Status & Listing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Listing Type
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {boat.listingType || "Standard"}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Approval Status
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${approvalStyle.bg}`}
                >
                  {approvalStyle.icon}
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${approvalStyle.bg} ${approvalStyle.text}`}
                >
                  {currentStatus || "DRAFT"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {boat.description && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {boat.description}
                </p>
              </div>
            </div>
          )}

          {/* Photos */}
          {boat.photos && boat.photos.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Photos
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  {boat.photos.length} images
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {boat.photos.slice(0, 4).map((photo: any) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo.url}
                      alt="Boat"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
                {boat.photos.length > 4 && (
                  <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-600">
                      +{boat.photos.length - 4} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Facilities & Gear */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {boat.facilities && boat.facilities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Facilities
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {boat.facilities.map((facility: string) => (
                    <span
                      key={facility}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {boat.gearAndCrew && boat.gearAndCrew.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Gear & Crew
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {boat.gearAndCrew.map((gear: string) => (
                    <span
                      key={gear}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100"
                    >
                      {gear}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Meeting Points */}
          {boat.meetingPoint && boat.meetingPoint.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Meeting Points
                </h3>
              </div>
              <div className="space-y-3">
                {boat.meetingPoint.map((point: any, index: number) => (
                  <div
                    key={point.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-700">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {point.street}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {point.city}, {point.country} {point.postCode}
                        </p>
                        {point.direction && (
                          <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">
                              Directions:
                            </p>
                            <p className="text-sm text-gray-700">
                              {point.direction}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fishing Info */}
          {boat.fishing && boat.fishing.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Fish className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Fishing Details
                </h3>
              </div>
              <div className="space-y-4">
                {boat.fishing.map((fish: any) => (
                  <div
                    key={fish.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fish.species && fish.species.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Target Species
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {fish.species.map((s: string) => (
                              <span
                                key={s}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {fish.fishingLocation &&
                        fish.fishingLocation.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Fishing Locations
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {fish.fishingLocation.map((loc: string) => (
                                <span
                                  key={loc}
                                  className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                >
                                  {loc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {fish.fishingTechnique &&
                        fish.fishingTechnique.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Techniques
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {fish.fishingTechnique.map((tech: string) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {fish.includedPrice && fish.includedPrice.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Included Items
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {fish.includedPrice.map((item: string) => (
                              <span
                                key={item}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Trips */}
          {boat.trips && boat.trips.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Associated Trips
                  </h3>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {boat.trips.length} trips
                </span>
              </div>
              <div className="space-y-3">
                {boat.trips.map((tripItem: any) => (
                  <div
                    key={tripItem.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {tripItem.tripName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {tripItem.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {tripItem.duration}h
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="h-3 w-3" />${tripItem.price}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              tripItem.tripStatus === "OPEN"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tripItem.tripStatus === "OPEN"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            ></span>
                            {tripItem.tripStatus}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors whitespace-nowrap">
                        View Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-2 justify-end rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
            {currentStatus !== "APPROVE" && (
              <button
                onClick={() => handleStatusUpdate("APPROVE")}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </button>
            )}
            {currentStatus !== "DECLINE" && (
              <button
                onClick={() => handleStatusUpdate("DECLINE")}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Decline
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatDetailsModal;
