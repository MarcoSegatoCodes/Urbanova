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

import type { IssueType, Ticket, TicketDraft, TicketPriority } from "../../types";
import { ISSUE_TYPE_OPTIONS, TICKET_PRIORITY_OPTIONS } from "../../types/ticket.types";

interface SelectOption {
  id: string;
  label: string;
}

interface TicketFormWizardProps {
  open: boolean;
  vehicles: SelectOption[];
  stations: SelectOption[];
  technicians: SelectOption[];
  reporterId?: string;
  onClose: () => void;
  onCreate: (draft: TicketDraft) => Ticket;
  onCreated: (ticket: Ticket) => void;
}

interface FormState {
  vehicleId: string;
  stationId: string;
  title: string;
  description: string;
  issueType: IssueType;
  priority: TicketPriority;
  assignedTo: string;
  attachments: string[];
}

const steps = [
  "Asset Selection",
  "Issue Details",
  "Priority and Attachments",
  "Review and Submit",
];

const initialState: FormState = {
  vehicleId: "",
  stationId: "",
  title: "",
  description: "",
  issueType: "",
  priority: "MEDIUM",
  assignedTo: "",
  attachments: [],
};

export default function TicketFormWizard({
  open,
  vehicles,
  stations,
  technicians,
  reporterId,
  onClose,
  onCreate,
  onCreated,
}: TicketFormWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedVehicleLabel = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === formState.vehicleId)?.label || "None",
    [vehicles, formState.vehicleId],
  );

  const selectedStationLabel = useMemo(
    () => stations.find((station) => station.id === formState.stationId)?.label || "None",
    [stations, formState.stationId],
  );

  const resetWizard = () => {
    setActiveStep(0);
    setFormState(initialState);
    setErrorMessage("");
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 0 && !formState.vehicleId && !formState.stationId) {
      setErrorMessage("Select at least one asset: vehicle or station.");
      return false;
    }

    if (step === 1) {
      if (!formState.title.trim()) {
        setErrorMessage("Title is required.");
        return false;
      }

      if (!formState.description.trim()) {
        setErrorMessage("Description is required.");
        return false;
      }

      if (formState.description.trim().length < 20) {
        setErrorMessage("Description must be at least 20 characters.");
        return false;
      }

      if (!formState.issueType.trim()) {
        setErrorMessage("Issue type is required.");
        return false;
      }
    }

    if (step === 2 && !formState.priority.trim()) {
      setErrorMessage("Priority is required.");
      return false;
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

  const handleAttachmentSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    setField(
      "attachments",
      files.map((file) => file.name),
    );
  };

  const handleSubmit = () => {
    if (!validateStep(activeStep)) return;

    try {
      const created = onCreate({
        title: formState.title,
        description: formState.description,
        vehicleId: formState.vehicleId || null,
        stationId: formState.stationId || null,
        issueType: formState.issueType,
        priority: formState.priority,
        reportedBy: reporterId,
        assignedTo: formState.assignedTo || null,
        attachments: formState.attachments,
      });

      onCreated(created);
      resetWizard();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create ticket.";
      setErrorMessage(message);
    }
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="Vehicle"
            value={formState.vehicleId}
            onChange={(event) => setField("vehicleId", event.target.value)}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Station"
            value={formState.stationId}
            onChange={(event) => setField("stationId", event.target.value)}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {stations.map((station) => (
              <MenuItem key={station.id} value={station.id}>
                {station.label}
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
            label="Title"
            value={formState.title}
            onChange={(event) => setField("title", event.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={formState.description}
            onChange={(event) => setField("description", event.target.value)}
            multiline
            minRows={4}
            helperText={`${formState.description.trim().length}/20 minimum characters`}
            fullWidth
          />

          <TextField
            select
            label="Issue Type"
            value={formState.issueType}
            onChange={(event) => setField("issueType", event.target.value)}
            fullWidth
          >
            <MenuItem value="">Select type</MenuItem>
            {ISSUE_TYPE_OPTIONS.map((issueType) => (
              <MenuItem key={issueType} value={issueType}>
                {issueType.replace("_", " ")}
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
            select
            label="Priority"
            value={formState.priority}
            onChange={(event) => setField("priority", event.target.value)}
            fullWidth
          >
            {TICKET_PRIORITY_OPTIONS.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Assign Technician"
            value={formState.assignedTo}
            onChange={(event) => setField("assignedTo", event.target.value)}
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {technicians.map((technician) => (
              <MenuItem key={technician.id} value={technician.id}>
                {technician.label}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="outlined" component="label">
            Upload Photos (optional)
            <input hidden type="file" multiple onChange={handleAttachmentSelection} />
          </Button>

          <Typography variant="body2" color="text.secondary">
            {formState.attachments.length > 0
              ? `Selected: ${formState.attachments.join(", ")}`
              : "No files selected"}
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Vehicle:</strong> {selectedVehicleLabel}
        </Typography>
        <Typography variant="body2">
          <strong>Station:</strong> {selectedStationLabel}
        </Typography>
        <Typography variant="body2">
          <strong>Title:</strong> {formState.title}
        </Typography>
        <Typography variant="body2">
          <strong>Description:</strong> {formState.description}
        </Typography>
        <Typography variant="body2">
          <strong>Issue Type:</strong> {formState.issueType}
        </Typography>
        <Typography variant="body2">
          <strong>Priority:</strong> {formState.priority}
        </Typography>
        <Typography variant="body2">
          <strong>Attachments:</strong>{" "}
          {formState.attachments.length > 0
            ? formState.attachments.join(", ")
            : "None"}
        </Typography>
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetWizard();
        onClose();
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Create Maintenance Ticket</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 1, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box>{renderStep()}</Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          variant="contained"
        >
          {activeStep === steps.length - 1 ? "Submit Ticket" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
