"use client";

import { useEffect } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";

interface Props {
  targetCenter: [number, number] | null;
  targetZoom: number;
  markerPos: [number, number] | null;
  onMapClick: (pos: [number, number]) => void;
}

export default function AddressMapInner({
  targetCenter,
  targetZoom,
  markerPos,
  onMapClick,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom, { duration: 1 });
    }
  }, [targetCenter, targetZoom, map]);

  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return markerPos ? (
    <Marker
      position={markerPos}
      eventHandlers={{
        click(e) {
          onMapClick([e.latlng.lat, e.latlng.lng]);
        },
      }}
    />
  ) : null;
}
