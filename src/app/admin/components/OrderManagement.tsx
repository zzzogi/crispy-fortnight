"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Filter,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Types
type OrderStatus = "pending" | "paid" | "shipping" | "done" | "cancelled";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description?: string;
  imageUrl: string[];
  category: string;
  type: string;
  createdAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  orderId: string;
}

interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  limit?: number;
  offset?: number;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const { data, isLoading, isError } = useQuery<OrdersResponse>({
    queryKey: ["orders", search, filterStatus, limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus) params.append("status", filterStatus);
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());

      const { data } = await axios.get(`/api/orders?${params.toString()}`);
      return data;
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data } = await axios.patch("/api/orders", { id, status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrder(null);
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete("/api/orders", { data: { id } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrder(null);
    },
  });

  // Handle pagination
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOffset((page - 1) * limit);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-purple-100 text-purple-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Quản lí đơn hàng
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Tìm kiếm theo tên, email, địa chỉ, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as OrderStatus | "")
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="paid">Đã thanh toán</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="done">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setSearch("");
              setFilterStatus("");
            }}
            aria-label="Clear filters"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["orders"] })
            }
            aria-label="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    Đã xảy ra lỗi khi tải dữ liệu
                  </td>
                </tr>
              ) : data?.orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                data?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id.substring(order.id.length - 8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.buyerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.buyerAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.buyerEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.buyerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.totalPrice.toLocaleString("vi-VN")}đ
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.totalItems} sản phẩm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          order.status as OrderStatus
                        )}`}
                      >
                        {order.status === "pending" && "Chờ xác nhận"}
                        {order.status === "paid" && "Đã thanh toán"}
                        {order.status === "shipping" && "Đang giao hàng"}
                        {order.status === "done" && "Hoàn thành"}
                        {order.status === "cancelled" && "Đã hủy"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => {
                          setSelectedOrder(order);
                        }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Hiển thị
                <select
                  className="mx-1 border-none bg-transparent"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setOffset(0);
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                trên tổng số {data?.total} đơn hàng
              </span>
            </div>

            <div className="flex items-center">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>

              <div className="mx-2">
                <span className="text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
              </div>

              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedOrder(null)}
          ></div>
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Chi tiết đơn hàng
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Mã đơn hàng
                  </h4>
                  <p className="text-blue-500">{selectedOrder.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Ngày đặt
                  </h4>
                  <p className="text-blue-500">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Khách hàng
                  </h4>
                  <p className="text-blue-500">{selectedOrder.buyerName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-blue-500">{selectedOrder.buyerEmail}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Số điện thoại
                  </h4>
                  <p className="text-blue-500">{selectedOrder.buyerPhone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Địa chỉ</h4>
                  <p className="text-blue-500">{selectedOrder.buyerAddress}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Tổng thanh toán
                  </h4>
                  <p className="font-medium text-blue-500">
                    {selectedOrder.totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </h4>
                  <div className="mt-1">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          status: e.target.value as OrderStatus,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="done">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Sản phẩm ({selectedOrder.totalItems})
                </h4>

                <div className="border rounded-md divide-y">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                          {item.product &&
                          item.product.imageUrl &&
                          item.product.imageUrl.length > 0 ? (
                            <Image
                              src={item.product.imageUrl[0]}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                              width={64}
                              height={64}
                            />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {item.product
                              ? item.product.name
                              : "Sản phẩm không tồn tại"}
                          </div>
                          {item.product && (
                            <>
                              <div className="text-sm text-gray-500">
                                Danh mục: {item.product.category} | Loại:{" "}
                                {item.product.type === "RETAIL"
                                  ? "Bán lẻ"
                                  : "Quà tặng"}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {item.product.description &&
                                item.product.description.length > 60
                                  ? `${item.product.description.substring(
                                      0,
                                      60
                                    )}...`
                                  : item.product.description}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex-shrink-0 ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product
                              ? `${item.product.price.toLocaleString("vi-VN")}đ`
                              : "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            SL: {item.quantity}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {item.product
                              ? `${(
                                  item.product.price * item.quantity
                                ).toLocaleString("vi-VN")}đ`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Không có sản phẩm nào trong đơn hàng này
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                  onClick={() => {
                    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
                      deleteOrderMutation.mutate(selectedOrder.id);
                    }
                  }}
                  disabled={deleteOrderMutation.isPending}
                >
                  {deleteOrderMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Xóa đơn hàng
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() =>
                    updateStatusMutation.mutate({
                      id: selectedOrder.id,
                      status: selectedOrder.status as OrderStatus,
                    })
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </span>
                  ) : (
                    "Cập nhật trạng thái"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
