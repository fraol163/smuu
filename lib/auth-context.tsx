"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "employer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_approved: boolean;
  smu_id?: string;
  department?: string;
  gpa?: number;
  skills?: string[];
  bio?: string;
  graduation_year?: number;
  company_name?: string;
  company_sector?: string;
  company_description?: string;
  company_website?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerStudent: (data: StudentRegistration) => Promise<{ success: boolean; error?: string }>;
  registerEmployer: (data: EmployerRegistration) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
}

export interface StudentRegistration {
  name: string;
  email: string;
  password: string;
  smu_id: string;
  gpa: number;
  skills: string[];
  bio: string;
  graduation_year: number;
}

export interface EmployerRegistration {
  name: string;
  email: string;
  password: string;
  company_name: string;
  company_sector: string;
  company_description: string;
  company_website: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function setAuthCookie(user: User) {
  document.cookie = `smu-auth=${JSON.stringify({ id: user.id, role: user.role })}; path=/; max-age=86400; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = "smu-auth=; path=/; max-age=0";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("smu-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("smu-user");
        clearAuthCookie();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      localStorage.setItem("smu-user", JSON.stringify(data.user));
      setAuthCookie(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smu-user");
    clearAuthCookie();
  };

  const registerStudent = async (data: StudentRegistration) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "student", ...data }),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error || "Registration failed" };
      }

      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const registerEmployer = async (data: EmployerRegistration) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "employer", ...data }),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error || "Registration failed" };
      }

      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("smu-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        registerStudent,
        registerEmployer,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
