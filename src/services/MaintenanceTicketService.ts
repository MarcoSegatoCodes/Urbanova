import type {
  Ticket,
  TicketDraft,
  TicketSortBy,
  TicketStatus,
  SortDirection,
} from "../types";
import { getStationById } from "./StationService";
import { getUserById } from "./UserService";
import { getVehicleById } from "./VehicleService";

const STORAGE_KEY = "maintenance_tickets";

let maintenanceTickets: Ticket[] = [];

const PRIORITY_RANK: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const STATUS_RANK: Record<string, number> = {
  OPEN: 1,
  IN_PROGRESS: 2,
  AWAITING_PARTS: 3,
  RESOLVED: 4,
  CLOSED: 5,
  CANCELLED: 6,
};

const normalizeId = (value: string | null | undefined): string | null => {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
};

const assertTicketDraftValid = (draft: TicketDraft): void => {
  if (!draft.title.trim()) {
    throw new Error("Title is required.");
  }

  if (!draft.description.trim()) {
    throw new Error("Description is required.");
  }

  if (draft.description.trim().length < 20) {
    throw new Error("Description must be at least 20 characters.");
  }

  if (!draft.issueType?.trim()) {
    throw new Error("Issue type is required.");
  }

  if (!draft.priority?.trim()) {
    throw new Error("Priority is required.");
  }

  const normalizedVehicleId = normalizeId(draft.vehicleId);
  const normalizedStationId = normalizeId(draft.stationId);

  if (!normalizedVehicleId && !normalizedStationId) {
    throw new Error("Select at least one asset: vehicle or station.");
  }

  if (normalizedVehicleId && !getVehicleById(normalizedVehicleId)) {
    throw new Error("Selected vehicle does not exist.");
  }

  if (normalizedStationId && !getStationById(normalizedStationId)) {
    throw new Error("Selected station does not exist.");
  }

  if (draft.reportedBy && !getUserById(draft.reportedBy)) {
    throw new Error("Reporter user does not exist.");
  }

  if (draft.assignedTo && !getUserById(draft.assignedTo)) {
    throw new Error("Assigned technician does not exist.");
  }
};

// --- INIT ---
export const initMaintenanceTickets = (data: Ticket[]): void => {
  maintenanceTickets = data.map((ticket) => ({
    ...ticket,
    vehicleId: normalizeId(ticket.vehicleId),
    stationId: normalizeId(ticket.stationId),
    assignedTo: normalizeId(ticket.assignedTo),
    attachments: [...(ticket.attachments || [])],
  }));
};

// --- READ Operations ---
export const getAllMaintenanceTickets = (): Ticket[] => [...maintenanceTickets];

export const getMaintenanceTicketById = (id: string): Ticket | undefined => {
  return maintenanceTickets.find((ticket) => ticket.id === id);
};

export const getMaintenanceTicketsByStatus = (status: TicketStatus): Ticket[] => {
  return maintenanceTickets.filter((ticket) => ticket.status === status);
};

// --- WRITE Operations ---
export const createMaintenanceTicket = (draft: TicketDraft): Ticket => {
  assertTicketDraftValid(draft);

  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: `TK-${Date.now()}`,
    title: draft.title.trim(),
    description: draft.description.trim(),
    vehicleId: normalizeId(draft.vehicleId),
    stationId: normalizeId(draft.stationId),
    issueType: draft.issueType,
    priority: draft.priority,
    status: "OPEN",
    reportedBy: draft.reportedBy || "SYSTEM",
    assignedTo: normalizeId(draft.assignedTo),
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    attachments: [...(draft.attachments || [])],
    resolutionNotes: draft.resolutionNotes?.trim() || "",
  };

  maintenanceTickets = [ticket, ...maintenanceTickets];
  return ticket;
};

export const updateMaintenanceTicket = (
  id: string,
  updates: Partial<Ticket>,
): Ticket | undefined => {
  const index = maintenanceTickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return undefined;

  const previous = maintenanceTickets[index];
  const merged: Ticket = {
    ...previous,
    ...updates,
    title: (updates.title ?? previous.title).trim(),
    description: (updates.description ?? previous.description).trim(),
    vehicleId: normalizeId(updates.vehicleId ?? previous.vehicleId),
    stationId: normalizeId(updates.stationId ?? previous.stationId),
    assignedTo: normalizeId(updates.assignedTo ?? previous.assignedTo),
    attachments: updates.attachments ? [...updates.attachments] : previous.attachments,
    updatedAt: new Date().toISOString(),
  };

  assertTicketDraftValid({
    title: merged.title,
    description: merged.description,
    vehicleId: merged.vehicleId,
    stationId: merged.stationId,
    issueType: merged.issueType,
    priority: merged.priority,
    reportedBy: merged.reportedBy,
    assignedTo: merged.assignedTo,
    attachments: merged.attachments,
    resolutionNotes: merged.resolutionNotes,
  });

  if (merged.status === "RESOLVED" || merged.status === "CLOSED") {
    merged.resolvedAt = merged.resolvedAt || merged.updatedAt;
  }

  if (
    merged.status === "OPEN" ||
    merged.status === "IN_PROGRESS" ||
    merged.status === "AWAITING_PARTS"
  ) {
    merged.resolvedAt = null;
  }

  maintenanceTickets[index] = merged;
  return merged;
};

export const updateMaintenanceTicketStatus = (
  id: string,
  status: TicketStatus,
): Ticket | undefined => {
  return updateMaintenanceTicket(id, { status });
};

export const assignMaintenanceTicket = (
  id: string,
  technicianId: string | null,
): Ticket | undefined => {
  if (technicianId && !getUserById(technicianId)) {
    throw new Error("Assigned technician does not exist.");
  }

  return updateMaintenanceTicket(id, { assignedTo: technicianId });
};

// --- UTILITY Operations ---
export const sortMaintenanceTickets = (
  tickets: Ticket[],
  sortBy: TicketSortBy,
  direction: SortDirection,
): Ticket[] => {
  const sorted = [...tickets].sort((a, b) => {
    if (sortBy === "createdAt") {
      return a.createdAt.localeCompare(b.createdAt);
    }

    if (sortBy === "priority") {
      return (PRIORITY_RANK[a.priority] || 0) - (PRIORITY_RANK[b.priority] || 0);
    }

    return (STATUS_RANK[a.status] || 0) - (STATUS_RANK[b.status] || 0);
  });

  return direction === "asc" ? sorted : sorted.reverse();
};

export const deleteMaintenanceTicket = (id: string): boolean => {
  const previousLength = maintenanceTickets.length;
  maintenanceTickets = maintenanceTickets.filter((ticket) => ticket.id !== id);
  return maintenanceTickets.length < previousLength;
};

export const MAINTENANCE_TICKET_STORAGE_KEY = STORAGE_KEY;