import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { TicketFiltersBar } from "../components/molecules";
import {
  TicketDetailDialog,
  TicketFormWizard,
  TicketsTable,
} from "../components/organisms";
import {
  assignMaintenanceTicket,
  createMaintenanceTicket,
  getAllMaintenanceTickets,
  getAllStations,
  getAllUsers,
  getAllVehicles,
  sortMaintenanceTickets,
  updateMaintenanceTicket,
  updateMaintenanceTicketStatus,
} from "../services";
import type {
  SortDirection,
  Ticket,
  TicketDraft,
  TicketListFilters,
  TicketSortBy,
  TicketStatus,
} from "../types";

const DEFAULT_FILTERS: TicketListFilters = {
  status: "ALL",
  priority: "ALL",
  issueType: "ALL",
  assignedTo: "ALL",
  dateFrom: "",
  dateTo: "",
  search: "",
};

const PRIORITY_RANK: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(() => getAllMaintenanceTickets());
  const [filters, setFilters] = useState<TicketListFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<TicketSortBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pageError, setPageError] = useState<string>("");

  const vehicles = useMemo(() => getAllVehicles(), []);
  const stations = useMemo(() => getAllStations(), []);
  const users = useMemo(() => getAllUsers(), []);

  const vehicleNamesById = useMemo(
    () =>
      vehicles.reduce<Record<string, string>>((acc, vehicle) => {
        acc[vehicle.id] = vehicle.name;
        return acc;
      }, {}),
    [vehicles],
  );

  const stationNamesById = useMemo(
    () =>
      stations.reduce<Record<string, string>>((acc, station) => {
        acc[station.id] = station.name;
        return acc;
      }, {}),
    [stations],
  );

  const technicians = useMemo(
    () =>
      users
        .filter((user) => user.role === "TECHNICIAN" || user.role === "SUPPORT")
        .map((user) => ({
          id: user.id,
          label: `${user.firstName} ${user.lastName}`,
        })),
    [users],
  );

  const refreshTickets = () => {
    setTickets(getAllMaintenanceTickets());
  };

  const filteredTickets = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (filters.status !== "ALL" && ticket.status !== filters.status) return false;
      if (filters.priority !== "ALL" && ticket.priority !== filters.priority) return false;
      if (filters.issueType !== "ALL" && ticket.issueType !== filters.issueType)
        return false;

      if (filters.assignedTo !== "ALL") {
        if (filters.assignedTo === "" && ticket.assignedTo) return false;
        if (filters.assignedTo && filters.assignedTo !== ticket.assignedTo) return false;
      }

      const createdAt = new Date(ticket.createdAt);

      if (filters.dateFrom) {
        const start = new Date(`${filters.dateFrom}T00:00:00`);
        if (createdAt < start) return false;
      }

      if (filters.dateTo) {
        const end = new Date(`${filters.dateTo}T23:59:59`);
        if (createdAt > end) return false;
      }

      if (!term) return true;

      const vehicleName = ticket.vehicleId
        ? vehicleNamesById[ticket.vehicleId]?.toLowerCase() || ""
        : "";

      return (
        ticket.id.toLowerCase().includes(term) ||
        ticket.title.toLowerCase().includes(term) ||
        vehicleName.includes(term)
      );
    });
  }, [tickets, filters, vehicleNamesById]);

  const visibleTickets = useMemo(() => {
    if (sortBy === "priority") {
      const sortedByPriority = [...filteredTickets].sort(
        (a, b) => (PRIORITY_RANK[a.priority] || 0) - (PRIORITY_RANK[b.priority] || 0),
      );
      return sortDirection === "asc"
        ? sortedByPriority
        : [...sortedByPriority].reverse();
    }

    return sortMaintenanceTickets(filteredTickets, sortBy, sortDirection);
  }, [filteredTickets, sortBy, sortDirection]);

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    try {
      setPageError("");
      updateMaintenanceTicketStatus(ticketId, status);
      refreshTickets();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change ticket status.";
      setPageError(message);
    }
  };

  const handleAssign = (ticketId: string, technicianId: string | null) => {
    try {
      setPageError("");
      assignMaintenanceTicket(ticketId, technicianId);
      refreshTickets();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to assign technician.";
      setPageError(message);
    }
  };

  const handleSaveDetail = (ticketId: string, updates: Partial<Ticket>) => {
    try {
      setPageError("");
      updateMaintenanceTicket(ticketId, updates);
      refreshTickets();
      setSelectedTicket(getAllMaintenanceTickets().find((ticket) => ticket.id === ticketId) || null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save ticket changes.";
      setPageError(message);
    }
  };

  const handleCreateTicket = (draft: TicketDraft): Ticket => {
    setPageError("");
    const reporter = users.find((user) => user.role === "USER")?.id || users[0]?.id;
    return createMaintenanceTicket({ ...draft, reportedBy: draft.reportedBy || reporter });
  };

  const handleHeaderSortRequest = (nextSortBy: "priority" | "status") => {
    if (sortBy === nextSortBy) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortBy(nextSortBy);
    setSortDirection("desc");
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Maintenance Tickets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Report, track, and resolve vehicle or station maintenance issues.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateOpen(true)}
          sx={{ alignSelf: { xs: "stretch", md: "center" } }}
        >
          New Ticket
        </Button>
      </Stack>

      {pageError && <Alert severity="error">{pageError}</Alert>}

      <TicketFiltersBar
        filters={filters}
        sortBy={sortBy}
        sortDirection={sortDirection}
        technicians={technicians}
        onFiltersChange={setFilters}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <TicketsTable
        tickets={visibleTickets}
        vehicleNamesById={vehicleNamesById}
        stationNamesById={stationNamesById}
        technicians={technicians}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortRequest={handleHeaderSortRequest}
        onStatusChange={handleStatusChange}
        onAssign={handleAssign}
        onRowClick={(ticket) => setSelectedTicket(ticket)}
      />

      <Typography variant="body2" color="text.secondary">
        Showing {visibleTickets.length} of {tickets.length} tickets.
      </Typography>

      <TicketDetailDialog
        key={selectedTicket?.id || "ticket-detail"}
        open={Boolean(selectedTicket)}
        ticket={selectedTicket}
        vehicles={vehicles.map((vehicle) => ({ id: vehicle.id, label: vehicle.name }))}
        stations={stations.map((station) => ({ id: station.id, label: station.name }))}
        technicians={technicians}
        onClose={() => setSelectedTicket(null)}
        onSave={handleSaveDetail}
      />

      <TicketFormWizard
        open={isCreateOpen}
        vehicles={vehicles.map((vehicle) => ({ id: vehicle.id, label: vehicle.name }))}
        stations={stations.map((station) => ({ id: station.id, label: station.name }))}
        technicians={technicians}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTicket}
        onCreated={() => refreshTickets()}
        reporterId={users.find((user) => user.role === "USER")?.id || users[0]?.id}
      />
    </Stack>
  );
}
