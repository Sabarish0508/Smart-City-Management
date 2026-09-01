import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { getCoordinatesForLocation } from '../../data/locations';

// Fix standard Leaflet marker icons in React bundles
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin creators
const createCustomPin = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const pinColors = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#3b82f6',
  LOW: '#10b981',
  RESOLVED: '#059669',
  DEFAULT: '#0ea5e9',
};

// Component to handle map clicks for coordinate selection
function LocationMarker({ position, setPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position ? (
    <Marker position={position} icon={createCustomPin('#38bdf8')}>
      <Popup>
        <div style={{ padding: '4px', fontSize: '13px' }}>
          <strong>Selected Issue Location</strong>
          <br />
          Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Helper to auto-fit or recenter map programmatically
function AutoFitBounds({ markers, center }) {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 1) {
      const validPoints = markers
        .filter((m) => m._resolvedLat && m._resolvedLng)
        .map((m) => [m._resolvedLat, m._resolvedLng]);
      if (validPoints.length > 1) {
        try {
          const bounds = L.latLngBounds(validPoints);
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          return;
        } catch (e) {
          // ignore
        }
      }
    }

    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom() || 13);
    }
  }, [markers, center, map]);

  return null;
}

export default function CivicMap({
  center = [12.9716, 77.5946],
  zoom = 13,
  height = '400px',
  isPicker = false,
  selectedLocation = null,
  onLocationSelect = null,
  markers = [],
  onMarkerClick = null,
}) {
  const [pinPosition, setPinPosition] = useState(
    selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null
  );

  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      setPinPosition([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPinPosition([lat, lng]);
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        },
        (err) => {
          alert('Could not retrieve GPS location: ' + err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Process markers and ensure every complaint has valid coordinates
  const processedMarkers = useMemo(() => {
    return (markers || []).map((item, idx) => {
      let lat = item.latitude;
      let lng = item.longitude;

      if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
        const resolved = getCoordinatesForLocation(item.state, item.city, item.municipality, item.ward);
        // Add subtle pseudo jitter so multiple complaints in same area don't stack completely
        const jitterLat = ((idx % 5) - 2) * 0.0015;
        const jitterLng = (((idx * 3) % 5) - 2) * 0.0015;
        lat = resolved.lat + jitterLat;
        lng = resolved.lng + jitterLng;
      }

      return {
        ...item,
        _resolvedLat: lat,
        _resolvedLng: lng,
      };
    });
  }, [markers]);

  const mapCenter = pinPosition || (processedMarkers.length > 0 && processedMarkers[0]._resolvedLat ? [processedMarkers[0]._resolvedLat, processedMarkers[0]._resolvedLng] : center);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      {isPicker && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000 }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleLocateMe}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          >
            <Navigation size={14} /> Locate GPS
          </button>
        </div>
      )}

      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFitBounds markers={processedMarkers} center={mapCenter} />

        {/* Mode 1: Location Picker */}
        {isPicker && (
          <LocationMarker
            position={pinPosition}
            setPosition={setPinPosition}
            onLocationChange={onLocationSelect}
          />
        )}

        {/* Mode 2: Multi-Markers List */}
        {!isPicker &&
          processedMarkers.map((item) => {
            const markerPos = [item._resolvedLat, item._resolvedLng];
            const pinColor = item.status === 'RESOLVED' ? pinColors.RESOLVED : (pinColors[item.priority] || pinColors.DEFAULT);
            const customIcon = createCustomPin(pinColor);

            return (
              <Marker key={item.id || item.complaintNumber} position={markerPos} icon={customIcon}>
                <Popup>
                  <div style={{ minWidth: '220px', padding: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
                        {item.complaintNumber}
                      </span>
                      <PriorityBadge priority={item.priority} />
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0', color: '#f8fafc' }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>
                      {item.address}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <StatusBadge status={item.status} />
                      
                      {/* Navigation Link for Field Personnel */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item._resolvedLat},${item._resolvedLng}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#38bdf8', textDecoration: 'none' }}
                      >
                        Navigate <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
