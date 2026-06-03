import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import type { Vehicle, VehicleStatus } from "../../types/vehicle.types";
import type { Station, StationStatus } from "../../types/station.types";

interface MapViewProps {
  vehicles: Vehicle[];
  stations: Station[];
}

const MAP_POSITION_KEY = "urbanova_map_position";
const DEFAULT_CENTER: [number, number] = [45.4642, 9.19];
const DEFAULT_ZOOM = 13;

const STATION_STATUS_COLORS: Record<string, string> = {
  OPERATIONAL: "#4caf50",
  MAINTENANCE: "#ff9800",
  OFFLINE: "#f44336",
  COMING_SOON: "#2196f3",
};

const VEHICLE_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#4caf50",
  IN_USE: "#2196f3",
  MAINTENANCE: "#ff9800",
  CHARGING: "#f5c400",
  OUT_OF_SERVICE: "#f44336",
};

const VEHICLE_TYPE_EMOJI: Record<string, string> = {
  BIKE: "🚲",
  SCOOTER: "🛵",
  CAR: "🚗",
  BUS: "🚌",
};

function makeStationIcon(status: StationStatus) {
  const color = STATION_STATUS_COLORS[status] ?? "#9e9e9e";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.4);
      display:flex;align-items:center;justify-content:center;
      font-size:15px;font-weight:700;color:white;
      font-family:sans-serif;
    ">S</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function makeVehicleIcon(type: string, status: VehicleStatus) {
  const color = VEHICLE_STATUS_COLORS[status] ?? "#9e9e9e";
  const emoji = VEHICLE_TYPE_EMOJI[type] ?? "🚗";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 5px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
    ">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -17],
  });
}

function getSavedPosition(): { lat: number; lng: number; zoom: number } | null {
  try {
    const raw = localStorage.getItem(MAP_POSITION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function PositionSaver() {
  const map = useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      localStorage.setItem(
        MAP_POSITION_KEY,
        JSON.stringify({ lat: c.lat, lng: c.lng, zoom: map.getZoom() }),
      );
    },
  });
  return null;
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ");
}

function StationPopup({ station }: { station: Station }) {
  const color = STATION_STATUS_COLORS[station.status] ?? "#9e9e9e";
  return (
    <Box sx={{ minWidth: 240, maxWidth: 300 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {station.name}
        </Typography>
        <Chip
          label={statusLabel(station.status)}
          size="small"
          sx={{ bgcolor: color, color: "white", fontWeight: 600, fontSize: "0.7rem" }}
        />
      </Stack>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {station.id} · {station.type.replace(/_/g, " ")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 1 }}>
        {station.address}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Stack spacing={0.4}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">🅿️ Docks</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {station.availableDocks} / {station.totalDocks}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">🚲 Bikes</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {station.availableBikes}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">⚡ E-Vehicles</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {station.availableEVehicles}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">🔌 Charging ports</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {station.chargingPorts}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Last inspection: {new Date(station.lastInspection).toLocaleDateString()}
      </Typography>
    </Box>
  );
}

function VehiclePopup({
  vehicle,
  stationName,
}: {
  vehicle: Vehicle;
  stationName?: string;
}) {
  const color = VEHICLE_STATUS_COLORS[vehicle.status] ?? "#9e9e9e";
  const emoji = VEHICLE_TYPE_EMOJI[vehicle.type] ?? "🚗";
  return (
    <Box sx={{ minWidth: 230, maxWidth: 280 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {vehicle.name}
        </Typography>
        <Chip
          label={statusLabel(vehicle.status)}
          size="small"
          sx={{
            bgcolor: color,
            color: vehicle.status === "CHARGING" ? "#333" : "white",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Stack>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {vehicle.id} · {emoji} {vehicle.type}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={0.75}>
        <Box>
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.3 }}>
            <Typography variant="body2">🔋 Battery</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {vehicle.batteryLevel}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={vehicle.batteryLevel}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  vehicle.batteryLevel > 50
                    ? "#4caf50"
                    : vehicle.batteryLevel > 20
                      ? "#ff9800"
                      : "#f44336",
              },
            }}
          />
        </Box>
        {stationName && (
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2">📍 Station</Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, textAlign: "right", maxWidth: 140 }}
            >
              {stationName}
            </Typography>
          </Stack>
        )}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">🛣️ Total trips</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {vehicle.totalTrips.toLocaleString()}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">📏 Distance</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {vehicle.totalKmTraveled.toLocaleString()} km
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Next maintenance: {new Date(vehicle.nextMaintenanceDue).toLocaleDateString()}
      </Typography>
    </Box>
  );
}

export default function MapView({ vehicles, stations }: MapViewProps) {
  const saved = getSavedPosition();
  const center: [number, number] = saved ? [saved.lat, saved.lng] : DEFAULT_CENTER;
  const zoom = saved?.zoom ?? DEFAULT_ZOOM;

  const [showStations, setShowStations] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);

  const stationMap = useRef<Map<string, Station>>(
    new Map(stations.map((s) => [s.id, s])),
  );
  useEffect(() => {
    stationMap.current = new Map(stations.map((s) => [s.id, s]));
  }, [stations]);

  const visibleStations = showStations ? stations : [];
  const visibleVehicles = showVehicles ? vehicles : [];

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PositionSaver />

        {visibleStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates.lat, station.coordinates.lng]}
            icon={makeStationIcon(station.status)}
          >
            <Popup minWidth={260}>
              <StationPopup station={station} />
            </Popup>
          </Marker>
        ))}

        {visibleVehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.coordinates.lat, vehicle.coordinates.lng]}
            icon={makeVehicleIcon(vehicle.type, vehicle.status)}
          >
            <Popup minWidth={250}>
              <VehiclePopup
                vehicle={vehicle}
                stationName={stationMap.current.get(vehicle.currentStationId)?.name}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Layer control panel */}
      <Card
        elevation={3}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          minWidth: 180,
        }}
      >
        <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Layers
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={showStations}
                onChange={(e) => setShowStations(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Stations ({stations.length})
              </Typography>
            }
            sx={{ display: "flex", mr: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showVehicles}
                onChange={(e) => setShowVehicles(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Vehicles ({vehicles.length})
              </Typography>
            }
            sx={{ display: "flex", mr: 0 }}
          />
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
          >
            Stations
          </Typography>
          <Stack spacing={0.4}>
            {Object.entries(STATION_STATUS_COLORS).map(([s, c]) => (
              <Stack
                key={s}
                direction="row"
                sx={{ alignItems: "center" }}
                spacing={0.8}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: c,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption">{statusLabel(s)}</Typography>
              </Stack>
            ))}
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mt: 1, mb: 0.5 }}
          >
            Vehicles
          </Typography>
          <Stack spacing={0.4}>
            {Object.entries(VEHICLE_STATUS_COLORS).map(([s, c]) => (
              <Stack
                key={s}
                direction="row"
                sx={{ alignItems: "center" }}
                spacing={0.8}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: c,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption">{statusLabel(s)}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
