// components/InteractiveMap.js
"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic imports for all react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const containerStyle = {
  width: "100%",
  minHeight: "50vh",
  height: "50vh",
};

const center: [number, number] = [37.7749, -122.4194]; // San Francisco as default

interface InteractiveMapProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

// Dynamic component for map events - must be separate to use hooks properly
const MapEvents = dynamic(
  () => import("./MapEventsComponent").then((mod) => mod.default),
  { ssr: false },
);

// Component to handle map click events
function LocationMarker({
  onLocationSelect,
  formContext,
  markerPosition,
  setMarkerPosition,
}: {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  formContext: any;
  markerPosition: [number, number] | null;
  setMarkerPosition: (pos: [number, number]) => void;
}) {
  return (
    <>
      <MapEvents
        onLocationSelect={onLocationSelect}
        formContext={formContext}
        setMarkerPosition={setMarkerPosition}
      />
      {markerPosition ? <Marker position={markerPosition} /> : null}
    </>
  );
}

export default function InteractiveMap({
  onLocationSelect,
  initialLocation,
}: InteractiveMapProps = {}) {
  const [mounted, setMounted] = useState(false);
  const formContext = useFormContext?.() || null;
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : null,
  );

  useEffect(() => {
    const setupLeaflet = async () => {
      // Fix for default marker icon - load dynamically
      const L = await import("leaflet");

      // Delete the default icon URL method
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Set new icon URLs
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      setMounted(true);
    };

    setupLeaflet();
  }, []);

  if (!mounted) {
    return (
      <div
        style={containerStyle}
        className="bg-gray-100 flex items-center justify-center rounded-lg relative"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600 font-medium">
            Loading interactive map...
          </div>
          <div className="text-gray-500 text-sm mt-1">Please wait a moment</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MapContainer
        center={markerPosition || center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="z-10 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          formContext={formContext}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
      </MapContainer>
    </div>
  );
}
