"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaShoppingCart,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Đóng menu khi thay đổi đường dẫn
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Ngăn cuộn trang khi menu mobile đang mở
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { path: "/", label: "TRANG CHỦ" },
    { path: "/about", label: "GIỚI THIỆU" },
    { path: "/products", label: "SẢN PHẨM" },
    { path: "/gifts", label: "QUÀ TẶNG" },
    { path: "/contact", label: "LIÊN HỆ" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* HEADER - thiết kế tối giản */}
      <header className="bg-amber-900 text-amber-50 px-6 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <FaPhone className="mr-2 text-amber-200" />
          <span className="text-sm font-medium">Hotline: 090 456 6260</span>
        </div>
        <div className="flex space-x-4">
          <FaFacebookF className="cursor-pointer hover:text-amber-200 transition duration-300" />
          <FaInstagram className="cursor-pointer hover:text-amber-200 transition duration-300" />
          <div className="relative">
            <FaShoppingCart className="cursor-pointer hover:text-amber-200 transition duration-300" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </header>

      {/* NAVIGATION - thiết kế tối giản, thanh lịch */}
      <nav className="border-b border-amber-200 bg-white shadow-sm relative z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo với phong cách tối giản */}
          <div className="flex items-center">
            <h1
              className="text-3xl md:text-4xl font-bold text-amber-900 tracking-wide cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              DÃ VỊ
            </h1>
            <span className="ml-2 text-xs md:text-sm text-amber-700 italic border-l border-amber-300 pl-2">
              Hương vị truyền thống
            </span>
          </div>

          {/* Nút hamburger cho mobile */}
          <button
            className="md:hidden text-amber-900 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>

          {/* Menu chính - desktop - active dựa trên đường dẫn hiện tại */}
          <ul className="hidden md:flex space-x-1 text-base font-medium">
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={`px-3 py-2 cursor-pointer transition duration-300 ${
                  isActive(item.path)
                    ? "text-amber-900 border-b-2 border-amber-900"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40">
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform z-50">
              <div className="p-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-amber-900">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 focus:outline-none"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <ul className="p-4">
                {menuItems.map((item) => (
                  <li key={item.path} className="mb-4">
                    <a
                      className={`block px-4 py-2 rounded-md ${
                        isActive(item.path)
                          ? "bg-amber-100 text-amber-900 font-medium"
                          : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
