"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "employer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_approved: boolean;
  // Student fields
  smu_id?: string;
  department?: string;
  gpa?: number;
  skills?: string[];
  bio?: string;
  graduation_year?: number;
  // Employer fields
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

// Mock data for demo purposes
const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Abebe Kebede",
    email: "abebe@smu.edu.et",
    role: "student",
    is_approved: true,
    smu_id: "RCD/0045/2020",
    department: "Computer Science",
    gpa: 3.75,
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    bio: "Passionate software developer interested in web technologies and AI.",
    graduation_year: 2024,
  },
  {
    id: 2,
    name: "Sara Hailu",
    email: "sara@smu.edu.et",
    role: "student",
    is_approved: true,
    smu_id: "RMD/0023/2021",
    department: "Marketing",
    gpa: 3.5,
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"],
    bio: "Creative marketer with a focus on digital campaigns.",
    graduation_year: 2025,
  },
  {
    id: 3,
    name: "Dawit Tesfaye",
    email: "dawit@smu.edu.et",
    role: "student",
    is_approved: false,
    smu_id: "RAD/0012/2022",
    department: "Accounting",
    gpa: 3.8,
    skills: ["QuickBooks", "Excel", "Financial Analysis", "Taxation"],
    bio: "Detail-oriented accounting student with internship experience.",
    graduation_year: 2026,
  },
  {
    id: 4,
    name: "Hirut Berhane",
    email: "hirut@techco.com",
    role: "employer",
    is_approved: true,
    company_name: "TechCo Ethiopia",
    company_sector: "Technology",
    company_description: "Leading software development company in Addis Ababa.",
    company_website: "https://techco.et",
  },
  {
    id: 5,
    name: "Yonas Assefa",
    email: "yonas@cbe.com.et",
    role: "employer",
    is_approved: true,
    company_name: "Commercial Bank of Ethiopia",
    company_sector: "Banking & Finance",
    company_description: "The largest bank in Ethiopia with nationwide presence.",
    company_website: "https://cbe.com.et",
  },
  {
    id: 6,
    name: "Admin User",
    email: "admin@smu.edu.et",
    role: "admin",
    is_approved: true,
  },
  {
    id: 7,
    name: "Mekdes Girma",
    email: "mekdes@savechildren.org",
    role: "employer",
    is_approved: false,
    company_name: "Save the Children Ethiopia",
    company_sector: "NGO",
    company_description: "International NGO focused on children's rights and welfare.",
    company_website: "https://savethechildren.org",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("smu-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("smu-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password." };
    }

    if (!foundUser.is_approved) {
      return { success: false, error: "Your account is pending admin approval." };
    }

    // In a real app, you'd verify the password here
    // For demo, any password works
    if (password.length < 6) {
      return { success: false, error: "Invalid email or password." };
    }

    setUser(foundUser);
    localStorage.setItem("smu-user", JSON.stringify(foundUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smu-user");
  };

  const registerStudent = async (data: StudentRegistration) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    if (MOCK_USERS.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email already registered." };
    }

    // Check if SMU ID already exists
    if (MOCK_USERS.find((u) => u.smu_id === data.smu_id)) {
      return { success: false, error: "SMU ID already registered." };
    }

    // In a real app, this would create the user in the database
    return { success: true };
  };

  const registerEmployer = async (data: EmployerRegistration) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    if (MOCK_USERS.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email already registered." };
    }

    // In a real app, this would create the user in the database
    return { success: true };
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

// Export mock users for use in other components
export { MOCK_USERS };
