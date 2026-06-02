import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface AuthUser {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  usertype?: string;
  subscription_type?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  token: string | null;
  setUser: (user: AuthUser | null, token?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'admin_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('admin_token');
    } catch {
      return null;
    }
  });

  const setUser = useCallback((u: AuthUser | null, t?: string) => {
    setUserState(u);
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      if (t) {
        setTokenState(t);
        localStorage.setItem('admin_token', t);
      }
    } else {
      setTokenState(null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('admin_token');
    }
  }, []);

  // Sync user state with token state
  useEffect(() => {
    if (user && !token) {
      // If we have a user but no token, the state is invalid/legacy
      setUserState(null);
      localStorage.removeItem(USER_KEY);
    }
  }, [user, token]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!(user && token), token, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
