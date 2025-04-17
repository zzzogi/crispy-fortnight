"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

// Define the user type based on JWT payload
type AdminUser = {
  userId: string;
  name: string;
  email: string;
  role: string;
};

// Context type
type AdminContextType = {
  user: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

// Create the context with default values
const AdminContext = createContext<AdminContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  refreshUserData: async () => {},
});

// Hook for using the context
export const useAdminContext = () => useContext(AdminContext);

// Provider component
export function AdminProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AdminUser | null;
}) {
  const [user, setUser] = useState<AdminUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data on mount if not provided
  useEffect(() => {
    if (!initialUser) {
      refreshUserData();
    }
  }, [initialUser]);

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      if (pathname === "/admin/login") return; // Don't fetch user data on login page

      setIsLoading(true);
      const { data } = await axios.get("/api/auth/me");
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AdminContext.Provider value={{ user, isLoading, logout, refreshUserData }}>
      {children}
    </AdminContext.Provider>
  );
}
