import React from "react";
import { Camera } from "lucide-react";
import { BoatPhoto } from "../types";

interface BoatPhotosProps {
  photos: BoatPhoto[];
  manufacturer: string;
}

export const BoatPhotos: React.FC<BoatPhotosProps> = ({
  photos,
  manufacturer,
}) => {
  if (photos.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <Camera className="w-4 h-4 mr-2" />
        Photos ({photos.length})
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt={`Boat ${manufacturer}`}
            className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};
