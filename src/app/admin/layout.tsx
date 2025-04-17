import type { Metadata } from "next";
import "../globals.css";
import { ReactQueryClientProvider } from "../providers/ReactQueryClientProvider";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AdminProvider } from "@/app/context/AdminContext";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Quản lí sản phẩm và người dùng",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let initialUser = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET!
      );
      const { payload } = await jwtVerify(token, secret);
      initialUser = {
        userId: payload.userId as string,
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as string,
      };
    } catch (error) {
      console.error("JWT verification failed:", error);
      initialUser = null; // Set to null if verification fails
    }
  }
  return (
    <ReactQueryClientProvider>
      <AdminProvider initialUser={initialUser}>
        <html lang="vi">
          <body>{children}</body>
        </html>
      </AdminProvider>
    </ReactQueryClientProvider>
  );
}
