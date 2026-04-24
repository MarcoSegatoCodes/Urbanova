export type IssueType =
  | "FLAT_TIRE"
  | "BATTERY"
  | "BRAKE"
  | "VANDALISM"
  | "THEFT"
  | "OTHER"
  | string;

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED"
  | string;

export interface Ticket {
  id: string;
  title: string;
  description: string;
  vehicleId: string;
  stationId: string;
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
