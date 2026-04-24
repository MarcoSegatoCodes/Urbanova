import type {
  Analytics,
  AnalyticsSummary,
  TripsByDay,
  TripsByVehicleType,
  CO2ByMonth,
} from "../types";

const ANALYTICS_STORAGE_KEY = "analytics";

let analytics: Analytics | null = null;

// --- INIT ---
export const initAnalytics = (data: Analytics): void => {
  analytics = { ...data };
};

// --- READ Operations ---
export const getAnalytics = (): Analytics | null => {
  return analytics ? { ...analytics } : null;
};

export const getAnalyticsSummary = (): AnalyticsSummary | null => {
  return analytics ? { ...analytics.summary } : null;
};

export const getTripsByDayOfWeek = (): TripsByDay[] => {
  return analytics ? [...analytics.tripsByDayOfWeek] : [];
};

export const getTripsByVehicleType = (): TripsByVehicleType[] => {
  return analytics ? [...analytics.tripsByVehicleType] : [];
};

export const getCO2SavedByMonth = (): CO2ByMonth[] => {
  return analytics ? [...analytics.co2SavedByMonth] : [];
};

// --- WRITE Operations ---
export const updateAnalytics = (updates: Partial<Analytics>): Analytics | null => {
  if (!analytics) return null;

  analytics = {
    ...analytics,
    ...updates,
    summary: {
      ...analytics.summary,
      ...(updates.summary || {}),
    },
  };

  return { ...analytics };
};

export const clearAnalytics = (): void => {
  analytics = null;
};

// --- UTILITY Operations ---
export const hasAnalytics = (): boolean => analytics !== null;

// --- STORAGE KEY Export ---
export { ANALYTICS_STORAGE_KEY };
