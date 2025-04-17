"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import axios from "axios";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post("/api/auth/logout");
      router.push("/admin/login");
      router.refresh(); // Refresh the page to update auth state
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
    </button>
  );
}
