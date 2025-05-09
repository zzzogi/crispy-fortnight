import type { Metadata } from "next";
import "../globals.css";
import AuthProvider from "../providers/AuthProvider";
import { ReactQueryClientProvider } from "../providers/ReactQueryClientProvider";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Quản lí sản phẩm và người dùng",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="vi">
        <body>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
