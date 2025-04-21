"use client";

import { useAdminContext } from "@/app/context/AdminContext";
import {
  BoxIcon,
  ChevronDown,
  FileCheck,
  Gift,
  Menu,
  MessageSquare,
  Package,
  Undo2,
  User,
  Users,
  X,
} from "lucide-react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useState } from "react";
import ContactManagement from "./components/ContactManagement";
import GiftsManagement from "./components/GiftManagement";
import LogoutButton from "./components/LogoutButton";
import OrderManagement from "./components/OrderManagement";
import ProductsManagement from "./components/ProductManagement";
import UserManagement from "./components/UserManagement";
import CategoryManagement from "./components/CategoryManagement";

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
  const { user, isLoading } = useAdminContext();

  if (isLoading || !user) {
    return null; // Don't render navbar while loading or if user not authenticated
  }

  const username = user.name || user.email || "Admin";

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
      content: <UserManagement />,
    },
    {
      id: "orders",
      title: "Quản lí đơn hàng",
      icon: <FileCheck className="h-5 w-5" />,
      content: <OrderManagement />,
    },
    {
      id: "catergories",
      title: "Quản lí danh mục",
      icon: <BoxIcon className="h-5 w-5" />,
      content: <CategoryManagement />,
    },
    {
      id: "messages",
      title: "Tin nhắn",
      icon: <MessageSquare className="h-5 w-5" />,
      content: <ContactManagement />,
    },
  ];

  const activeContent = sidebarItems.find(
    (item) => item.id === activeTab
  )?.content;

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
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        redirect("/");
                      }}
                    >
                      <Undo2 className="h-4 w-4 mr-2" />
                      <span>Trở về trang chủ</span>
                    </button>
                    <div className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogoutButton />
                    </div>
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
