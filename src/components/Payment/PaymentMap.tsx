"use client";

import { useState, useEffect } from "react";

interface PaymentMapProps {
  location?: {
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

// City coordinates mapping for common locations
const cityCoordinates: Record<string, [number, number]> = {
  tampa: [27.9506, -82.4572],
  miami: [25.7617, -80.1918],
  orlando: [28.5383, -81.3792],
  jacksonville: [30.3322, -81.6557],
  "san francisco": [37.7749, -122.4194],
  "los angeles": [34.0522, -118.2437],
  "new york": [40.7128, -74.006],
  seattle: [47.6062, -122.3321],
  boston: [42.3601, -71.0589],
  "san diego": [32.7157, -117.1611],
};

export default function PaymentMap({ location }: PaymentMapProps) {
  const [mounted, setMounted] = useState(false);

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

  // Get coordinates from location
  const getCoordinates = (): [number, number] => {
    // If latitude/longitude provided, use them
    if (location?.latitude && location?.longitude) {
      return [location.latitude, location.longitude];
    }

    // Try to match city name
    if (location?.city) {
      const cityLower = location.city.toLowerCase();
      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (cityLower.includes(city) || city.includes(cityLower)) {
          return coords;
        }
      }
    }

    // Default to Tampa (since that's in the screenshot)
    return [27.9506, -82.4572];
  };

  if (!mounted) {
    return (
      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading map...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const coordinates = getCoordinates();

  return (
    <div className="w-full h-64">
      {" "}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <MapContainer
        center={coordinates}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>{location?.city || "Meeting Point"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
