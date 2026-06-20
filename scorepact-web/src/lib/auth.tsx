import { createContext, useContext, type ReactNode } from "react";

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: { id: string; name: string } | null;
  signOut: () => void;
}

// UI-only stub. At wiring time, replace the value below with Clerk's
// useAuth()/useUser() and drop ClerkProvider above AuthProvider in main.tsx.
const stub: AuthState = {
  isLoaded: true,
  isSignedIn: true,
  user: { id: "dev", name: "You" },
  signOut: () => {},
};

const AuthContext = createContext<AuthState>(stub);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={stub}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);