export type UserRole =
  | "passenger"
  | "driver"
  | "admin"
  | "inspector"
  | "support";

export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending-verification";

export type PassType = "daily" | "weekly" | "monthly" | "annual" | "none";

export interface UserPreferences {
  notifications: boolean;
  language: string;
  theme: "light" | "dark" | "system";
  defaultPaymentMethod?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  avatar?: string;
  passType?: PassType;
  passExpiryDate?: string;
  balance?: number;
  preferences?: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}
