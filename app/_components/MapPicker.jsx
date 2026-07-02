"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center]);
  return null;
}

function LocationMarker({ setLocation, position, setPosition }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLocation({ lat, lng });
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export default function MapPicker({ setLocation, searchLocation }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (searchLocation) {
      setPosition([searchLocation.lat, searchLocation.lng]);
      setLocation(searchLocation);
    }
  }, [searchLocation]);

  return (
    <MapContainer
  center={[28.6139, 77.2090]}
  zoom={5}
  scrollWheelZoom={true}
  dragging={true}
  doubleClickZoom={true}
  touchZoom={true}
  style={{ height: "400px", width: "100%" }}
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChangeMapView center={position} />
      <LocationMarker
        setLocation={setLocation}
        position={position}
        setPosition={setPosition}
      />
    </MapContainer>
  );
}