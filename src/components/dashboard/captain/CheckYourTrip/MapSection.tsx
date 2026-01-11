// components/InteractiveMap.js
"use client";

import { useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
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
const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents as any),
  { ssr: false }
) as any;

const containerStyle = {
  width: "100%",
  height: "450px",
};

const center: [number, number] = [37.7749, -122.4194]; // San Francisco as default

interface InteractiveMapProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

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
  const { useMapEvents: useMapEventsHook } = require("react-leaflet");

  useMapEventsHook({
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

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

export default function MapSection({
  onLocationSelect,
  initialLocation,
}: InteractiveMapProps = {}) {
  const [mounted, setMounted] = useState(false);
  const formContext = useFormContext?.() || null;
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : null
  );

  useEffect(() => {
    setMounted(true);

    // Fix for default marker icon
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
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
        className="bg-gray-100 flex items-center justify-center rounded-lg"
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
  } = require("react-leaflet");

  return (
    <div style={containerStyle}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <MapContainer
        center={markerPosition || center}
        zoom={10}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
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
