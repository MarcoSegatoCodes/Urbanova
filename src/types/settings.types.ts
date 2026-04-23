export type ThemeMode = "light" | "dark" | "system";

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "AUD";

export type TimeFormat = "12h" | "24h";

export type DistanceUnit = "km" | "miles";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  tripReminders: boolean;
  serviceAlerts: boolean;
  promotions: boolean;
}

export interface DisplaySettings {
  theme: ThemeMode;
  language: Language;
  timeFormat: TimeFormat;
  distanceUnit: DistanceUnit;
  compactView: boolean;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maxBookingDaysAhead: number;
  minBookingMinutesBefore: number;
  refundPolicyDays: number;
  defaultCurrency: CurrencyCode;
  supportEmail: string;
  supportPhone?: string;
}

export interface AppSettings {
  display: DisplaySettings;
  notifications: NotificationSettings;
  system: SystemSettings;
  updatedAt: string;
}
