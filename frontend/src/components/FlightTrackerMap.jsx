import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './FlightTrackerMap.css';

const createPlaneIcon = (rotation) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58a6ff" stroke="#2b5cff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rotation})"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 4 4 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>`;
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const AirportIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>`),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const FlightTrackerMap = ({ origin, destination, status }) => {
  const coords = {
    'NYC': [40.7128, -74.0060],
    'JFK': [40.6413, -73.7781],
    'LAX': [33.9416, -118.4085],
    'LON': [51.5074, -0.1278],
    'LHR': [51.4700, -0.4543],
    'TOK': [35.6762, 139.6503],
    'HND': [35.5494, 139.7798],
    'DXB': [25.2532, 55.3657],
    'SYD': [-33.9399, 151.1753],
    'DEL': [28.5562, 77.1000],
    'BOM': [19.0896, 72.8656],
    'PAR': [49.0097, 2.5479]
  };

  const getAirportCode = (str) => {
    if (!str) return 'DEL';
    const match = str.match(/\((.*?)\)/);
    return match ? match[1] : str.substring(0,3).toUpperCase();
  };

  const originCode = getAirportCode(origin);
  const destCode = getAirportCode(destination);
  
  const originLatLng = coords[originCode] || [28.5562, 77.1000];
  const destLatLng = coords[destCode] || [19.0896, 72.8656];

  const [currentPos, setCurrentPos] = useState(originLatLng);
  const [progress, setProgress] = useState(0);

  const dx = destLatLng[1] - originLatLng[1];
  const dy = destLatLng[0] - originLatLng[0];
  const angle = Math.atan2(dx, dy) * (180 / Math.PI); 

  useEffect(() => {
    if (status === 'Cancelled' || status === 'Landed') {
       setCurrentPos(status === 'Landed' ? destLatLng : originLatLng);
       setProgress(status === 'Landed' ? 100 : 0);
       return;
    }
    
    let it = 0;
    const interval = setInterval(() => {
        it += 0.005;
        if (it > 1) it = 1;
        
        const newLat = originLatLng[0] + (destLatLng[0] - originLatLng[0]) * it;
        const newLng = originLatLng[1] + (destLatLng[1] - originLatLng[1]) * it;
        setCurrentPos([newLat, newLng]);
        setProgress(it * 100);
        
        if (it >= 1) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, [origin, destination, status]);

  const bounds = [originLatLng, destLatLng];

  return (
    <div className="flight-tracker-wrapper">
      <div className="tracker-overlay-stats">
         <div className="stat-pill glass-panel text-gradient">Journey: {Math.round(progress)}%</div>
         <div className="stat-pill glass-panel text-primary live-pulse">
           <svg width="10" height="10" viewBox="0 0 10 10" style={{marginRight: '6px'}}><circle cx="5" cy="5" r="5" fill="#f85149"/></svg>
           LIVE RADAR
         </div>
      </div>
      <MapContainer 
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        zoom={4} 
        scrollWheelZoom={false} 
        className="map-container"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        <Marker position={originLatLng} icon={AirportIcon}>
          <Popup className="premium-popup">
            <strong>{origin}</strong><br/>Departure Hub
          </Popup>
        </Marker>
        
        <Marker position={destLatLng} icon={AirportIcon}>
          <Popup className="premium-popup">
             <strong>{destination}</strong><br/>Arrival Hub
          </Popup>
        </Marker>

        <Polyline 
          positions={[originLatLng, destLatLng]} 
          color="#58a6ff" 
          weight={2} 
          dashArray="5, 10" 
          opacity={0.8}
        />

        <Marker position={currentPos} icon={createPlaneIcon(angle)}>
          <Popup className="premium-popup shadow-glow">
            <strong>AeroCloud Live</strong><br/>
            Status: {status}<br/>
            Progress: {Math.round(progress)}%
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default FlightTrackerMap;
