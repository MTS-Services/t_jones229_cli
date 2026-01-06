"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// 1. Dynamically import components AND hooks to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// We import useMapEvents dynamically by wrapping it or using a client-only check
// However, the easiest way in Next.js is to ensure the child component
// only renders when the map is ready.

interface LocationMarkerProps {
  setMarkerPosition: (pos: [number, number]) => void;
  formContext: any;
  onLocationSelect?: (loc: { latitude: number; longitude: number }) => void;
  markerPosition: [number, number] | null;
}

const LocationMarker = ({
  setMarkerPosition,
  formContext,
  onLocationSelect,
  markerPosition,
}: LocationMarkerProps) => {
  // Use the hook directly here - since this component is rendered
  // inside MapContainer (which is ssr:false), this is safe.
  const { useMapEvents } = require("react-leaflet");

  useMapEvents({
    click(e: any) {
      const { lat, lng } = e.latlng;
      const position: [number, number] = [lat, lng];

      setMarkerPosition(position);

      if (formContext?.setValue) {
        formContext.setValue("location", { latitude: lat, longitude: lng });
      }

      if (onLocationSelect) {
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
};

const containerStyle = {
  width: "100%",
  height: "450px",
};

const defaultCenter: [number, number] = [37.7749, -122.4194];

interface InteractiveMapProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const MapSection: React.FC<InteractiveMapProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const [mounted, setMounted] = useState(false);
  const formContext = useFormContext?.() || null;

  // FIXED SYNTAX HERE: Corrected the angle brackets and pipe position
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : null
  );

  useEffect(() => {
    setMounted(true);

    // Fix for Leaflet default icon issues in Next.js
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) {
    return (
      <div
        style={containerStyle}
        className="bg-gray-100 flex items-center justify-center rounded-lg border border-dashed border-gray-300"
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MapContainer
        center={markerPosition || defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
          formContext={formContext}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default MapSection;
