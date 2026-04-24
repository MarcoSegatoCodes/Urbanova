import type { User, UserRole } from "../types";

const STORAGE_KEY = "users";

let users: User[] = [];

// --- INIT ---
export const initUsers = (data: User[]): void => {
  users = [...data];
};

// --- READ Operations ---
export const getAllUsers = (): User[] => [...users];

export const getUsers = (): User[] => getAllUsers();

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const getUsersByRole = (role: UserRole): User[] => {
  return users.filter((u) => u.role === role);
};

export const getActiveUsers = (): User[] => {
  return users.filter((u) => u.isActive);
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
      u.firstName.toLowerCase().includes(lowerQuery) ||
      u.lastName.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery),
  );
};

export const authenticateUser = (email: string): User | undefined => {
  const user = getUserByEmail(email);
  if (user && user.isActive) {
    return user;
  }
  return undefined;
};

// --- STORAGE KEY Export ---
export const USER_STORAGE_KEY = STORAGE_KEY;
