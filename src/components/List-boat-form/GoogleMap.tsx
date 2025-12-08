// components/InteractiveMap.js
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco as default
};

// Define LatLngLiteral type since it's not exported by @react-google-maps/api
type LatLngLiteral = { lat: number; lng: number };

export default function InteractiveMap() {
  const { setValue } = useFormContext();
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    null
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        setMarkerPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
        setValue("location", {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        }); // Update form state with new marker position
      }
    },
    [setValue]
  );

  return (
    <LoadScript googleMapsApiKey={"AIzaSyA7WrnLWhDQgtcsi9WArm3ffyKc3GAdVXU"}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
