"use client";

// pages/admin/index.tsx
import { useState } from "react";
import Head from "next/head";
import {
  Menu,
  X,
  ChevronDown,
  Package,
  Gift,
  Users,
  MessageSquare,
  User,
  Package2Icon,
  FileCheck,
} from "lucide-react";
import ProductsManagement from "./components/ProductManagement";
import GiftsManagement from "./components/GiftManagement";

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function AdminPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: "products",
      title: "Quản lí sản phẩm",
      icon: <Package className="h-5 w-5" />,
      content: <ProductsManagement />,
    },
    {
      id: "gifts",
      title: "Quản lí quà tặng",
      icon: <Gift className="h-5 w-5" />,
      content: <GiftsManagement />,
    },
    {
      id: "users",
      title: "Quản lí người dùng",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Quản lí người dùng
          </h2>
          <p className="text-gray-700">
            Nội dung quản lí người dùng sẽ xuất hiện ở đây.
          </p>
        </div>
      ),
    },
    {
      id: "categories",
      title: "Quản lí danh mục",
      icon: <Package2Icon className="h-5 w-5" />,
      content: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Quản lí danh mục
          </h2>
          <p className="text-gray-700">
            Nội dung quản lí danh mục sẽ xuất hiện ở đây.
          </p>
        </div>
      ),
    },
    {
      id: "orders",
      title: "Quản lí đơn hàng",
      icon: <FileCheck className="h-5 w-5" />,
      content: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Quản lí đơn hàng
          </h2>
          <p className="text-gray-700">
            Nội dung quản lí đơn hàng sẽ xuất hiện ở đây.
          </p>
        </div>
      ),
    },

    {
      id: "messages",
      title: "Tin nhắn",
      icon: <MessageSquare className="h-5 w-5" />,
      content: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tin nhắn</h2>
          <p className="text-gray-700">Nội dung tin nhắn sẽ xuất hiện ở đây.</p>
        </div>
      ),
    },
  ];

  const activeContent = sidebarItems.find(
    (item) => item.id === activeTab
  )?.content;
  const username = "Admin User";

  return (
    <>
      <Head>
        <title>Admin Console</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`bg-white border-r transition-all duration-300 flex flex-col ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 border-b px-4">
            {!isCollapsed && (
              <span className="text-lg font-bold text-blue-700">
                Admin Console
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5 text-gray-700" />
              ) : (
                <X className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Sidebar Items */}
          <div className="flex-1 py-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-3 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={
                      activeTab === item.id ? "text-blue-700" : "text-gray-600"
                    }
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="ml-3">{item.title}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b h-16 flex items-center justify-end px-6">
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none text-gray-700 hover:text-gray-900"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">{username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* User dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-medium"
                    >
                      Đăng xuất
                    </a>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {activeContent}
          </main>
        </div>
      </div>
    </>
  );
}
