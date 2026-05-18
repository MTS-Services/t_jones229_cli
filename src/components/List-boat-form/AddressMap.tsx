"use client";

import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MapPin, Loader2 } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const MapInner = dynamic(() => import("./AddressMapInner"), { ssr: false });

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const LOCATED_ZOOM = 14;

const COUNTRY_CODE_MAP: Record<string, string> = {
  us: "United States",
  gb: "United Kingdom",
  ca: "Canada",
  au: "Australia",
};

async function geocodeAddress(
  street: string,
  city: string,
  country: string,
  postCode: string,
): Promise<[number, number] | null> {
  const q = [street, city, postCode, country].filter(Boolean).join(", ");
  if (!q.trim()) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us,gb,ca,au`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (data?.length > 0)
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    // ignore
  }
  return null;
}

async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<{
  street?: string;
  city?: string;
  state?: string;
  postCode?: string;
  country?: string;
} | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (!data?.address) return null;
    const a = data.address;
    const country = COUNTRY_CODE_MAP[a.country_code?.toLowerCase()] || "";
    const street =
      [a.house_number, a.road].filter(Boolean).join(" ") || a.road || "";
    const city =
      a.city || a.town || a.village || a.municipality || a.county || "";
    return { street, city, state: a.state || "", postCode: a.postcode || "", country };
  } catch {
    // ignore
  }
  return null;
}

export default function AddressMap() {
  const { watch, setValue, getValues } = useFormContext();
  const [mounted, setMounted] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [targetCenter, setTargetCenter] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [geocodeFailed, setGeocodeFailed] = useState(false);
  const lastSetRef = useRef<{ lat: number; lng: number } | null>(null);
  // Tracks when the last map-click happened so forward-geocoding is suppressed
  // for 3s after a click (prevents shake from click → fill fields → re-geocode loop)
  const lastMapClickTimeRef = useRef(0);

  const street = watch("street") || "";
  const city = watch("city") || "";
  const country = watch("country") || "";
  const postCode = watch("postCode") || "";
  const formLocation = watch("location");

  // Setup Leaflet icons and load existing saved location
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

      const existing = getValues("location");
      if (existing?.latitude && existing?.longitude) {
        const pos: [number, number] = [existing.latitude, existing.longitude];
        setMarkerPos(pos);
        setTargetCenter(pos);
        lastSetRef.current = { lat: existing.latitude, lng: existing.longitude };

        // If address fields are empty, auto-fill them from the saved coordinates
        const hasAddress = getValues("city") || getValues("street");
        if (!hasAddress) {
          lastMapClickTimeRef.current = Date.now(); // suppress forward-geocoding of filled fields
          const address = await reverseGeocode(existing.latitude, existing.longitude);
          if (address) {
            if (address.street) setValue("street", address.street, { shouldDirty: true });
            if (address.city) setValue("city", address.city, { shouldDirty: true });
            if (address.state) setValue("state", address.state, { shouldDirty: true });
            if (address.postCode) setValue("postCode", address.postCode, { shouldDirty: true });
            if (address.country) setValue("country", address.country, { shouldDirty: true });
          }
        }
      }
      setMounted(true);
    };
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync location set externally (e.g. autocomplete suggestion select in MeetingPoint)
  useEffect(() => {
    if (!mounted || !formLocation?.latitude || !formLocation?.longitude) return;
    const last = lastSetRef.current;
    if (last && last.lat === formLocation.latitude && last.lng === formLocation.longitude)
      return;
    const pos: [number, number] = [formLocation.latitude, formLocation.longitude];
    setMarkerPos(pos);
    setTargetCenter(pos);
    lastSetRef.current = { lat: formLocation.latitude, lng: formLocation.longitude };
  }, [formLocation, mounted]);

  // Debounced geocoding whenever address fields change
  useEffect(() => {
    if (!mounted) return;
    setGeocodeFailed(false);

    const timeout = setTimeout(async () => {
      // Skip forward-geocoding for 3s after a map click to prevent shake
      if (Date.now() - lastMapClickTimeRef.current < 3000) return;
      if (!city && !street) return;
      setIsGeocoding(true);
      const coords = await geocodeAddress(street, city, country, postCode);
      setIsGeocoding(false);
      if (coords) {
        setGeocodeFailed(false);
        setMarkerPos(coords);
        setTargetCenter(coords);
        lastSetRef.current = { lat: coords[0], lng: coords[1] };
        setValue("location", { latitude: coords[0], longitude: coords[1] });
      } else {
        setGeocodeFailed(true);
      }
    }, 900);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street, city, country, postCode, mounted]);

  // Map click: pin + reverse geocode to fill address fields
  const handleMapClick = async (pos: [number, number]) => {
    lastMapClickTimeRef.current = Date.now(); // suppress forward-geocoding of filled fields
    setMarkerPos(pos);
    setTargetCenter(pos);
    lastSetRef.current = { lat: pos[0], lng: pos[1] };
    setValue("location", { latitude: pos[0], longitude: pos[1] }, { shouldDirty: true });

    setIsReversing(true);
    const address = await reverseGeocode(pos[0], pos[1]);
    setIsReversing(false);

    if (address) {
      // Always set all fields (even empty string clears stale values)
      setValue("street", address.street || "", { shouldDirty: true });
      setValue("city", address.city || "", { shouldDirty: true });
      setValue("state", address.state || "", { shouldDirty: true });
      setValue("postCode", address.postCode || "", { shouldDirty: true });
      if (address.country) setValue("country", address.country, { shouldDirty: true });
    }
  };

  const status = (() => {
    if (isReversing)
      return { text: "Looking up address…", color: "text-blue-600", spin: true };
    if (isGeocoding)
      return { text: "Finding location…", color: "text-blue-600", spin: true };
    if (markerPos && !geocodeFailed)
      return { text: "Location pinned — click map to move", color: "text-green-600", spin: false };
    if (geocodeFailed)
      return { text: "Address not found — click the map to pin manually", color: "text-amber-600", spin: false };
    return { text: "Fill in your address or click the map to pin", color: "text-gray-400", spin: false };
  })();

  if (!mounted) {
    return (
      <div className="h-[350px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading map…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`flex items-center gap-1.5 text-sm mb-3 ${status.color}`}>
        {status.spin ? (
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
        ) : (
          <MapPin className="h-4 w-4 flex-shrink-0" />
        )}
        {status.text}
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "350px", width: "100%", borderRadius: "12px" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapInner
          targetCenter={targetCenter}
          targetZoom={LOCATED_ZOOM}
          markerPos={markerPos}
          onMapClick={handleMapClick}
        />
      </MapContainer>
    </div>
  );
}
