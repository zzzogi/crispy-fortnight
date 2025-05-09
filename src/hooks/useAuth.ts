"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, slug: string) => {
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        slug,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
        return false;
      }

      // Refresh the session
      router.refresh();
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau");
      return false;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const googleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const isAdmin = session?.user?.role === "admin";
  const isStaff = session?.user?.role === "staff";
  const isAuthenticated = status === "authenticated";
  const isAdminOrStaff = isAdmin || isStaff;

  return {
    session,
    status,
    login,
    logout,
    googleLogin,
    error,
    isAdmin,
    isStaff,
    isAuthenticated,
    isAdminOrStaff,
    user: session?.user,
  };
};
