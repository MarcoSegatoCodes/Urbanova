import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import type { Station, StationType, StationStatus } from "../../types";

interface StationFormWizardProps {
  open: boolean;
  station?: Station;
  onClose: () => void;
  onCreate: (data: Omit<Station, "id">) => Station;
  onUpdate: (id: string, data: Partial<Station>) => Station;
  onCreated: () => void;
}

const STATION_TYPES: StationType[] = ["HYBRID", "BIKE_ONLY", "EV_ONLY", "PARKING"];
const STATION_STATUSES: StationStatus[] = ["OPERATIONAL", "MAINTENANCE", "OFFLINE", "COMING_SOON"];

export default function StationFormWizard({
  open,
  station,
  onClose,
  onCreate,
  onUpdate,
  onCreated,
}: StationFormWizardProps) {
  const [formData, setFormData] = useState<Omit<Station, "id">>(() =>
    station
      ? {
          name: station.name,
          address: station.address,
          coordinates: station.coordinates,
          type: station.type,
          status: station.status,
          totalDocks: station.totalDocks,
          availableDocks: station.availableDocks,
          availableBikes: station.availableBikes,
          availableEVehicles: station.availableEVehicles,
          chargingPorts: station.chargingPorts,
          lastInspection: station.lastInspection,
          connectedStationIds: station.connectedStationIds,
          amenities: station.amenities,
        }
      : {
          name: "",
          address: "",
          coordinates: { lat: 45.4642, lng: 9.19 },
          type: "HYBRID",
          status: "OPERATIONAL",
          totalDocks: 20,
          availableDocks: 20,
          availableBikes: 0,
          availableEVehicles: 0,
          chargingPorts: 0,
          lastInspection: new Date().toISOString().split("T")[0],
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.totalDocks <= 0) newErrors.totalDocks = "Total docks must be greater than 0";
    if (formData.availableDocks > formData.totalDocks)
      newErrors.availableDocks = "Available docks cannot exceed total docks";
    if (formData.availableDocks < 0) newErrors.availableDocks = "Available docks cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCoordinateChange = (coord: "lat" | "lng", value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coord]: num,
        },
      }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    try {
      if (station) {
        onUpdate(station.id, formData);
      } else {
        onCreate(formData);
      }
      onCreated();
      setFormData({
        name: "",
        address: "",
        coordinates: { lat: 45.4642, lng: 9.19 },
        type: "HYBRID",
        status: "OPERATIONAL",
        totalDocks: 20,
        availableDocks: 20,
        availableBikes: 0,
        availableEVehicles: 0,
        chargingPorts: 0,
        lastInspection: new Date().toISOString().split("T")[0],
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{station ? "Edit Station" : "Add New Station"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Station Name"
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Address"
            fullWidth
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {STATION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATION_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
            Capacity & Resources
          </Typography>

          <TextField
            label="Total Docks"
            type="number"
            fullWidth
            value={formData.totalDocks}
            onChange={(e) => handleChange("totalDocks", parseInt(e.target.value) || 0)}
            error={!!errors.totalDocks}
            helperText={errors.totalDocks}
          />

          <TextField
            label="Available Docks"
            type="number"
            fullWidth
            value={formData.availableDocks}
            onChange={(e) => handleChange("availableDocks", parseInt(e.target.value) || 0)}
            error={!!errors.availableDocks}
            helperText={errors.availableDocks}
          />

          <TextField
            label="Available Bikes"
            type="number"
            fullWidth
            value={formData.availableBikes}
            onChange={(e) => handleChange("availableBikes", parseInt(e.target.value) || 0)}
          />

          <TextField
            label="Available E-Vehicles"
            type="number"
            fullWidth
            value={formData.availableEVehicles}
            onChange={(e) => handleChange("availableEVehicles", parseInt(e.target.value) || 0)}
          />

          <TextField
            label="Charging Ports"
            type="number"
            fullWidth
            value={formData.chargingPorts}
            onChange={(e) => handleChange("chargingPorts", parseInt(e.target.value) || 0)}
          />

          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
            Location
          </Typography>

          <TextField
            label="Latitude"
            type="number"
            fullWidth
            slotProps={{ htmlInput: { step: "0.0001" } }}
            value={formData.coordinates.lat}
            onChange={(e) => handleCoordinateChange("lat", e.target.value)}
          />

          <TextField
            label="Longitude"
            type="number"
            fullWidth
            slotProps={{ htmlInput: { step: "0.0001" } }}
            value={formData.coordinates.lng}
            onChange={(e) => handleCoordinateChange("lng", e.target.value)}
          />

          <TextField
            label="Last Inspection Date"
            type="date"
            fullWidth
            value={formData.lastInspection}
            onChange={(e) => handleChange("lastInspection", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {station ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
