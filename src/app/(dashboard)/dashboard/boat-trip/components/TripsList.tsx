import React from "react";
import {
  Fish,
  Clock,
  DollarSign,
  Clock3,
  Tag,
  ImageOff,
  Trash2,
} from "lucide-react";
import { Trip, BoatPhoto } from "../types";
import { getTripStatusColor } from "../utils";
import { useDeleteTripMutation } from "@/redux/api/boatApi";
import { toast } from "react-toastify";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface TripsListProps {
  trips: Trip[];
  boatPhotos?: BoatPhoto[];
}

interface TripImageProps {
  index: number;
  tripName: string;
  boatPhotos?: BoatPhoto[];
}

const TripImage: React.FC<TripImageProps> = ({
  index,
  tripName,
  boatPhotos,
}) => {
  const imageSrc = boatPhotos?.[index % (boatPhotos?.length || 1)]?.url;

  if (!imageSrc) {
    return (
      <div className="w-28 flex-shrink-0 bg-gray-100 rounded-l-xl flex flex-col items-center justify-center text-gray-400">
        <ImageOff className="w-6 h-6 mb-1" />
        <span className="text-xs text-center px-1">No image</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={tripName}
      loading="lazy"
      className="w-40 flex-shrink-0 object-cover rounded-l-xl self-stretch"
    />
  );
};

export const TripsList: React.FC<TripsListProps> = ({ trips, boatPhotos }) => {
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();
  const [tripToDelete, setTripToDelete] = React.useState<Trip | null>(null);

  const handleDeleteTrip = (trip: Trip) => {
    setTripToDelete(trip);
  };

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    try {
      await deleteTrip(tripToDelete.id).unwrap();
      toast.success(`"${tripToDelete.tripName}" deleted successfully`);
    } catch {
      toast.error("Failed to delete trip");
    } finally {
      setTripToDelete(null);
    }
  };

  if (trips.length === 0) return null;

  return (
    <>
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <Fish className="w-5 h-5 mr-2 text-blue-600" />
          Trip List ({trips.length})
        </h4>
        <div className="space-y-3">
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              className="flex border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* Left — image */}
              <TripImage
                index={index}
                tripName={trip.tripName}
                boatPhotos={boatPhotos}
              />

              {/* Right — content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-900 truncate pr-2">
                    {trip.tripName}
                  </h5>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getTripStatusColor(
                        trip.tripStatus,
                      )}`}
                    >
                      {trip.tripStatus}
                    </span>
                    <button
                      onClick={() => handleDeleteTrip(trip)}
                      className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {trip.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{trip.duration}h</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-700">
                    <DollarSign className="w-3 h-3 flex-shrink-0 " />
                    <span>{trip.price}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock3 className="w-3 h-3 flex-shrink-0" />
                    <span>{trip.departureTime}:00</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Tag className="w-3 h-3 flex-shrink-0" />
                    <span>{trip.tripType}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Trip Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!tripToDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete "${tripToDelete?.tripName}"? This action cannot be undone.`}
        onConfirm={confirmDeleteTrip}
        onCancel={() => setTripToDelete(null)}
        isDeleting={isDeleting}
      />
    </>
  );
};
