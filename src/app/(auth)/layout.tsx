import type { Metadata } from "next";
import "../globals.css";
import AuthProvider from "../providers/AuthProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              Đang tải...
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
