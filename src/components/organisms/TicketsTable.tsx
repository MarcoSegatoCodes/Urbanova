import {
  Box,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import { PriorityBadge } from "../atoms";
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
  technicians: TechnicianOption[];
  sortBy: TicketSortBy;
  sortDirection: SortDirection;
  onSortRequest: (sortBy: "priority" | "status") => void;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  onRowClick: (ticket: Ticket) => void;
}

const padTwo = (value: number): string => String(value).padStart(2, "0");

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = padTwo(date.getDate());
  const month = padTwo(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padTwo(date.getHours());
  const minutes = padTwo(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const statusToneByValue: Record<string, "error" | "warning" | "success" | "neutral"> = {
  OPEN: "error",
  IN_PROGRESS: "warning",
  AWAITING_PARTS: "warning",
  RESOLVED: "success",
  CLOSED: "neutral",
  CANCELLED: "neutral",
};

export default function TicketsTable({
  tickets,
  vehicleNamesById,
  technicians,
  sortBy,
  sortDirection,
  onSortRequest,
  onStatusChange,
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
            <TableCell>Vehicle</TableCell>
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
            <TableCell>Assigned</TableCell>
            <TableCell>Created</TableCell>
            <TableCell sortDirection={sortBy === "status" ? sortDirection : false}>
              <TableSortLabel
                active={sortBy === "status"}
                direction={sortBy === "status" ? sortDirection : "desc"}
                onClick={() => onSortRequest("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => {
            const vehicleNumber = ticket.vehicleId
              ? vehicleNamesById[ticket.vehicleId] || ticket.vehicleId
              : "-";
            const statusTone = statusToneByValue[ticket.status] || "neutral";
            const statusStyles = (theme: {
              palette: {
                error: { main: string; dark: string; contrastText: string };
                warning: { main: string; dark: string; contrastText: string };
                success: { main: string; dark: string; contrastText: string };
                grey: Record<number, string>;
              };
            }) => {
              if (statusTone === "neutral") {
                return {
                  minWidth: 170,
                  fontWeight: 600,
                  backgroundColor: theme.palette.grey[400],
                  color: theme.palette.grey[900],
                  "& .MuiSelect-icon": {
                    color: theme.palette.grey[900],
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.grey[500],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.grey[500],
                  },
                };
              }

              const palette = theme.palette[statusTone];
              return {
                minWidth: 170,
                fontWeight: 600,
                backgroundColor: palette.main,
                color: palette.contrastText,
                "& .MuiSelect-icon": {
                  color: palette.contrastText,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: palette.dark,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: palette.dark,
                },
              };
            };
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
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vehicleNumber}</Typography>
                </TableCell>
                <TableCell>{ticket.issueType}</TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>{assigned}</TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <Box onClick={(event) => event.stopPropagation()}>
                    <Select
                      size="small"
                      value={ticket.status}
                      onChange={(event) =>
                        onStatusChange(ticket.id, event.target.value as TicketStatus)
                      }
                      sx={statusStyles}
                    >
                      {TICKET_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.replace("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
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
