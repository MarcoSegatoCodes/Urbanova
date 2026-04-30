import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { IssueType, Ticket, TicketPriority, TicketStatus } from "../../types";
import {
  ISSUE_TYPE_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_OPTIONS,
} from "../../types/ticket.types";

interface SelectOption {
  id: string;
  label: string;
}

interface TicketDetailDialogProps {
  open: boolean;
  ticket: Ticket | null;
  vehicles: SelectOption[];
  stations: SelectOption[];
  technicians: SelectOption[];
  onClose: () => void;
  onSave: (ticketId: string, updates: Partial<Ticket>) => void;
}

interface TicketFormState {
  title: string;
  description: string;
  issueType: IssueType;
  priority: TicketPriority;
  status: TicketStatus;
  vehicleId: string;
  stationId: string;
  assignedTo: string;
  resolutionNotes: string;
}

const createStateFromTicket = (ticket: Ticket): TicketFormState => ({
  title: ticket.title,
  description: ticket.description,
  issueType: ticket.issueType,
  priority: ticket.priority,
  status: ticket.status,
  vehicleId: ticket.vehicleId || "",
  stationId: ticket.stationId || "",
  assignedTo: ticket.assignedTo || "",
  resolutionNotes: ticket.resolutionNotes,
});

const EMPTY_STATE: TicketFormState = {
  title: "",
  description: "",
  issueType: "",
  priority: "MEDIUM",
  status: "OPEN",
  vehicleId: "",
  stationId: "",
  assignedTo: "",
  resolutionNotes: "",
};

export default function TicketDetailDialog({
  open,
  ticket,
  vehicles,
  stations,
  technicians,
  onClose,
  onSave,
}: TicketDetailDialogProps) {
  const [formState, setFormState] = useState<TicketFormState>(() =>
    ticket ? createStateFromTicket(ticket) : EMPTY_STATE,
  );

  if (!ticket) {
    return null;
  }

  const setField = <K extends keyof TicketFormState>(
    key: K,
    value: TicketFormState[K],
  ) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    onSave(ticket.id, {
      title: formState.title,
      description: formState.description,
      issueType: formState.issueType,
      priority: formState.priority,
      status: formState.status,
      vehicleId: formState.vehicleId || null,
      stationId: formState.stationId || null,
      assignedTo: formState.assignedTo || null,
      resolutionNotes: formState.resolutionNotes,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Ticket Details - {ticket.id}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
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
            minRows={3}
            fullWidth
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              select
              label="Issue Type"
              value={formState.issueType}
              onChange={(event) =>
                setField("issueType", event.target.value as IssueType)
              }
              fullWidth
            >
              {ISSUE_TYPE_OPTIONS.map((issueType) => (
                <MenuItem key={issueType} value={issueType}>
                  {issueType.replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Priority"
              value={formState.priority}
              onChange={(event) =>
                setField("priority", event.target.value as TicketPriority)
              }
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
              label="Status"
              value={formState.status}
              onChange={(event) =>
                setField("status", event.target.value as TicketStatus)
              }
              fullWidth
            >
              {TICKET_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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

            <TextField
              select
              label="Assigned Technician"
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
          </Stack>

          <TextField
            label="Resolution Notes"
            value={formState.resolutionNotes}
            onChange={(event) => setField("resolutionNotes", event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <Typography variant="body2" color="text.secondary">
            Attachments: {ticket.attachments.length > 0 ? ticket.attachments.join(", ") : "None"}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
