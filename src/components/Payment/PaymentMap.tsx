"use client";

import { useState, useEffect } from "react";

interface PaymentMapProps {
  location?: {
    city?: string;
    latitude?: number;
    longitude?: number;
    // Actual shape from Prisma MeetingPoint: location: Json stored as { lat, lng }
    location?: { lat?: number; lng?: number } | null;
    [key: string]: any;
  };
}

async function geocodeCity(city: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch {
    // ignore
  }
  return null;
}

const DEFAULT_COORDS: [number, number] = [20, 0];

export default function PaymentMap({ location }: PaymentMapProps) {
  const [mounted, setMounted] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number]>(DEFAULT_COORDS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
    setMounted(true);
  }, []);

  useEffect(() => {
    async function resolve() {
      // 1. Nested JSON coords from Prisma: meetingPoint.location = { lat, lng }
      const nested = (location as any)?.location;
      if (nested?.lat && nested?.lng) {
        setCoordinates([nested.lat, nested.lng]);
        setReady(true);
        return;
      }

      // 2. Direct latitude/longitude fields
      if (location?.latitude && location?.longitude) {
        setCoordinates([location.latitude, location.longitude]);
        setReady(true);
        return;
      }

      // 3. Geocode city name via Nominatim
      if (location?.city) {
        const coords = await geocodeCity(location.city);
        if (coords) {
          setCoordinates(coords);
          setReady(true);
          return;
        }
      }

      // 4. No location data
      setReady(true);
    }
    resolve();
  }, [location]);

  if (!mounted || !ready) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-1" />
          <span className="text-gray-400 text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");

  return (
    <div className="w-full h-64 relative isolate z-0">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <MapContainer
        key={`${coordinates[0]}-${coordinates[1]}`}
        center={coordinates}
        zoom={11}
        className="h-full w-full !z-0"
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
