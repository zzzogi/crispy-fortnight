// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, status } = useAuth();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Cập nhật thất bại",
        });
        return;
      }

      setMessage({ type: "success", text: "Cập nhật thông tin thành công" });
      // Force refresh session
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới không khớp" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 8 ký tự" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.message || "Đổi mật khẩu thất bại",
        });
        return;
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage({ type: "success", text: "Đổi mật khẩu thành công" });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
      <h1 className="mb-6 text-2xl font-bold text-amber-700 max-w-4xl mx-auto">
        Thông tin tài khoản
      </h1>

      {message && (
        <div
          className={`mb-4 rounded p-3 max-w-4xl mx-auto ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Basic Info */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Thông tin cơ bản
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                className="mt-1 w-full rounded-md border bg-gray-50 p-2 text-gray-300"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                Email không thể thay đổi
              </p>
            </div>

            <button
              type="submit"
              className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:bg-amber-300"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Cập nhật thông tin"}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Đổi mật khẩu
          </h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu hiện tại
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 text-gray-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 text-gray-500"
                required
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 text-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:bg-amber-300"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Thông tin tài khoản
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Vai trò</span>
              <span className="font-medium text-gray-500">
                {user?.role && "Người dùng"}
              </span>
            </div>

            {/* You can add more account info here */}
          </div>
        </div>
      </div>
    </div>
  );
}
