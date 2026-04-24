import {
  Box,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import { PriorityBadge, StatusBadge } from "../atoms";
import type {
  SortDirection,
  Ticket,
  TicketSortBy,
  TicketStatus,
} from "../../types";
import { TICKET_STATUS_OPTIONS } from "../../types/ticket.types";

interface TechnicianOption {
  id: string;
  label: string;
}

interface TicketsTableProps {
  tickets: Ticket[];
  vehicleNamesById: Record<string, string>;
  stationNamesById: Record<string, string>;
  technicians: TechnicianOption[];
  sortBy: TicketSortBy;
  sortDirection: SortDirection;
  onSortRequest: (sortBy: "priority" | "status") => void;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  onAssign: (ticketId: string, technicianId: string | null) => void;
  onRowClick: (ticket: Ticket) => void;
}

const formatDate = (value: string): string =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function TicketsTable({
  tickets,
  vehicleNamesById,
  stationNamesById,
  technicians,
  sortBy,
  sortDirection,
  onSortRequest,
  onStatusChange,
  onAssign,
  onRowClick,
}: TicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No tickets match the current filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ticket</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Issue Type</TableCell>
            <TableCell
              sortDirection={sortBy === "priority" ? sortDirection : false}
            >
              <TableSortLabel
                active={sortBy === "priority"}
                direction={sortBy === "priority" ? sortDirection : "desc"}
                onClick={() => onSortRequest("priority")}
              >
                Priority
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortBy === "status" ? sortDirection : false}>
              <TableSortLabel
                active={sortBy === "status"}
                direction={sortBy === "status" ? sortDirection : "desc"}
                onClick={() => onSortRequest("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>Assigned</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Quick Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => {
            const vehicleName = ticket.vehicleId
              ? vehicleNamesById[ticket.vehicleId] || ticket.vehicleId
              : "-";
            const stationName = ticket.stationId
              ? stationNamesById[ticket.stationId] || ticket.stationId
              : "-";
            const assigned =
              technicians.find((tech) => tech.id === ticket.assignedTo)?.label ||
              "Unassigned";

            return (
              <TableRow
                key={ticket.id}
                hover
                onClick={() => onRowClick(ticket)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {ticket.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">Vehicle: {vehicleName}</Typography>
                  <Typography variant="body2">Station: {stationName}</Typography>
                </TableCell>
                <TableCell>{ticket.issueType}</TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>{assigned}</TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <Box onClick={(event) => event.stopPropagation()}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                      <Select
                        size="small"
                        value={ticket.status}
                        onChange={(event) =>
                          onStatusChange(
                            ticket.id,
                            event.target.value as TicketStatus,
                          )
                        }
                        sx={{ minWidth: 160 }}
                      >
                        {TICKET_STATUS_OPTIONS.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status.replace("_", " ")}
                          </MenuItem>
                        ))}
                      </Select>

                      <Select
                        size="small"
                        value={ticket.assignedTo || ""}
                        onChange={(event) =>
                          onAssign(ticket.id, event.target.value || null)
                        }
                        displayEmpty
                        sx={{ minWidth: 180 }}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {technicians.map((technician) => (
                          <MenuItem key={technician.id} value={technician.id}>
                            {technician.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
