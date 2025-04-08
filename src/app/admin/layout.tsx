import { ReactQueryClientProvider } from "../providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Quản lí sản phẩm và người dùng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="vi">
        <body>{children}</body>
      </html>
    </ReactQueryClientProvider>
  );
}
