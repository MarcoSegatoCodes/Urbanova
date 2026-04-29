export type IssueType =
  | "MECHANICAL"
  | "ELECTRICAL"
  | "FLAT_TIRE"
  | "BATTERY"
  | "BRAKE"
  | "VANDALISM"
  | "THEFT"
  | "SOFTWARE"
  | "CLEANLINESS"
  | "OTHER"
  | string;

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "AWAITING_PARTS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED"
  | string;

export const ISSUE_TYPE_OPTIONS = [
  "MECHANICAL",
  "ELECTRICAL",
  "FLAT_TIRE",
  "BATTERY",
  "BRAKE",
  "VANDALISM",
  "THEFT",
  "SOFTWARE",
  "CLEANLINESS",
  "OTHER",
] as const;

export const TICKET_PRIORITY_OPTIONS = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export const TICKET_STATUS_OPTIONS = [
  "OPEN",
  "IN_PROGRESS",
  "AWAITING_PARTS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
] as const;

export interface Ticket {
  id: string;
  title: string;
  description: string;
  vehicleId: string | null;
  stationId: string | null;
  issueType: IssueType;
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  attachments: string[];
  resolutionNotes: string;
}

export interface TicketDraft {
  title: string;
  description: string;
  vehicleId: string | null;
  stationId: string | null;
  issueType: IssueType;
  priority: TicketPriority;
  reportedBy?: string;
  assignedTo?: string | null;
  attachments?: string[];
  resolutionNotes?: string;
}

export interface TicketListFilters {
  status: TicketStatus | "ALL";
  priority: TicketPriority | "ALL";
  issueType: IssueType | "ALL";
  assignedTo: string | "ALL";
  hideInactive: boolean;
  dateFrom: string;
  dateTo: string;
  search: string;
}

export type TicketSortBy = "createdAt" | "priority" | "status";
export type SortDirection = "asc" | "desc";
