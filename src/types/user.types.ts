export type UserRole = "ADMIN" | "OPERATOR" | "TECHNICIAN" | "USER" | string;

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}
