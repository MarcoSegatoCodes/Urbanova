import type {
  Ticket,
  TicketType,
  TicketStatus,
  // FareClass,
  PaymentMethod,
} from "../types";

const STORAGE_KEY = "tickets";

let tickets: Ticket[] = [];

// --- INIT ---
export const initTickets = (data: Ticket[]): void => {
  tickets = [...data];
};

// --- READ Operations ---
export const getAllTickets = (): Ticket[] => [...tickets];

export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find((t) => t.id === id);
};

export const getTicketsByUser = (userId: string): Ticket[] => {
  return tickets.filter((t) => t.userId === userId);
};

export const getTicketsByStatus = (status: TicketStatus): Ticket[] => {
  return tickets.filter((t) => t.status === status);
};

export const getTicketsByType = (type: TicketType): Ticket[] => {
  return tickets.filter((t) => t.type === type);
};

export const getValidTickets = (): Ticket[] => {
  return tickets.filter((t) => t.status === "VALID");
};

export const getTicketsByTrip = (tripId: string): Ticket[] => {
  return tickets.filter((t) => t.tripId === tripId);
};

export const getTicketsByRoute = (
  originId: string,
  destinationId: string,
): Ticket[] => {
  return tickets.filter(
    (t) =>
      t.originStationId === originId &&
      t.destinationStationId === destinationId,
  );
};

// --- WRITE Operations ---
export const addTicket = (ticket: Ticket): Ticket => {
  tickets = [...tickets, ticket];
  return ticket;
};

export const updateTicket = (
  id: string,
  updates: Partial<Ticket>,
): Ticket | undefined => {
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tickets[index] = { ...tickets[index], ...updates };
  return tickets[index];
};

export const useTicket = (id: string): Ticket | undefined => {
  return updateTicket(id, { status: "USED", usedAt: new Date().toISOString() });
};

export const cancelTicket = (id: string): Ticket | undefined => {
  return updateTicket(id, { status: "CANCELLED" });
};

export const refundTicket = (id: string): Ticket | undefined => {
  return updateTicket(id, { status: "REFUNDED" });
};

export const expireTicket = (id: string): Ticket | undefined => {
  return updateTicket(id, { status: "EXPIRED" });
};

export const deleteTicket = (id: string): boolean => {
  const initialLength = tickets.length;
  tickets = tickets.filter((t) => t.id !== id);
  return tickets.length < initialLength;
};

// --- UTILITY Operations ---
export const getTicketCount = (): number => tickets.length;

export const getTicketCountByStatus = (): Record<TicketStatus, number> => {
  return tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<TicketStatus, number>,
  );
};

export const getTotalRevenue = (): number => {
  return tickets.reduce((sum, t) => sum + (t.price ?? 0), 0);
};

export const getRevenueByPaymentMethod = (): Record<PaymentMethod, number> => {
  return tickets.reduce(
    (acc, t) => {
      if (!t.paymentMethod) {
        return acc;
      }
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + (t.price ?? 0);
      return acc;
    },
    {} as Record<PaymentMethod, number>,
  );
};

export const searchTickets = (query: string): Ticket[] => {
  const lowerQuery = query.toLowerCase();
  return tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(lowerQuery) ||
      t.userId?.toLowerCase().includes(lowerQuery) ||
      t.qrCode?.toLowerCase().includes(lowerQuery),
  );
};

export const validateTicket = (
  id: string,
): { valid: boolean; reason?: string } => {
  const ticket = getTicketById(id);
  if (!ticket) return { valid: false, reason: "Ticket not found" };
  if (ticket.status !== "VALID")
    return { valid: false, reason: `Ticket is ${ticket.status}` };

  const now = new Date().toISOString();
  if (ticket.validFrom && ticket.validFrom > now)
    return { valid: false, reason: "Ticket not yet valid" };
  if (ticket.validUntil && ticket.validUntil < now)
    return { valid: false, reason: "Ticket expired" };

  return { valid: true };
};

// --- STORAGE KEY Export ---
export const TICKET_STORAGE_KEY = STORAGE_KEY;
