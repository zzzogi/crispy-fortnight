// hooks/useRegister.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  redirect?: string;
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const register = async ({
    name,
    email,
    password,
    redirect,
  }: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đăng ký thất bại");
        setIsLoading(false);
        return false;
      }

      setSuccess("Đăng ký thành công! Đang đăng nhập...");

      // Automatically sign in the user after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.");
        router.push(`/login?redirect=${redirect}` || "/login");
        return false;
      }

      // Refresh and redirect to dashboard (or user-appropriate page)
      router.refresh();
      router.push(redirect || "/");
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    success,
  };
};
