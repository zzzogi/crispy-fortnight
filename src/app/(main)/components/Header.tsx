"use client";
import { useCategoryContext } from "@/app/context/CategoryContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaFacebookF,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";

import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import CartDropdown from "./CartDropdown";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setSlug } = useCategoryContext();
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { logout } = useAuth();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsMobileProductsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
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

  const menuItems1 = [
    { path: "/", label: "TRANG CHỦ" },
    { path: "/about", label: "GIỚI THIỆU" },
  ];

  const menuItems2 = [
    { path: "/gifts", label: "QUÀ TẶNG" },
    { path: "/contact", label: "LIÊN HỆ" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsProductsDropdownOpen(false);
  };

  const handleCategoryClick = (categorySlug = "") => {
    setSlug(categorySlug);
    router.push("/products");
    setIsProductsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMobileProducts = () => {
    setIsMobileProductsOpen(!isMobileProductsOpen);
  };

  return (
    <>
      {/* HEADER - thiết kế tối giản */}
      <header className="bg-amber-900 text-amber-50 px-6 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <FaPhone className="mr-2 text-amber-200" />
          <span className="text-sm font-medium">Hotline: 0935 388 699</span>
        </div>
        <div className="flex space-x-4 items-center">
          {session?.user.role === "admin" && (
            <p
              className="cursor-pointer hover:text-amber-200 transition duration-300 text-sm font-medium"
              onClick={() => router.push("/admin")}
            >
              Admin console
            </p>
          )}
          {session?.user ? (
            <div className="relative">
              <button
                className="text-white cursor-pointer"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
              >
                <IoPersonSharp className="h-4 w-4" />
              </button>

              {/* User dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-9999">
                  <div className="py-1">
                    <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                      <span className="font-medium">
                        Xin chào, {session.user.name}
                      </span>
                      <Image
                        src={session.user.image || "/gif/greeting.gif"}
                        alt="funny gif"
                        className="ml-2 h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        router.push("/profile");
                      }}
                    >
                      <IoPersonSharp className="h-4 w-4 mr-2" />
                      <span>Trang cá nhân</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        router.push("/my-orders");
                      }}
                    >
                      <TiShoppingCart className="h-4 w-4 mr-2" />
                      <span>Đơn hàng</span>
                    </button>
                    <div className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <span
                        className="flex items-center cursor-pointer"
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                          router.push("/");
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Đăng xuất</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-2 items-center">
              <p
                className="text-sm font-medium cursor-pointer hover:text-amber-200 transition duration-300"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </p>
              <p>/</p>
              <p
                className="text-sm font-medium cursor-pointer hover:text-amber-200 transition duration-300"
                onClick={() => router.push("/register")}
              >
                Đăng ký
              </p>
            </div>
          )}

          <FaFacebookF
            className="cursor-pointer hover:text-amber-200 transition duration-300"
            onClick={() =>
              window.open("https://www.facebook.com/tinhhoachelam", "_blank")
            }
          />
          <div className="relative">
            <CartDropdown />
          </div>
        </div>
      </header>

      {/* NAVIGATION - thiết kế tối giản, thanh lịch */}
      <nav className="border-b border-amber-200 bg-white shadow-sm relative z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo với phong cách tối giản */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <Image
              src="/icons/kim-vinh-vuong-icon.png"
              alt="Logo"
              className="h-12 w-14"
              width={56}
              height={48}
            />

            <div className="flex flex-col">
              <h1
                className="text-3xl md:text-4xl font-bold text-amber-900 tracking-wide cursor-pointer"
                onClick={() => handleNavigation("/")}
              >
                KIM VĨNH VƯƠNG
              </h1>
              <span className="text-xs md:text-sm text-amber-700 italic">
                Tinh hoa đặc sản Kinh Bắc
              </span>
            </div>
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
            {menuItems1.map((item) => (
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

            {/* Products dropdown */}
            <li className="relative">
              <div
                className={`px-3 py-2 cursor-pointer transition duration-300 flex items-center ${
                  pathname.startsWith("/products")
                    ? "text-amber-900 border-b-2 border-amber-900"
                    : "text-gray-600 hover:text-amber-700"
                }`}
                onClick={() =>
                  setIsProductsDropdownOpen(!isProductsDropdownOpen)
                }
              >
                SẢN PHẨM
                <FaChevronDown className="ml-1 text-xs" />
              </div>

              {isProductsDropdownOpen && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-max z-30">
                  <div
                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-gray-600 hover:text-amber-800"
                    onClick={() => handleCategoryClick("")}
                  >
                    Tất cả sản phẩm
                  </div>
                  {isLoading ? (
                    <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                  ) : (
                    categories.map(
                      (category: {
                        id: string;
                        name: string;
                        label: string;
                      }) => (
                        <div
                          key={category.id}
                          className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-gray-600 hover:text-amber-800"
                          onClick={() => handleCategoryClick(category.label)}
                        >
                          {category.name}
                        </div>
                      )
                    )
                  )}
                </div>
              )}
            </li>

            {menuItems2.map((item) => (
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
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform z-50 overflow-y-auto">
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
                {menuItems1.map((item) => (
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

                {/* Products submenu for mobile */}
                <li className="mb-4">
                  <div
                    className={`flex justify-between items-center px-4 py-2 rounded-md ${
                      pathname.startsWith("/products")
                        ? "bg-amber-100 text-amber-900 font-medium"
                        : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                    }`}
                    onClick={toggleMobileProducts}
                  >
                    <span>SẢN PHẨM</span>
                    {isMobileProductsOpen ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </div>
                  {isMobileProductsOpen && (
                    <div className="pl-4 mt-2 border-l-2 border-amber-100">
                      <div
                        className="block px-4 py-2 mt-2 rounded-md text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                        onClick={() => handleCategoryClick("")}
                      >
                        Tất cả sản phẩm
                      </div>
                      {isLoading ? (
                        <div className="px-4 py-2 text-gray-500">
                          Đang tải...
                        </div>
                      ) : (
                        categories.map(
                          (category: {
                            id: string;
                            name: string;
                            label: string;
                          }) => (
                            <div
                              key={category.id}
                              className="block px-4 py-2 mt-1 rounded-md text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                              onClick={() =>
                                handleCategoryClick(category.label)
                              }
                            >
                              {category.name}
                            </div>
                          )
                        )
                      )}
                    </div>
                  )}
                </li>

                {menuItems2.map((item) => (
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
