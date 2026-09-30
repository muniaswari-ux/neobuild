import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
signIn: (email: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "flipbloom-auth-user";

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const user = JSON.parse(value) as Partial<AuthUser>;
    return user.id && user.email ? { id: user.id, email: user.email } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  useEffect(() => {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
signIn: (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) return false;
      setUser({ id: normalizedEmail, email: normalizedEmail });
      return true;
    },
    signOut: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}