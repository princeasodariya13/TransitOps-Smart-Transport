import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

import api from '../api/api';

const LiveMap = () => {
    const [locations, setLocations] = useState(new Map());
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data: res } = await api.get('/vehicles');
                setVehicles(res.data);
            } catch (err) {
                console.error('Failed to fetch vehicles for map');
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

        socket.on('initial_locations', (initialData) => {
            const newLocs = new Map();
            initialData.forEach(loc => newLocs.set(loc.vehicleId, loc));
            setLocations(newLocs);
        });

        socket.on('location_updated', (data) => {
            setLocations(prev => {
                const updated = new Map(prev);
                updated.set(data.vehicleId, data);
                return updated;
            });
        });

        // Simulate moving vehicles for demo purposes if they are on a trip
        const interval = setInterval(() => {
            const activeVehicles = vehicles.filter(v => v.status === 'ON_TRIP');
            if (activeVehicles.length > 0) {
                activeVehicles.forEach(v => {
                    const currentLoc = locations.get(v.id);
                    // Default to New Delhi if no location
                    const lat = currentLoc ? currentLoc.lat + (Math.random() * 0.01 - 0.005) : 28.6139;
                    const lng = currentLoc ? currentLoc.lng + (Math.random() * 0.01 - 0.005) : 77.2090;
                    
                    const payload = { vehicleId: v.id, lat, lng, timestamp: new Date(), vehicle: v };
                    socket.emit('update_location', payload);
                    
                    // Optimistic update for sender
                    setLocations(prev => {
                        const updated = new Map(prev);
                        updated.set(v.id, payload);
                        return updated;
                    });
                });
            }
        }, 5000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [vehicles]);

    const locationList = Array.from(locations.values());
    const defaultCenter = [28.6139, 77.2090]; // New Delhi

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
            <MapContainer 
                center={defaultCenter} 
                zoom={11} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {locationList.map((loc) => {
                    const vehicleInfo = vehicles.find(v => v.id === loc.vehicleId) || loc.vehicle;
                    if (!vehicleInfo) return null;
                    
                    return (
                        <Marker 
                            key={loc.vehicleId} 
                            position={[loc.lat, loc.lng]} 
                            icon={truckIcon}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-slate-900">{vehicleInfo.name}</h3>
                                    <p className="text-xs text-slate-500">{vehicleInfo.licensePlate}</p>
                                    <p className="text-[10px] text-primary-600 mt-1 uppercase font-semibold">Status: ON TRIP</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Last updated: {new Date(loc.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LiveMap;
