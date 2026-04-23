export type TicketType = "single" | "return" | "day-pass" | "group";

export type TicketStatus =
  | "valid"
  | "used"
  | "expired"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "card" | "cash" | "mobile" | "pass" | "voucher";

export type FareClass =
  | "standard"
  | "concession"
  | "child"
  | "senior"
  | "student";

export interface Ticket {
  id: string;
  userId: string;
  tripId?: string;
  type: TicketType;
  status: TicketStatus;
  fareClass: FareClass;
  price: number;
  currency: string;
  paymentMethod: PaymentMethod;
  originStationId: string;
  destinationStationId: string;
  validFrom: string;
  validUntil: string;
  purchasedAt: string;
  usedAt?: string;
  qrCode?: string;
  seatNumber?: string;
}
