import type { Metadata } from "next";
import "../globals.css";
import Layout from "./components/Layout";
import { ReactQueryClientProvider } from "../providers/ReactQueryClientProvider";
import { CartProvider } from "../context/CartContext";
import { CategoryProvider } from "../context/CategoryContext";
import AuthProvider from "../providers/AuthProvider";

export const metadata: Metadata = {
  title: "Thực phẩm Kim Vĩnh Vương",
  description: "Trang web giới thiệu sản phẩm của Thực phẩm Kim Vĩnh Vương",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <CategoryProvider initialSlug={""}>
        <CartProvider>
          <html lang="vi">
            <body>
              <AuthProvider>
                <Layout>{children}</Layout>
              </AuthProvider>
            </body>
          </html>
        </CartProvider>
      </CategoryProvider>
    </ReactQueryClientProvider>
  );
}
