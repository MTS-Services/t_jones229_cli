"use client";

import { useEffect } from "react";
import { useMap, Marker, Popup } from "react-leaflet";

interface Props {
  locationCoords: [number, number] | null;
  locationName: string;
  zoom: number;
}

export default function SearchResultsMapInner({
  locationCoords,
  locationName,
  zoom,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (locationCoords) {
      map.flyTo(locationCoords, zoom, { duration: 1 });
    }
  }, [locationCoords, zoom, map]);

  if (!locationCoords) return null;

  return (
    <Marker position={locationCoords}>
      <Popup>{locationName}</Popup>
    </Marker>
  );
}
