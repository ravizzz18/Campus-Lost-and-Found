import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAsDemoUser: (role?: 'student' | 'staff' | 'admin') => void;
  logout: () => void;
  isLoading: boolean;
}

const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr-student-01',
    name: 'Jordan Taylor',
    email: 'jordan.t@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    campusId: 'STU-2024-8821',
    phone: '+1 (555) 019-4567',
    createdAt: '2026-09-01',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Administrator Sarah',
    email: 'admin.lostfound@campus.edu',
    role: 'admin',
    department: 'Campus Safety & Student Affairs',
    campusId: 'STAFF-ADMIN-01',
    phone: '+1 (555) 019-0001',
    createdAt: '2026-01-15',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if preview user was stored in sessionStorage for dev testing
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = sessionStorage.getItem('clf_preview_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem('clf_preview_user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('clf_preview_user');
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, [user]);

  const loginAsDemoUser = (role: 'student' | 'staff' | 'admin' = 'student') => {
    setIsLoading(true);
    const selected = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.student;
    setUser(selected);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loginAsDemoUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
