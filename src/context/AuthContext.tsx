// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  activeLanguage: 'en' | 'ta';
  setActiveLanguage: (lang: 'en' | 'ta') => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: { email: string; password: string; fullName: string; role?: Role; preferredLanguage?: string }) => Promise<void>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('carepass_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ta'>(
    (localStorage.getItem('carepass_lang') as 'en' | 'ta') || 'en'
  );

  const handleLanguageChange = (lang: 'en' | 'ta') => {
    setActiveLanguage(lang);
    localStorage.setItem('carepass_lang', lang);
  };

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('carepass_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          if (res.user.preferredLanguage === 'ta' || res.user.preferredLanguage === 'en') {
            setActiveLanguage(res.user.preferredLanguage as 'en' | 'ta');
          }
        } catch (err) {
          console.warn('Session expired or invalid, clearing local session.');
          localStorage.removeItem('carepass_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('carepass_token', res.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { email: string; password: string; fullName: string; role?: Role; preferredLanguage?: string }) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('carepass_token', res.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('carepass_token');
    }
  };

  const quickDemoLogin = async (role: Role) => {
    const emailMap: Record<Role, string> = {
      PATIENT: 'demo.patient@example.com',
      HEALTHCARE_PROFESSIONAL: 'demo.doctor@example.com',
      ADMIN: 'demo.admin@example.com',
    };
    await login(emailMap[role], 'Demo123!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeLanguage,
        setActiveLanguage: handleLanguageChange,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
