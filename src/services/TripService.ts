import type { Trip } from "../types";

let trips: Trip[] = [];

// --- INIT ---
export const initTrips = (data: Trip[]): void => {
  trips = data.map((trip) => ({ ...trip }));
};

// --- READ Operations ---
export const getTrips = (): Trip[] => trips.map((trip) => ({ ...trip }));

export const getTripById = (id: string): Trip | undefined =>
  trips.find((trip) => trip.id === id);

export const getTripsByVehicleId = (vehicleId: string): Trip[] =>
  trips.filter((trip) => trip.vehicleId === vehicleId);

export const getTripsByUserId = (userId: string): Trip[] =>
  trips.filter((trip) => trip.userId === userId);

export const getTripsByStationId = (stationId: string): Trip[] =>
  trips.filter(
    (trip) =>
      trip.startStationId === stationId || trip.endStationId === stationId,
  );

export const getTripsInRange = (fromISO: string, toISO: string): Trip[] => {
  const from = new Date(fromISO).getTime();
  const to = new Date(toISO).getTime();

  return trips.filter((trip) => {
    const start = new Date(trip.startTime).getTime();
    return start >= from && start <= to;
  });
};

export const getActiveTrips = (): Trip[] =>
  trips.filter((trip) => !trip.endTime || trip.endTime.trim() === "");

// --- WRITE Operations ---
export const addTrip = (trip: Trip): Trip[] => {
  trips = [...trips, { ...trip }];
  return getTrips();
};

export const updateTrip = (id: string, updates: Partial<Trip>): Trip[] => {
  trips = trips.map((trip) =>
    trip.id === id ? { ...trip, ...updates, id: trip.id } : trip,
  );
  return getTrips();
};

export const removeTrip = (id: string): Trip[] => {
  trips = trips.filter((trip) => trip.id !== id);
  return getTrips();
};

// --- METRICS ---
export const getTripCount = (): number => trips.length;

export const getTripCountToday = (): number => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  return trips.filter((trip) => new Date(trip.startTime).getTime() >= startOfDay)
    .length;
};

export const getTripCountThisMonth = (): number => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return trips.filter((trip) => {
    const start = new Date(trip.startTime);
    return start.getFullYear() === year && start.getMonth() === month;
  }).length;
};

export const getTotalDistanceKm = (): number =>
  trips.reduce((sum, trip) => sum + (Number(trip.distanceKm) || 0), 0);

export const getTotalCO2SavedKg = (): number =>
  trips.reduce((sum, trip) => sum + (Number(trip.co2SavedKg) || 0), 0);

export const getAverageTripDistanceKm = (): number => {
  if (!trips.length) return 0;
  return getTotalDistanceKm() / trips.length;
};

// --- Utility ---
export const clearTrips = (): void => {
  trips = [];
};
