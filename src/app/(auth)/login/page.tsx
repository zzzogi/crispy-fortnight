"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, isAuthenticated, status } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ← this is essential
    login(email, password, "/login").then((success) => {
      if (success) {
        router.push(redirect || "/");
      }
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 ml-8">
            <div className="flex items-center">
              <Image
                src="/icons/kim-vinh-vuong-icon.png"
                alt="Logo"
                className="w-20 h-16 mb-2"
                width={80}
                height={64}
              />
              <div className="flex flex-col items-start">
                <p className="ml-2 font-semibold text-amber-900 text-4xl">
                  Kim Vĩnh Vương
                </p>
                <p className="ml-2 text-amber-600 text-md">
                  Tinh hoa đặc sản Kinh Bắc
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-8">
            Đăng nhập
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-500 mb-1"
              >
                Tài khoản email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900"
                />
                <span className="absolute right-3 top-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-gray-500 mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full bg-amber-500 text-white py-3 rounded font-medium hover:bg-amber-600 transition duration-200 text-center cursor-pointer ${
                status === "loading" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status === "loading" ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Social Sign Up */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400">hoặc</span>
              </div>
            </div>

            {/* Social Buttons */}

            <div
              onClick={googleLogin}
              className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer mt-4"
            >
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              <span className="ml-2 text-gray-700">Đăng nhập với Google</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link
                href={`${redirect ? `/register${redirect}` : "/register"}`}
                className="text-amber-500 hover:text-amber-600 font-medium"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative Image */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500">
        <div className="h-full w-full relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-full h-full bg-white opacity-10"></div>
            <div className="absolute w-96 h-96 rounded-full bg-white/20 -top-20 -right-20 blur-xl"></div>
            <div className="absolute w-80 h-80 rounded-full bg-amber-200/50 bottom-40 -left-20 blur-lg"></div>
            <div className="absolute w-60 h-60 rounded-full bg-white/30 bottom-10 right-10 blur-xl"></div>
            <div className="absolute w-40 h-40 rounded-full bg-amber-400/40 top-40 left-40 blur-md"></div>

            {/* Floating bubbles */}
            <div className="absolute w-6 h-6 rounded-full bg-white/80 top-1/4 left-1/3"></div>
            <div className="absolute w-10 h-10 rounded-full bg-white/60 top-1/2 left-2/3"></div>
            <div className="absolute w-4 h-4 rounded-full bg-white/70 top-3/4 left-1/4"></div>
            <div className="absolute w-8 h-8 rounded-full bg-white/50 top-1/3 right-1/4"></div>
            <div className="absolute w-5 h-5 rounded-full bg-white/60 bottom-1/4 right-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
