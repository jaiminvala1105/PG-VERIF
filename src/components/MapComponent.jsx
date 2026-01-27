import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map center when activePgId changes
const MapUpdater = ({ activePg, pgs }) => {
  const map = useMap();

  useEffect(() => {
    if (activePg && activePg.locationCoords) {
      map.flyTo([activePg.locationCoords.lat, activePg.locationCoords.lng], 15, {
        duration: 2
      });
    } else if (pgs.length > 0 && pgs[0].locationCoords) {
       // Optional: Fit bounds of all PGs
       // const bounds = L.latLngBounds(pgs.map(p => [p.locationCoords.lat, p.locationCoords.lng]));
       // map.fitBounds(bounds);
    }
  }, [activePg, map]);

  return null;
};

const MapComponent = ({ pgs, activePgId }) => {
  const activePg = pgs.find(p => p.id === activePgId);
  
  // Default center (e.g., Kota or India center)
  const defaultCenter = [25.2138, 75.8648]; // Kota coordinates as fallback

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pgs.map((pg) => {
           // Skip if no coords (fallback logic could be added)
           // For demo, assuming some PGs might miss coords, we'll try to use dummy ones or skip
           const lat = pg.locationCoords?.lat || 25.2138 + (Math.random() - 0.5) * 0.1;
           const lng = pg.locationCoords?.lng || 75.8648 + (Math.random() - 0.5) * 0.1;

           return (
             <Marker key={pg.id} position={[lat, lng]}>
               <Popup className="custom-popup">
                 <div className="w-48">
                    <img 
                      src={pg.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"} 
                      alt={pg.name}
                      className="w-full h-24 object-cover rounded-t-lg mb-2"
                    />
                    <h3 className="font-bold text-gray-900 text-sm truncate">{pg.name}</h3>
                    <p className="text-gray-500 text-xs mb-1">{pg.location}</p>
                    <p className="font-bold text-indigo-600 text-sm">
                       ₹{pg.price || "N/A"}<span className="text-xs font-normal text-gray-400">/mo</span>
                    </p>
                    <Link to={`/pg/${pg.id}`} className="block mt-2 text-center bg-indigo-600 text-white text-xs py-1 rounded">
                       View Details
                    </Link>
                 </div>
               </Popup>
             </Marker>
           );
        })}

        <MapUpdater activePg={activePg} pgs={pgs} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
