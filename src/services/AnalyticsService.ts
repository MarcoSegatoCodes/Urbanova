import type { Analytics, AnalyticsSummary } from "../types";
import {
  getVehicles,
  getActiveVehicles,
  getVehicleTypeDistribution,
} from "./VehicleService";
import { getStations, getOperationalStations } from "./StationService";
import {
  getTrips,
  getTripCountToday,
  getTripCountThisMonth,
  getTotalCO2SavedKg,
} from "./TripService";

let analytics: Analytics = {
  summary: {
    totalVehicles: 0,
    activeVehicles: 0,
    totalStations: 0,
    operationalStations: 0,
    totalTripsToday: 0,
    totalTripsThisMonth: 0,
    co2SavedToday: 0,
    co2SavedThisMonth: 0,
    co2SavedAllTime: 0,
  },
  tripsByDayOfWeek: [],
  tripsByVehicleType: [],
  co2SavedByMonth: [],
};

// --- INIT ---
export const initAnalytics = (data: Analytics): void => {
  analytics = {
    ...data,
    summary: { ...data.summary },
    tripsByDayOfWeek: [...data.tripsByDayOfWeek],
    tripsByVehicleType: [...data.tripsByVehicleType],
    co2SavedByMonth: [...data.co2SavedByMonth],
  };
};

// --- READ Operations ---
export const getAnalytics = (): Analytics => ({
  ...analytics,
  summary: { ...analytics.summary },
  tripsByDayOfWeek: [...analytics.tripsByDayOfWeek],
  tripsByVehicleType: [...analytics.tripsByVehicleType],
  co2SavedByMonth: [...analytics.co2SavedByMonth],
});

export const getAnalyticsSummary = (): AnalyticsSummary => ({
  ...analytics.summary,
});

export const getTripsByDayOfWeek = () => [...analytics.tripsByDayOfWeek];

export const getTripsByVehicleType = () => [...analytics.tripsByVehicleType];

export const getCO2SavedByMonth = () => [...analytics.co2SavedByMonth];

// --- RECALC ---
const computeCO2Today = (): number => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  return getTrips()
    .filter((trip) => new Date(trip.startTime).getTime() >= startOfDay)
    .reduce((sum, trip) => sum + (Number(trip.co2SavedKg) || 0), 0);
};

const computeCO2ThisMonth = (): number => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return getTrips()
    .filter((trip) => {
      const start = new Date(trip.startTime);
      return start.getFullYear() === year && start.getMonth() === month;
    })
    .reduce((sum, trip) => sum + (Number(trip.co2SavedKg) || 0), 0);
};

const computeTripsByDayOfWeek = () => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  getTrips().forEach((trip) => {
    const day = new Date(trip.startTime).getDay();
    counts[day] += 1;
  });

  return dayNames.map((day, index) => ({ day, trips: counts[index] }));
};

const computeTripsByVehicleType = () => {
  const distribution = getVehicleTypeDistribution();
  return Object.entries(distribution).map(([type, value]) => ({ type, value }));
};

const computeCO2ByMonth = () => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const buckets = new Map<string, number>();

  getTrips().forEach((trip) => {
    const start = new Date(trip.startTime);
    const key = `${start.getFullYear()}-${start.getMonth()}`;
    buckets.set(key, (buckets.get(key) ?? 0) + (Number(trip.co2SavedKg) || 0));
  });

  const sorted = Array.from(buckets.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return sorted.map(([key, co2]) => {
    const [year, monthIndex] = key.split("-").map(Number);
    return {
      month: `${monthNames[monthIndex]} ${year}`,
      co2,
    };
  });
};

export const refreshAnalytics = (): Analytics => {
  const totalVehicles = getVehicles().length;
  const activeVehicles = getActiveVehicles().length;
  const totalStations = getStations().length;
  const operationalStations = getOperationalStations().length;

  analytics.summary = {
    totalVehicles,
    activeVehicles,
    totalStations,
    operationalStations,
    totalTripsToday: getTripCountToday(),
    totalTripsThisMonth: getTripCountThisMonth(),
    co2SavedToday: computeCO2Today(),
    co2SavedThisMonth: computeCO2ThisMonth(),
    co2SavedAllTime: getTotalCO2SavedKg(),
  };

  analytics.tripsByDayOfWeek = computeTripsByDayOfWeek();
  analytics.tripsByVehicleType = computeTripsByVehicleType();
  analytics.co2SavedByMonth = computeCO2ByMonth();

  return getAnalytics();
};

export const getDashboardKpis = () => {
  const summary = analytics.summary;
  const vehicleUtilizationPct =
    summary.totalVehicles > 0
      ? (summary.activeVehicles / summary.totalVehicles) * 100
      : 0;

  const stationOperationalPct =
    summary.totalStations > 0
      ? (summary.operationalStations / summary.totalStations) * 100
      : 0;

  return {
    vehicleUtilizationPct,
    stationOperationalPct,
    avgTripsPerVehiclePerMonth:
      summary.totalVehicles > 0
        ? summary.totalTripsThisMonth / summary.totalVehicles
        : 0,
  };
};
