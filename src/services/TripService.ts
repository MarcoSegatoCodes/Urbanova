import type {
  Trip,
  Route,
  TripStatus,
  //TripStop,
  TripDelay,
} from "../types";

const TRIP_STORAGE_KEY = "trips";
const ROUTE_STORAGE_KEY = "routes";

let trips: Trip[] = [];
let routes: Route[] = [];

// --- INIT ---
export const initTrips = (data: Trip[]): void => {
  trips = [...data];
};

export const initRoutes = (data: Route[]): void => {
  routes = [...data];
};

// --- TRIP READ Operations ---
export const getAllTrips = (): Trip[] => [...trips];

export const getTripById = (id: string): Trip | undefined => {
  return trips.find((t) => t.id === id);
};

export const getTripsByStatus = (status: TripStatus): Trip[] => {
  return trips.filter((t) => t.status === status);
};

export const getTripsByVehicle = (vehicleId: string): Trip[] => {
  return trips.filter((t) => t.vehicleId === vehicleId);
};

export const getTripsByDriver = (driverId: string): Trip[] => {
  return trips.filter((t) => t.driverId === driverId);
};

export const getTripsByRoute = (routeId: string): Trip[] => {
  return trips.filter((t) => t.routeId === routeId);
};

export const getUpcomingTrips = (): Trip[] => {
  const now = new Date().toISOString();
  return trips.filter(
    (t) => t.scheduledDeparture > now && t.status === "scheduled",
  );
};

export const getActiveTrips = (): Trip[] => {
  return trips.filter((t) => t.status === "in-progress");
};

export const getDelayedTrips = (): Trip[] => {
  return trips.filter((t) => t.status === "delayed");
};

// --- TRIP WRITE Operations ---
export const addTrip = (trip: Trip): Trip => {
  trips = [...trips, trip];
  return trip;
};

export const updateTrip = (
  id: string,
  updates: Partial<Trip>,
): Trip | undefined => {
  const index = trips.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  trips[index] = { ...trips[index], ...updates };
  return trips[index];
};

export const updateTripStatus = (
  id: string,
  status: TripStatus,
): Trip | undefined => {
  return updateTrip(id, { status });
};

export const startTrip = (id: string): Trip | undefined => {
  return updateTrip(id, {
    status: "in-progress",
    actualDeparture: new Date().toISOString(),
  });
};

export const completeTrip = (id: string): Trip | undefined => {
  return updateTrip(id, {
    status: "completed",
    actualArrival: new Date().toISOString(),
  });
};

export const cancelTrip = (id: string): Trip | undefined => {
  return updateTrip(id, { status: "cancelled" });
};

export const setTripDelay = (
  id: string,
  delay: TripDelay,
): Trip | undefined => {
  return updateTrip(id, { status: "delayed", delay });
};

export const updatePassengerCount = (
  id: string,
  count: number,
): Trip | undefined => {
  return updateTrip(id, { passengerCount: count });
};

export const deleteTrip = (id: string): boolean => {
  const initialLength = trips.length;
  trips = trips.filter((t) => t.id !== id);
  return trips.length < initialLength;
};

// --- ROUTE READ Operations ---
export const getAllRoutes = (): Route[] => [...routes];

export const getRouteById = (id: string): Route | undefined => {
  return routes.find((r) => r.id === id);
};

export const getActiveRoutes = (): Route[] => {
  return routes.filter((r) => r.isActive);
};

export const getRoutesByVehicleType = (vehicleType: string): Route[] => {
  return routes.filter((r) => r.vehicleType === vehicleType);
};

// --- ROUTE WRITE Operations ---
export const addRoute = (route: Route): Route => {
  routes = [...routes, route];
  return route;
};

export const updateRoute = (
  id: string,
  updates: Partial<Route>,
): Route | undefined => {
  const index = routes.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  routes[index] = { ...routes[index], ...updates };
  return routes[index];
};

export const toggleRouteActive = (id: string): Route | undefined => {
  const route = getRouteById(id);
  if (!route) return undefined;
  return updateRoute(id, { isActive: !route.isActive });
};

export const deleteRoute = (id: string): boolean => {
  const initialLength = routes.length;
  routes = routes.filter((r) => r.id !== id);
  return routes.length < initialLength;
};

// --- UTILITY Operations ---
export const getTripCount = (): number => trips.length;
export const getRouteCount = (): number => routes.length;

export const searchTrips = (query: string): Trip[] => {
  const lowerQuery = query.toLowerCase();
  return trips.filter(
    (t) =>
      t.id.toLowerCase().includes(lowerQuery) ||
      t.routeId.toLowerCase().includes(lowerQuery) ||
      t.vehicleId.toLowerCase().includes(lowerQuery),
  );
};

// --- STORAGE KEY Exports ---
export { TRIP_STORAGE_KEY, ROUTE_STORAGE_KEY };
