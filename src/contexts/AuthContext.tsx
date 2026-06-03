import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import * as AuthService from "../services/AuthService";
import type { LoginResult } from "../services/AuthService";

interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = AuthService.getStoredSession();
    setCurrentUser(stored);
    setInitialized(true);
  }, []);

  const login = (email: string, password: string): LoginResult => {
    const result = AuthService.login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  if (!initialized) return null;

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isAuthenticated: currentUser !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
