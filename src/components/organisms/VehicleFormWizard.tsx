import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import type { Vehicle, VehicleType, VehicleStatus } from "../../types";

interface SelectOption {
  id: string;
  label: string;
}

interface VehicleFormWizardProps {
  open: boolean;
  vehicle?: Vehicle;
  stations: SelectOption[];
  onClose: () => void;
  onCreate: (data: Omit<Vehicle, "id" | "dateAdded">) => Vehicle;
  onUpdate: (id: string, data: Partial<Vehicle>) => Vehicle;
  onCreated: (vehicle: Vehicle) => void;
}

interface FormState {
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  currentStationId: string;
  batteryLevel: number;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  notes: string;
}

const steps = [
  "Basic Info",
  "Location & Status",
  "Maintenance",
  "Review & Submit",
];

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

const typeLabels: Record<VehicleType, string> = {
  BIKE: "Bike",
  SCOOTER: "Scooter",
  CAR: "Car",
  ELECTRIC_CAR: "Electric Car",
  BUS: "Bus",
  ELECTRIC_BUS: "Electric Bus",
};

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
  CHARGING: "Charging",
  OUT_OF_SERVICE: "Out of Service",
};

export default function VehicleFormWizard({
  open,
  vehicle,
  stations,
  onClose,
  onCreate,
  onUpdate,
  onCreated,
}: VehicleFormWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState<FormState>(() =>
    vehicle
      ? {
          name: vehicle.name,
          type: vehicle.type,
          status: vehicle.status,
          currentStationId: vehicle.currentStationId,
          batteryLevel: vehicle.batteryLevel,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          nextMaintenanceDue: vehicle.nextMaintenanceDue,
          notes: vehicle.notes || "",
        }
      : {
          name: "",
          type: "BIKE",
          status: "AVAILABLE",
          currentStationId: "",
          batteryLevel: 100,
          lastMaintenanceDate: new Date().toISOString().split("T")[0],
          nextMaintenanceDue: new Date().toISOString().split("T")[0],
          notes: "",
        },
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedStationLabel = useMemo(
    () =>
      stations.find((station) => station.id === formState.currentStationId)
        ?.label || "None",
    [stations, formState.currentStationId],
  );

  const resetWizard = () => {
    setActiveStep(0);
    setFormState(
      vehicle
        ? {
            name: vehicle.name,
            type: vehicle.type,
            status: vehicle.status,
            currentStationId: vehicle.currentStationId,
            batteryLevel: vehicle.batteryLevel,
            lastMaintenanceDate: vehicle.lastMaintenanceDate,
            nextMaintenanceDue: vehicle.nextMaintenanceDue,
            notes: vehicle.notes || "",
          }
        : {
            name: "",
            type: "BIKE",
            status: "AVAILABLE",
            currentStationId: "",
            batteryLevel: 100,
            lastMaintenanceDate: new Date().toISOString().split("T")[0],
            nextMaintenanceDue: new Date().toISOString().split("T")[0],
            notes: "",
          },
    );
    setErrorMessage("");
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!formState.name.trim()) {
        setErrorMessage("Vehicle name is required.");
        return false;
      }
      if (!formState.type) {
        setErrorMessage("Vehicle type is required.");
        return false;
      }
    }

    if (step === 1) {
      if (!formState.currentStationId.trim()) {
        setErrorMessage("Station is required.");
        return false;
      }
      if (!formState.status) {
        setErrorMessage("Status is required.");
        return false;
      }
    }

    if (step === 2) {
      if (formState.batteryLevel < 0 || formState.batteryLevel > 100) {
        setErrorMessage("Battery level must be between 0-100.");
        return false;
      }
    }

    setErrorMessage("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep((step) => step + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(activeStep)) return;

    try {
      const createdOrUpdated = vehicle
        ? onUpdate(vehicle.id, formState)
        : onCreate(formState);

      onCreated(createdOrUpdated);
      resetWizard();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save vehicle.";
      setErrorMessage(message);
    }
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Vehicle Name"
            value={formState.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="e.g., BK-001, SC-002"
            fullWidth
          />

          <TextField
            select
            label="Vehicle Type"
            value={formState.type}
            onChange={(event) =>
              setField("type", event.target.value as VehicleType)
            }
            fullWidth
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {typeLabels[type]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      );
    }

    if (activeStep === 1) {
      return (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="Station"
            value={formState.currentStationId}
            onChange={(event) =>
              setField("currentStationId", event.target.value)
            }
            fullWidth
          >
            <MenuItem value="">Select a station</MenuItem>
            {stations.map((station) => (
              <MenuItem key={station.id} value={station.id}>
                {station.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            value={formState.status}
            onChange={(event) =>
              setField("status", event.target.value as VehicleStatus)
            }
            fullWidth
          >
            {vehicleStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      );
    }

    if (activeStep === 2) {
      return (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Battery Level (%)"
            type="number"
            value={formState.batteryLevel}
            onChange={(event) =>
              setField(
                "batteryLevel",
                Math.min(100, Math.max(0, Number(event.target.value))),
              )
            }
            inputProps={{ min: 0, max: 100 }}
            fullWidth
          />

          <TextField
            label="Last Maintenance Date"
            type="date"
            value={formState.lastMaintenanceDate}
            onChange={(event) =>
              setField("lastMaintenanceDate", event.target.value)
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Next Maintenance Due"
            type="date"
            value={formState.nextMaintenanceDue}
            onChange={(event) =>
              setField("nextMaintenanceDue", event.target.value)
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Notes (optional)"
            value={formState.notes}
            onChange={(event) => setField("notes", event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      );
    }

    if (activeStep === 3) {
      return (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formState.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {typeLabels[formState.type]}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {statusLabels[formState.status]}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Station
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedStationLabel}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Battery Level
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formState.batteryLevel}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Maintenance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formState.lastMaintenanceDate}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Next Maintenance Due
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formState.nextMaintenanceDue}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
        {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {renderStep()}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained">
            {vehicle ? "Update" : "Create"} Vehicle
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
