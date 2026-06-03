import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import type { Station } from "../../types";
import StatusBadge from "../atoms/StatusBadge";

interface StationDetailModalProps {
  isOpen: boolean;
  station: Station | null;
  onClose: () => void;
}

export default function StationDetailModal({
  isOpen,
  station,
  onClose,
}: StationDetailModalProps) {
  if (!station) return null;

  const infoRows = [
    { label: "ID", value: station.id },
    { label: "Name", value: station.name },
    { label: "Address", value: station.address },
    { label: "Type", value: station.type },
    { label: "Status", value: <StatusBadge status={station.status} /> },
    { label: "Total Docks", value: station.totalDocks },
    { label: "Available Docks", value: station.availableDocks },
    { label: "Available Bikes", value: station.availableBikes },
    { label: "Available E-Vehicles", value: station.availableEVehicles },
    { label: "Charging Ports", value: station.chargingPorts },
    { label: "Last Inspection", value: station.lastInspection },
    {
      label: "Coordinates",
      value: `${station.coordinates.lat}, ${station.coordinates.lng}`,
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Station Details</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {infoRows.map((row) => (
            <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                {row.label}:
              </Typography>
              <Typography variant="body2">
                {typeof row.value === "string" || typeof row.value === "number"
                  ? row.value
                  : row.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
