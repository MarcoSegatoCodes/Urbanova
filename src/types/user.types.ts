export type UserRole = "ADMIN" | "OPERATOR" | "TECHNICIAN" | "USER" | string;

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;

export type PassType =
  | "NONE"
  | "SINGLE"
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
  status?: UserStatus;
  passType?: PassType;
  passExpiryDate?: string;
  balance?: number;
  lastLoginAt?: string;
}
