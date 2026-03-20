"use client";

import { useMapEvents } from "react-leaflet";

interface MapEventsProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  formContext: any;
  setMarkerPosition: (pos: [number, number]) => void;
}

export default function MapEventsComponent({
  onLocationSelect,
  formContext,
  setMarkerPosition,
}: MapEventsProps) {
  useMapEvents({
    click(e: any) {
      const position: [number, number] = [e.latlng.lat, e.latlng.lng];
      const location = {
        latitude: position[0],
        longitude: position[1],
      };

      setMarkerPosition(position);

      // Update form context if available
      if (formContext?.setValue) {
        formContext.setValue("location", location);
      }

      // Call optional callback
      if (onLocationSelect) {
        onLocationSelect(location);
      }
    },
  });

  return null; // This component doesn't render anything visible
}
