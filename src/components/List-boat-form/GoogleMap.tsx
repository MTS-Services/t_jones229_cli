// components/InteractiveMap.js
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco as default
};

// Define LatLngLiteral type since it's not exported by @react-google-maps/api
type LatLngLiteral = { lat: number; lng: number };

interface InteractiveMapProps {
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
}

export default function InteractiveMap({ onLocationSelect }: InteractiveMapProps = {}) {
  // Try to get form context, but don't fail if it doesn't exist
  const formContext = useFormContext?.() || null;
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    null
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        const location = {
          latitude: position.lat,
          longitude: position.lng,
        };
        
        setMarkerPosition(position);
        
        // Update form context if available
        if (formContext?.setValue) {
          formContext.setValue('location', location);
        }
        
        // Call optional callback
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      }
    },
    [formContext, onLocationSelect]
  );

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
    >
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
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
