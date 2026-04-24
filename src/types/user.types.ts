export type UserRole =
  | "ADMIN"
  | "OPERATOR"
  | "TECHNICIAN"
  | "USER"
  | "SUPPORT"
  | string;

export type UserStatus = "ACTIVE" | "INACTIVE";

export type PassType =
  | "NONE"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY"
  | string;

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  passType?: PassType;
  passExpiryDate?: string;
  balance?: number;
  lastLoginAt?: string;
}
