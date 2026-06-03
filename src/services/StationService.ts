import type { Station, StationType, StationStatus } from "../types";

const STORAGE_KEY = "stations";

let stations: Station[] = [];

// --- INIT ---
export const initStations = (data: Station[]): void => {
  stations = [...data];
};

// --- READ Operations ---
export const getAllStations = (): Station[] => [...stations];

export const getStations = (): Station[] => getAllStations();

export const getStationById = (id: string): Station | undefined => {
  return stations.find((s) => s.id === id);
};

export const getStationsByType = (type: StationType): Station[] => {
  return stations.filter((s) => s.type === type);
};

export const getStationsByStatus = (status: StationStatus): Station[] => {
  return stations.filter((s) => s.status === status);
};

export const getOperationalStations = (): Station[] => {
  return stations.filter((s) => s.status === "OPERATIONAL");
};

export const getConnectedStations = (stationId: string): Station[] => {
  const station = getStationById(stationId);
  if (!station?.connectedStationIds) return [];
  return stations.filter((s) => station.connectedStationIds!.includes(s.id));
};

// --- WRITE Operations ---
export const addStation = (station: Station): Station => {
  stations = [...stations, station];
  return station;
};

export const updateStation = (
  id: string,
  updates: Partial<Station>,
): Station | undefined => {
  const index = stations.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  stations[index] = { ...stations[index], ...updates };
  return stations[index];
};

export const updateStationStatus = (
  id: string,
  status: StationStatus,
): Station | undefined => {
  return updateStation(id, { status });
};

export const deleteStation = (id: string): boolean => {
  const initialLength = stations.length;
  stations = stations.filter((s) => s.id !== id);
  return stations.length < initialLength;
};

// --- UTILITY Operations ---
export const getStationCount = (): number => stations.length;

export const searchStations = (query: string): Station[] => {
  const lowerQuery = query.toLowerCase();
  return stations.filter(
    (s) =>
      s.id.toLowerCase().includes(lowerQuery) ||
      s.name.toLowerCase().includes(lowerQuery) ||
      s.address?.toLowerCase().includes(lowerQuery),
  );
};

// --- STORAGE KEY Export ---
export const STATION_STORAGE_KEY = STORAGE_KEY;
