// src/components/Map.tsx
import type { Spot } from 'src/constants/spots';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function MyMap({ ...props }) {
  const { onClick, position, spots, zoom } = props as {
    onClick: (spot: Spot) => void;
    position: [number, number];
    spots: Spot[];
    zoom: number;
  };

  return (
    <MapContainer
      center={position}
      className="h-96 w-96 rounded-lg rounded-t-none "
      zoom={zoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((pos: Spot, index) => (
        <Marker
          autoPanOnFocus
          key={index}
          position={[pos.latitude, pos.longitude]}
        >
          <Popup>
            <div className="flex flex-col gap-2">
              <p>Spot: {pos.name}</p>
              <p> {pos.description}</p>
              <button className="mt-2" onClick={() => onClick(pos)}>
                View spot
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
