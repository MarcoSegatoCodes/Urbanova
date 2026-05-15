import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

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
  AccessTime as TimeIcon,
  Streetview as StreetIcon
} from '@mui/icons-material';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = 'mapbox/dark-v11';

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
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

const createVehicleIcon = (type: string, status: string) => {
  const isMaintenance = status === 'MAINTENANCE';
  const color = isMaintenance ? '#f44336' : '#4caf50';
  
  const iconMarkup = renderToStaticMarkup(
    type === 'BIKE' ? <BikeIcon style={{color: 'white', fontSize: '16px'}} /> : <CarIcon style={{color: 'white', fontSize: '16px'}} />
  );

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); display: flex;">${iconMarkup}</div>
          </div><style>${popupCustomStyle}</style>`,
    className: 'custom-vehicle-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

const createStationIcon = () => {
  return L.divIcon({
    html: `<div style="background-color: #9c27b0; width: 22px; height: 22px; border-radius: 4px; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">P</div>`,
    className: 'station-icon',
    iconSize: [22, 22]
  });
};

export default function MapSandbox() {
  const [vehicles] = useState<Vehicle[]>(mockData.vehicles);
  const [stations] = useState<Station[]>(mockData.stations);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BIKE' | 'CAR'>('ALL');
  const [batteryFilter, setBatteryFilter] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos([45.9625, 12.6550]),
      { enableHighAccuracy: true }
    );
  }, []);

  const openStreetView = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    const matchesBattery = !batteryFilter || (v.batteryLevel !== undefined && v.batteryLevel >= 80);
    return matchesType && matchesBattery;
  });

  const chipStyle = (active: boolean, color: string = '#2196f3') => ({
    bgcolor: active ? color : 'rgba(20, 20, 20, 0.8)',
    color: 'white',
    fontWeight: 'bold',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.1)',
    '&:hover': { bgcolor: active ? color : 'rgba(40, 40, 40, 0.9)' }
  });

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100%', 
      width: '100%', 
      bgcolor: '#0f172a',
      overflow: 'hidden'
    }}>

      {/* HEADER UI */}
      <Paper elevation={0} sx={{ 
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1100,
        p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        borderRadius: 3, bgcolor: 'rgba(20, 20, 20, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <NavIcon sx={{ color: '#2196f3' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', letterSpacing: 0.5 }}>URBANOVA LIVE</Typography>
        </Stack>
        <Chip 
          label={userPos ? "GPS ACTIVE" : "DEFAULT VIEW"} 
          size="small" 
          sx={{ color: userPos ? '#4caf50' : '#ff9800', borderColor: userPos ? '#4caf50' : '#ff9800', fontWeight: 'bold' }} 
          variant="outlined" 
        />
      </Paper>

      <Stack spacing={1} sx={{ position: 'absolute', top: 85, left: 16, zIndex: 1100 }}>
        <Stack direction="row" spacing={1}>
          {(['ALL', 'BIKE', 'CAR'] as const).map((t) => (
            <Chip key={t} label={t} onClick={() => setTypeFilter(t)} sx={chipStyle(typeFilter === t)} />
          ))}
        </Stack>
        <Chip 
          icon={<BatteryFullIcon sx={{ color: 'white !important', fontSize: '18px' }} />} 
          label="Charge > 80%" 
          onClick={() => setBatteryFilter(!batteryFilter)} 
          sx={chipStyle(batteryFilter, '#4caf50')} 
        />
      </Stack>

      <MapContainer 
        center={[45.9625, 12.6550]} 
        zoom={14} 
        zoomControl={false} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%' }}
      >
        <ResizeMap />
        <TileLayer url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`} />
        <ZoomControl position="bottomright" />

        {filteredVehicles.map((v) => {
          const dist = userPos ? calculateDistance(userPos[0], userPos[1], v.coordinates.lat, v.coordinates.lng) : null;
          const time = dist ? Math.round((dist / 12) * 60) : 5;

          return (
            <Marker 
              key={v.id} 
              position={[v.coordinates.lat, v.coordinates.lng]} 
              icon={createVehicleIcon(v.type, v.status)}
            >
              <Popup>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: 'white' }}>{v.name}</Typography>
                    <Chip label={v.type} size="small" sx={{ height: 18, fontSize: '10px', bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                  </Stack>
                  
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                    <TimeIcon sx={{ fontSize: 14, color: '#4caf50' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {dist ? `${dist.toFixed(1)} km • ~${time} min` : 'Calculating...'}
                    </Typography>
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                       <Typography variant="caption" sx={{ color: 'white' }}>Battery</Typography>
                       <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>{v.batteryLevel}%</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={v.batteryLevel} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '& .MuiLinearProgress-bar': { bgcolor: v.batteryLevel! < 20 ? '#f44336' : '#4caf50' } 
                      }} 
                    />
                  </Box>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="small"
                    startIcon={<StreetIcon />} 
                    onClick={() => openStreetView(v.coordinates.lat, v.coordinates.lng)}
                    sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                  >
                    View Surroundings
                  </Button>
                </Box>
              </Popup>
            </Marker>
          );
        })}

        {stations.map((s) => (
          <Marker key={s.id} position={[s.coordinates.lat, s.coordinates.lng]} icon={createStationIcon()}>
            <Popup>
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 800, color: 'white', mb: 1.5 }}>{s.name}</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <BikeIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                      <Typography variant="body2" sx={{ color: 'white' }}>Bikes</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{s.availableBikes}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <CarIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ color: 'white' }}>Cars</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{s.availableEVehicles}</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}