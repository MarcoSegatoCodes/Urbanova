import { useState, useEffect } from "react";
import { Box, Alert, CircularProgress, Typography } from "@mui/material";
import MapView from "../components/organisms/MapView";
import {
  getAllVehicles,
  simulateVehicleMovement,
  simulateVehicleStatusChanges,
} from "../services/VehicleService";
import { getAllStations } from "../services/StationService";
import type { Vehicle } from "../types/vehicle.types";
import type { Station } from "../types/station.types";

const SIMULATION_INTERVAL_MS = 5000;

export default function Map() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setVehicles(getAllVehicles());
      setStations(getAllStations());
    } catch {
      setError("Unable to load map data. Please refresh the page.");
      return;
    } finally {
      setLoading(false);
    }

    const interval = setInterval(() => {
      simulateVehicleStatusChanges();
      simulateVehicleMovement();
      setVehicles(getAllVehicles());
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 112px)",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading map…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        mx: -3,
        mt: -3,
        mb: -3,
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      <MapView vehicles={vehicles} stations={stations} />
    </Box>
  );
}
