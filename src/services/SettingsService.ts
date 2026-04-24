import type {
  AppSettings,
  DisplaySettings,
  NotificationSettings,
  SystemSettings,
  ThemeMode,
  Language,
  CurrencyCode,
} from "../types";

const STORAGE_KEY = "settings";

let settings: AppSettings = {
  display: {
    theme: "system",
    language: "en",
    timeFormat: "24h",
    distanceUnit: "km",
    compactView: false,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    tripReminders: true,
    serviceAlerts: true,
    promotions: false,
  },
  system: {
    maintenanceMode: false,
    maxBookingDaysAhead: 30,
    minBookingMinutesBefore: 15,
    refundPolicyDays: 7,
    defaultCurrency: "USD",
    supportEmail: "support@transit.com",
  },
  updatedAt: new Date().toISOString(),
};

// --- INIT ---
export const initSettings = (data: AppSettings): void => {
  settings = { ...data };
};

// --- READ Operations ---
export const getSettings = (): AppSettings => ({ ...settings });

export const getDisplaySettings = (): DisplaySettings => ({
  ...settings.display,
});

export const getNotificationSettings = (): NotificationSettings => ({
  ...settings.notifications,
});

export const getSystemSettings = (): SystemSettings => ({ ...settings.system });

export const getTheme = (): ThemeMode => settings.display.theme;

export const getLanguage = (): Language => settings.display.language;

export const getCurrency = (): CurrencyCode => settings.system.defaultCurrency;

export const isMaintenanceMode = (): boolean => settings.system.maintenanceMode;

// --- WRITE Operations ---
export const updateSettings = (updates: Partial<AppSettings>): AppSettings => {
  settings = { ...settings, ...updates, updatedAt: new Date().toISOString() };
  return settings;
};

export const updateDisplaySettings = (
  updates: Partial<DisplaySettings>,
): AppSettings => {
  settings = {
    ...settings,
    display: { ...settings.display, ...updates },
    updatedAt: new Date().toISOString(),
  };
  return settings;
};

export const updateNotificationSettings = (
  updates: Partial<NotificationSettings>,
): AppSettings => {
  settings = {
    ...settings,
    notifications: { ...settings.notifications, ...updates },
    updatedAt: new Date().toISOString(),
  };
  return settings;
};

export const updateSystemSettings = (
  updates: Partial<SystemSettings>,
): AppSettings => {
  settings = {
    ...settings,
    system: { ...settings.system, ...updates },
    updatedAt: new Date().toISOString(),
  };
  return settings;
};

// --- CONVENIENCE SETTERS ---
export const setTheme = (theme: ThemeMode): AppSettings => {
  return updateDisplaySettings({ theme });
};

export const setLanguage = (language: Language): AppSettings => {
  return updateDisplaySettings({ language });
};

export const setCurrency = (currency: CurrencyCode): AppSettings => {
  return updateSystemSettings({ defaultCurrency: currency });
};

export const toggleMaintenanceMode = (): AppSettings => {
  return updateSystemSettings({
    maintenanceMode: !settings.system.maintenanceMode,
  });
};

export const toggleCompactView = (): AppSettings => {
  return updateDisplaySettings({ compactView: !settings.display.compactView });
};

export const toggleNotification = (
  key: keyof NotificationSettings,
): AppSettings => {
  return updateNotificationSettings({ [key]: !settings.notifications[key] });
};

// --- RESET ---
export const resetToDefaults = (): AppSettings => {
  settings = {
    display: {
      theme: "system",
      language: "en",
      timeFormat: "24h",
      distanceUnit: "km",
      compactView: false,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      tripReminders: true,
      serviceAlerts: true,
      promotions: false,
    },
    system: {
      maintenanceMode: false,
      maxBookingDaysAhead: 30,
      minBookingMinutesBefore: 15,
      refundPolicyDays: 7,
      defaultCurrency: "USD",
      supportEmail: "support@transit.com",
    },
    updatedAt: new Date().toISOString(),
  };
  return settings;
};

// --- STORAGE KEY Export ---
export const SETTINGS_STORAGE_KEY = STORAGE_KEY;
