"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

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
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false },
);

const SearchResultsMapInner = dynamic(
  () => import("./SearchResultsMapInner"),
  { ssr: false },
);

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const LOCATED_ZOOM = 11;

interface Boat {
  id: string | number;
  meetingPoint?: {
    location?: { latitude?: number; longitude?: number };
    city?: string;
  }[];
  descriptions?: { listingTypeTitle?: string }[];
}

interface SearchResultsMapProps {
  location: string;
  boats: Boat[];
}

async function geocodeLocation(
  query: string,
): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
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

export default function SearchResultsMap({
  location,
  boats,
}: SearchResultsMapProps) {
  const [mounted, setMounted] = useState(false);
  const [locationCoords, setLocationCoords] = useState<[number, number] | null>(null);

  // Setup Leaflet icons
  useEffect(() => {
    const setup = async () => {
      const L = await import("leaflet");
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
    };
    setup();
  }, []);

  // Geocode the searched location
  useEffect(() => {
    if (!location) return;
    geocodeLocation(location).then((coords) => {
      if (coords) {
        setLocationCoords(coords);
      }
    });
  }, [location]);

  // Collect valid boat markers
  const markers = boats
    .map((boat) => {
      const mp = boat.meetingPoint?.[0];
      const lat = mp?.location?.latitude;
      const lng = mp?.location?.longitude;
      if (!lat || !lng) return null;
      const title = boat.descriptions?.[0]?.listingTypeTitle || "Charter";
      const city = mp?.city || "";
      return { id: boat.id, lat, lng, title, city };
    })
    .filter(Boolean) as {
    id: string | number;
    lat: number;
    lng: number;
    title: string;
    city: string;
  }[];

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600 font-medium text-sm">Loading map…</div>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
      className="z-10 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchResultsMapInner
        locationCoords={locationCoords}
        locationName={location}
        zoom={LOCATED_ZOOM}
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <span className="font-semibold">{m.title}</span>
            {m.city && <><br />{m.city}</>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
