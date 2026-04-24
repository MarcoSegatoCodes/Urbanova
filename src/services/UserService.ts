import type { User, UserRole, UserStatus, PassType } from "../types";

const STORAGE_KEY = "users";

let users: User[] = [];

// --- INIT ---
export const initUsers = (data: User[]): void => {
  users = [...data];
};

// --- READ Operations ---
export const getAllUsers = (): User[] => [...users];

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const getUsersByRole = (role: UserRole): User[] => {
  return users.filter((u) => u.role === role);
};

export const getUsersByStatus = (status: UserStatus): User[] => {
  return users.filter(
    (u) => (u.status ?? (u.isActive ? "ACTIVE" : "INACTIVE")) === status,
  );
};

export const getActiveUsers = (): User[] => {
  return users.filter((u) => (u.status ?? "ACTIVE") === "ACTIVE");
};

export const getUsersWithValidPass = (): User[] => {
  const now = new Date().toISOString();
  return users.filter(
    (u) =>
      u.passType &&
      u.passType !== "NONE" &&
      u.passExpiryDate &&
      u.passExpiryDate > now,
  );
};

// --- WRITE Operations ---
export const addUser = (user: User): User => {
  users = [...users, user];
  return user;
};

export const updateUser = (
  id: string,
  updates: Partial<User>,
): User | undefined => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...updates };
  return users[index];
};

export const updateUserStatus = (
  id: string,
  status: UserStatus,
): User | undefined => {
  return updateUser(id, {
    status,
    isActive: status === "ACTIVE",
  });
};

export const updateUserPass = (
  id: string,
  passType: PassType,
  expiryDate: string,
): User | undefined => {
  return updateUser(id, { passType, passExpiryDate: expiryDate });
};

export const updateUserBalance = (
  id: string,
  amount: number,
): User | undefined => {
  const user = getUserById(id);
  if (!user) return undefined;
  const newBalance = (user.balance || 0) + amount;
  return updateUser(id, { balance: newBalance });
};

export const recordLogin = (id: string): User | undefined => {
  return updateUser(id, { lastLoginAt: new Date().toISOString() });
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== id);
  return users.length < initialLength;
};

// --- UTILITY Operations ---
export const getUserCount = (): number => users.length;

export const getUserCountByRole = (): Record<UserRole, number> => {
  return users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<UserRole, number>,
  );
};

export const searchUsers = (query: string): User[] => {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (u) =>
      u.id.toLowerCase().includes(lowerQuery) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery),
  );
};

export const authenticateUser = (email: string): User | undefined => {
  const user = getUserByEmail(email);
  if (user && (user.status ?? (user.isActive ? "ACTIVE" : "INACTIVE")) === "ACTIVE") {
    recordLogin(user.id);
    return user;
  }
  return undefined;
};

// --- STORAGE KEY Export ---
export const USER_STORAGE_KEY = STORAGE_KEY;
