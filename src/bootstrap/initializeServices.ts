import vehiclesData from "../data/vehicles.json";
import stationsData from "../data/stations.json";
import usersData from "../data/users.json";
import tripsData from "../data/trips.json";
import analyticsData from "../data/analytics.json";
import {
  initVehicles,
  initStations,
  initUsers,
  initTrips,
  initAnalytics,
} from "../services";
import type { Analytics, Station, Trip, User, Vehicle } from "../types";

let initialized = false;

export const initializeServices = (): void => {
  if (initialized) return;

  initVehicles(vehiclesData as Vehicle[]);
  initStations(stationsData as Station[]);
  initUsers(usersData as User[]);
  initTrips(tripsData as Trip[]);
  initAnalytics(analyticsData as Analytics);

  initialized = true;
};
