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
  | "VALID"
  | "USED"
  | "EXPIRED"
  | "REFUNDED"
  | string;

export type TicketType =
  | "SINGLE_RIDE"
  | "DAY_PASS"
  | "WEEK_PASS"
  | "MONTH_PASS"
  | string;

export type PaymentMethod =
  | "CARD"
  | "CASH"
  | "WALLET"
  | "TRANSFER"
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
  userId?: string;
  type?: TicketType;
  tripId?: string;
  originStationId?: string;
  destinationStationId?: string;
  usedAt?: string;
  price?: number;
  paymentMethod?: PaymentMethod;
  qrCode?: string;
  validFrom?: string;
  validUntil?: string;
}
