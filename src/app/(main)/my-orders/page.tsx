// app/don-hang-cua-toi/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types based on your Prisma schema
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string[];
  description?: string;
  label: string;
  type: "RETAIL" | "GIFT";
};

type OrderItem = {
  id: string;
  quantity: number;
  product: Product;
};

type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  totalItems: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function MyOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch orders using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["userOrders", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return { orders: [] };
      const response = await fetch(`/api/user-orders/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
    enabled: !!session?.user?.id && status === "authenticated",
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/orders`, {
        method: "PATCH",
        body: JSON.stringify({
          id,
          status: "cancelled",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel order");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch orders after successful cancellation
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      setShowConfirmModal(false);
      setCancellingOrderId(null);
    },
    onError: (error) => {
      console.error("Error cancelling order:", error);
      alert(
        `Không thể hủy đơn hàng: ${
          error instanceof Error ? error.message : "Đã xảy ra lỗi"
        }`
      );
      setShowConfirmModal(false);
      setCancellingOrderId(null);
    },
  });

  // Handle cancel button click
  const handleCancelOrder = (orderId: string) => {
    setCancellingOrderId(orderId);
    setShowConfirmModal(true);
  };

  // Confirm cancellation
  const confirmCancelOrder = () => {
    if (cancellingOrderId) {
      cancelOrderMutation.mutate(cancellingOrderId);
    }
  };

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/dang-nhap");
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (status: string) => {
    return (
      status !== "shipped" && status !== "delivered" && status !== "cancelled"
    );
  };

  if (isLoading || status === "loading") {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-brown-800">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600">
            Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <h1 className="text-3xl font-bold text-brown-800 mb-8 text-center text-amber-900">
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg">
          <p className="text-lg text-gray-600 mb-6">Bạn chưa có đơn hàng nào</p>
          <Link
            href="/products"
            className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-300 "
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
            >
              <div className="bg-brown-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-3">
                    <p className="text-gray-500">
                      Mã đơn hàng:{" "}
                      <span className="font-medium text-brown-700">
                        {order.id}
                      </span>
                    </p>
                    <span className="text-gray-300">|</span>
                    <p className="text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-600">
                    Người nhận:{" "}
                    <span className="font-medium">{order.buyerName}</span> |{" "}
                    {order.buyerPhone}
                  </p>
                  <p className="mt-1 text-gray-600">
                    Ước tính ngày nhận:{" "}
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      {" - "}
                      {new Date(
                        new Date(order.createdAt).getTime() +
                          7 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>

                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      disabled={
                        cancelOrderMutation.isPending &&
                        cancellingOrderId === order.id
                      }
                    >
                      {cancelOrderMutation.isPending &&
                      cancellingOrderId === order.id
                        ? "Đang hủy..."
                        : "Hủy đơn hàng"}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.product.imageUrl &&
                      item.product.imageUrl.length > 0 ? (
                        <Image
                          src={item.product.imageUrl[0]}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        SL: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-medium text-gray-700 ">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brown-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      Tổng số lượng:{" "}
                      <span className="font-medium">{order.totalItems}</span>{" "}
                      sản phẩm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      Tổng tiền:
                      <span className="ml-1 text-xl font-bold text-brown-700">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalPrice)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận hủy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể
              hoàn tác.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={cancelOrderMutation.isPending}
              >
                Không
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
