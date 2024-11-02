import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { Restaurant } from '../types';
import { MapPin, Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Props {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  onRestaurantSelect: (id: string) => void;
}

// Restaurant marker icon
const restaurantIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom user location icon
const userLocationIcon = new Icon({
  iconUrl: '/user-location.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function LocationFinder({ onLocationFound }: { onLocationFound: (pos: LatLng) => void }) {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return null;
}

function FindMeButton() {
  const map = useMap();
  
  const handleClick = () => {
    map.locate().on("locationfound", (e) => {
      map.flyTo(e.latlng, 15);
    });
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 shadow-sm rounded-md border border-gray-300 transition-colors"
          style={{ margin: '10px' }}
        >
          <Locate className="w-4 h-4" />
          Find Me
        </button>
      </div>
    </div>
  );
}

export function MapView({ restaurants, selectedRestaurant, onRestaurantSelect }: Props) {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapCenter] = useState<LatLng>(
    new LatLng(
      restaurants[0]?.location.lat ?? 40.7128,
      restaurants[0]?.location.lng ?? -74.0060
    )
  );

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationFinder onLocationFound={setUserLocation} />
        <FindMeButton />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.location.lat, restaurant.location.lng]}
            icon={restaurantIcon}
            eventHandlers={{
              click: () => onRestaurantSelect(restaurant.id)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                {userLocation && (
                  <p className="text-sm text-gray-500 mt-2">
                    {calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      restaurant.location.lat,
                      restaurant.location.lng
                    ).toFixed(1)} km away
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{restaurant.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}