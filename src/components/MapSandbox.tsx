import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { mockData } from '../data';
import type { Vehicle, Station } from '../data'; 

import { 
  Box, Typography, Paper, Chip, Button, Stack, LinearProgress 
} from '@mui/material';
import { 
  Navigation as NavIcon,
  BatteryChargingFull as BatteryFullIcon,
  DirectionsBike as BikeIcon,
  DirectionsCar as CarIcon,
  EvStation as PlugIcon,
  AccessTime as TimeIcon,
  Streetview as StreetIcon
} from '@mui/icons-material';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = 'mapbox/dark-v11';

const ResizeMap = ({ isFullMap }: { isFullMap: boolean }) => {
  const map = useMap();

  useEffect(() => {
    const fixMap = () => {
      map.invalidateSize();
    };
    const mapDiv = map.getContainer();
    const observer = new ResizeObserver(() => {
      fixMap();
    });
    observer.observe(mapDiv);
    const timers = [100, 300, 600, 1000, 2000].map(ms => 
      setTimeout(fixMap, ms)
    );
    window.addEventListener('resize', fixMap);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', fixMap);
    };
  }, [map, isFullMap]);

  return null;
};

const popupCustomStyle = `
  .leaflet-popup-content-wrapper { background: rgba(15, 15, 15, 0.95) !important; color: white !important; backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px !important; padding: 0 !important; overflow: hidden; }
  .leaflet-popup-content { margin: 0 !important; width: 280px !important; }
  .leaflet-popup-tip { background: rgba(15, 15, 15, 0.95) !important; }
`;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const createCustomIcon = (color: string, isStation: boolean, isUser: boolean = false) => {
  const size = isUser ? 24 : isStation ? 22 : 14;
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: ${isStation ? '4px' : '50%'}; border: 2px solid white; box-shadow: 0 0 15px ${color}; display: flex; align-items: center; justify-content: center;">
            ${isUser ? '<div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>' : ''}
            ${isStation ? '<span style="color:white; font-size:10px; font-weight:bold;">S</span>' : ''}
          </div><style>${popupCustomStyle}</style>`,
    className: 'custom-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

interface MapSandboxProps {
  isFullMap?: boolean;
}

const MapSandbox = ({ isFullMap = false }: MapSandboxProps) => {
  const [vehicles] = useState<Vehicle[]>(mockData.vehicles);
  const [stations] = useState<Station[]>(mockData.stations);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BIKE' | 'CAR'>('ALL');
  const [batteryFilter, setBatteryFilter] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      null, { enableHighAccuracy: true }
    );
  }, []);

  const openStreetView = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesType = typeFilter === 'ALL' || v.type.includes(typeFilter);
    const matchesBattery = !batteryFilter || (v.batteryLevel !== undefined && v.batteryLevel >= 80);
    return matchesType && matchesBattery;
  });

  const chipStyle = (active: boolean, color: string = '#2196f3') => ({
    bgcolor: active ? color : 'rgba(255,255,255,0.08)',
    color: 'white',
    fontWeight: 'bold',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': { bgcolor: active ? color : 'rgba(255,255,255,0.2)' }
  });

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100%', 
      width: '100%', 
      bgcolor: '#000', 
      overflow: 'hidden',
      display: 'block' 
    }}>

      {/* OVERLAY UI */}
      <Paper elevation={0} sx={{ 
        position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1100,
        p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        borderRadius: 4, bgcolor: 'rgba(20, 20, 20, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <NavIcon sx={{ color: '#2196f3', fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', letterSpacing: 1 }}>URBANOVA</Typography>
        </Stack>
        <Chip label="SYSTEM ACTIVE" size="small" variant="outlined" sx={{ color: '#4caf50', borderColor: '#4caf50', fontWeight: 'bold' }} />
      </Paper>

      <Stack spacing={1.5} sx={{ position: 'absolute', top: 110, left: 20, zIndex: 1100 }}>
        <Stack direction="row" spacing={1}>
          {(['ALL', 'BIKE', 'CAR'] as const).map((t) => (
            <Chip key={t} label={t} onClick={() => setTypeFilter(t)} sx={chipStyle(typeFilter === t)} />
          ))}
        </Stack>
        <Chip 
          icon={<BatteryFullIcon sx={{ color: 'white !important' }} />} 
          label="Charge > 80%" 
          onClick={() => setBatteryFilter(!batteryFilter)} 
          sx={chipStyle(batteryFilter, '#4caf50')} 
        />
      </Stack>

      {/* MAP ENGINE */}
      <MapContainer 
        center={[45.9625, 12.6550]} 
        zoom={14} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <ResizeMap isFullMap={isFullMap} />
        <TileLayer url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`} />
        <ZoomControl position="bottomright" />

        {userPos && (
          <Marker position={userPos} icon={createCustomIcon('#2196f3', false, true)}>
            <Popup><Typography sx={{ p: 1, fontWeight: 'bold', color: 'white' }}>You are here</Typography></Popup>
          </Marker>
        )}

        {filteredVehicles.map((v) => {
          const dist = userPos ? calculateDistance(userPos[0], userPos[1], v.coordinates.lat, v.coordinates.lng) : null;
          const time = dist ? Math.round((dist / 5) * 60) : 5;

          return (
            <Marker key={v.id} position={[v.coordinates.lat, v.coordinates.lng]} icon={createCustomIcon(v.status === 'MAINTENANCE' ? '#f44336' : '#4caf50', false)}>
              <Popup>
                <Box sx={{ p: 2.5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, color: 'white' }}>{v.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{v.id}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                    <TimeIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                    <Typography variant="caption" sx={{ color: 'white' }}>{time} min ({dist?.toFixed(1) || '0.5'} km)</Typography>
                  </Stack>
                  <Box sx={{ mb: 2.5 }}>
                    <LinearProgress variant="determinate" value={v.batteryLevel} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: v.batteryLevel < 20 ? '#f44336' : '#4caf50' } }} />
                  </Box>
                  <Button fullWidth variant="contained" startIcon={<StreetIcon />} onClick={() => openStreetView(v.coordinates.lat, v.coordinates.lng)} sx={{ bgcolor: '#2196f3', fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}>
                    Street View
                  </Button>
                </Box>
              </Popup>
            </Marker>
          );
        })}

        {stations.map((s) => (
          <Marker key={s.id} position={[s.coordinates.lat, s.coordinates.lng]} icon={createCustomIcon('#9c27b0', true)}>
            <Popup>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 800, color: 'white', mb: 2 }}>{s.name}</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 2, textAlign: 'center' }}>
                    <BikeIcon sx={{ fontSize: 18, color: '#2196f3' }} /><Typography variant="body2" sx={{ color: 'white' }}>{s.availableBikes}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 2, textAlign: 'center' }}>
                    <CarIcon sx={{ fontSize: 18, color: '#4caf50' }} /><Typography variant="body2" sx={{ color: 'white' }}>{s.availableEVehicles}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 2, textAlign: 'center' }}>
                    <PlugIcon sx={{ fontSize: 18, color: '#ff9800' }} /><Typography variant="body2" sx={{ color: 'white' }}>{s.chargingPorts}</Typography>
                  </Box>
                </Stack>
                <Button fullWidth variant="outlined" startIcon={<StreetIcon />} onClick={() => openStreetView(s.coordinates.lat, s.coordinates.lng)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none' }}>Street View</Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapSandbox;