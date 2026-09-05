import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LocalDataService } from '../services/api';

const SESSION_USER_KEY = 'hostelsphere_session_user';
const SESSION_TOKEN_KEY = 'hostelsphere_auth_token';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, pass: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
  loginAsManager: () => void;
  loginAsTenant: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session state initialized from LocalStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(SESSION_TOKEN_KEY) || null;
  });

  const isAuthenticated = !!user && !!token;
  const role = user?.role || null;

  // Persist session user changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  }, [user, token]);

  const login = (email: string, pass: string): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const users = LocalDataService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.is_deactivated) {
      return { success: false, error: 'Your account has been deactivated by Hostel Management.' };
    }

    if (found.password && found.password !== cleanPass) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Generate simulated session token
    const newToken = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    setUser(found);
    setToken(newToken);

    return { success: true, user: found };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
  };

  const changePassword = (oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'Not authenticated.' };

    const users = LocalDataService.getUsers();
    const currentStoredUser = users.find(u => u.id === user.id);

    if (currentStoredUser?.password && currentStoredUser.password !== oldPassword) {
      return { success: false, error: 'Current password does not match.' };
    }

    const updatedUser: User = {
      ...user,
      password: newPassword,
      must_change_password: false,
    };

    const updatedUsers = users.map(u => (u.id === user.id ? updatedUser : u));
    LocalDataService.setUsers(updatedUsers);

    setUser(updatedUser);
    return { success: true };
  };

  // Quick switch helpers for internal demo testing
  const loginAsManager = () => {
    login('vamsigandrothu@gmail.com', 'vamsigandu');
  };

  const loginAsTenant = () => {
    login('tenant@hostelsphere.com', 'Tenant@1234');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        token,
        login,
        logout,
        changePassword,
        loginAsManager,
        loginAsTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
