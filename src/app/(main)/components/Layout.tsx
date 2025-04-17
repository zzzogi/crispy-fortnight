"use client";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Hiển thị nút lên đầu trang khi cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <Header />

      {/* CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <Footer />

      {/* NÚT LÊN ĐẦU TRANG */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-all"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
