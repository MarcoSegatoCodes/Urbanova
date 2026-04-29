export type TicketType =
  | "SINGLE"
  | "DAY_PASS"
  | "WEEK_PASS"
  | "MONTH_PASS"
  | string;

export type TicketStatus =
  | "valid"
  | "used"
  | "cancelled"
  | "refunded"
  | "expired"
  | string;

export type PaymentMethod = "CARD" | "CASH" | "WALLET" | string;

export interface Ticket {
  id: string;
  userId: string;
  type: TicketType;
  status: TicketStatus;
  tripId: string;
  originStationId: string;
  destinationStationId: string;
  price: number;
  paymentMethod: PaymentMethod;
  validFrom: string;
  validUntil: string;
  qrCode?: string;
  usedAt?: string;
}