import type { Trip } from "../types";

const TRIP_STORAGE_KEY = "trips";

let trips: Trip[] = [];

// --- INIT ---
export const initTrips = (data: Trip[]): void => {
  trips = [...data];
};

// --- READ Operations ---
export const getAllTrips = (): Trip[] => [...trips];

export const getTripById = (id: string): Trip | undefined => {
  return trips.find((trip) => trip.id === id);
};

export const getTripsByVehicle = (vehicleId: string): Trip[] => {
  return trips.filter((trip) => trip.vehicleId === vehicleId);
};

export const getTripsByUser = (userId: string): Trip[] => {
  return trips.filter((trip) => trip.userId === userId);
};

export const getTripsByStartStation = (stationId: string): Trip[] => {
  return trips.filter((trip) => trip.startStationId === stationId);
};

export const getTripsByEndStation = (stationId: string): Trip[] => {
  return trips.filter((trip) => trip.endStationId === stationId);
};

export const getTripsInDateRange = (
  startIsoDate: string,
  endIsoDate: string,
): Trip[] => {
  return trips.filter(
    (trip) => trip.startTime >= startIsoDate && trip.endTime <= endIsoDate,
  );
};

// --- WRITE Operations ---
export const addTrip = (trip: Trip): Trip => {
  trips = [...trips, trip];
  return trip;
};

export const updateTrip = (
  id: string,
  updates: Partial<Trip>,
): Trip | undefined => {
  const index = trips.findIndex((trip) => trip.id === id);
  if (index === -1) return undefined;

  trips[index] = { ...trips[index], ...updates };
  return trips[index];
};

export const deleteTrip = (id: string): boolean => {
  const initialLength = trips.length;
  trips = trips.filter((trip) => trip.id !== id);
  return trips.length < initialLength;
};

// --- UTILITY Operations ---
export const getTripCount = (): number => trips.length;

export const getTotalDistanceKm = (): number => {
  return trips.reduce((total, trip) => total + trip.distanceKm, 0);
};

export const getTotalCO2Saved = (): number => {
  return trips.reduce((total, trip) => total + trip.co2SavedKg, 0);
};

export const searchTrips = (query: string): Trip[] => {
  const lowerQuery = query.toLowerCase();
  return trips.filter(
    (trip) =>
      trip.id.toLowerCase().includes(lowerQuery) ||
      trip.vehicleId.toLowerCase().includes(lowerQuery) ||
      trip.userId.toLowerCase().includes(lowerQuery) ||
      trip.startStationId.toLowerCase().includes(lowerQuery) ||
      trip.endStationId.toLowerCase().includes(lowerQuery),
  );
};

// --- STORAGE KEY Export ---
export { TRIP_STORAGE_KEY };