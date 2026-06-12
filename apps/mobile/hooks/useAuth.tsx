// ──────────────────────────────────────────────────────────────────────────────
// Auth Context & Hook
// Manages JWT token stored in expo-secure-store
// ──────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { getAuthStatus } from '../services/api';

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored token on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync('auth_token');
        if (stored) {
          setToken(stored);
          // Verify token is still valid
          const res = await getAuthStatus();
          if (res.authenticated && res.user) {
            setUser(res.user);
          } else {
            // Token invalid – clear it
            await SecureStore.deleteItemAsync('auth_token');
            setToken(null);
          }
        }
      } catch {
        // Network or parse error – proceed unauthenticated
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (newToken: string) => {
    await SecureStore.setItemAsync('auth_token', newToken);
    setToken(newToken);
    // Fetch user info
    try {
      const res = await getAuthStatus();
      if (res.user) setUser(res.user);
    } catch {/* ignore */}
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated: !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
