import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Vehicle, VehicleType, VehicleStatus } from "../../types";

interface Props {
  vehicle?: Vehicle;
  onSubmit: (vehicle: Omit<Vehicle, "id" | "dateAdded"> | Vehicle) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const vehicleTypes: VehicleType[] = [
  "BIKE",
  "SCOOTER",
  "CAR",
  "ELECTRIC_CAR",
  "BUS",
  "ELECTRIC_BUS",
];
const vehicleStatuses: VehicleStatus[] = [
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "CHARGING",
  "OUT_OF_SERVICE",
];

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
  CHARGING: "Charging",
  OUT_OF_SERVICE: "Out of Service",
};

const typeLabels: Record<VehicleType, string> = {
  BIKE: "Bike",
  SCOOTER: "Scooter",
  CAR: "Car",
  ELECTRIC_CAR: "Electric Car",
  BUS: "Bus",
  ELECTRIC_BUS: "Electric Bus",
};

interface FormErrors {
  [key: string]: string;
}

export default function VehicleForm({
  vehicle,
  onSubmit,
  onCancel,
  isLoading = false,
}: Props) {
  const isEditMode = !!vehicle;

  const [formData, setFormData] = useState({
    name: vehicle?.name || "",
    type: vehicle?.type || "BIKE",
    status: vehicle?.status || "AVAILABLE",
    batteryLevel: vehicle?.batteryLevel || 100,
    currentStationId: vehicle?.currentStationId || "",
    lastMaintenanceDate:
      vehicle?.lastMaintenanceDate || new Date().toISOString().split("T")[0],
    nextMaintenanceDue:
      vehicle?.nextMaintenanceDue || new Date().toISOString().split("T")[0],
    totalTrips: vehicle?.totalTrips || 0,
    totalKmTraveled: vehicle?.totalKmTraveled || 0,
    coordinates: vehicle?.coordinates || { lat: 0, lng: 0 },
    notes: vehicle?.notes || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.currentStationId.trim()) {
      newErrors.currentStationId = "Station is required";
    }
    if (formData.batteryLevel < 0 || formData.batteryLevel > 100) {
      newErrors.batteryLevel = "Battery must be between 0-100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = isEditMode
      ? { ...formData, id: vehicle!.id, dateAdded: vehicle!.dateAdded }
      : formData;

    onSubmit(submitData);
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Vehicle Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            {/* Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Vehicle Type"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as VehicleType,
                    })
                  }
                >
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {typeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as VehicleStatus,
                    })
                  }
                >
                  {vehicleStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {statusLabels[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Battery */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Battery Level (%)"
                value={formData.batteryLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    batteryLevel: Number(e.target.value),
                  })
                }
                slotProps={{
                  input: {
                    inputProps: { min: 0, max: 100 },
                  },
                }}
                error={!!errors.batteryLevel}
                helperText={errors.batteryLevel}
              />
            </Grid>

            {/* Station */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Current Station ID"
                value={formData.currentStationId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentStationId: e.target.value,
                  })
                }
                error={!!errors.currentStationId}
                helperText={errors.currentStationId}
                required
              />
            </Grid>

            {/* Dates */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Last Maintenance"
                value={formData.lastMaintenanceDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastMaintenanceDate: e.target.value,
                  })
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Next Maintenance Due"
                value={formData.nextMaintenanceDue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nextMaintenanceDue: e.target.value,
                  })
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            {/* Numbers */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Total Trips"
                value={formData.totalTrips}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalTrips: Number(e.target.value),
                  })
                }
                disabled={isEditMode}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Total KM Traveled"
                value={formData.totalKmTraveled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalKmTraveled: Number(e.target.value),
                  })
                }
                disabled={isEditMode}
                slotProps={{ input: { inputProps: { min: 0, step: 0.1 } } }}
              />
            </Grid>

            {/* Coordinates */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={formData.coordinates.lat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      lat: Number(e.target.value),
                    },
                  })
                }
                slotProps={{ input: { inputProps: { step: 0.0001 } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={formData.coordinates.lng}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      lng: Number(e.target.value),
                    },
                  })
                }
                slotProps={{ input: { inputProps: { step: 0.0001 } } }}
              />
            </Grid>

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update Vehicle"
                  : "Create Vehicle"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              startIcon={<CancelIcon />}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
