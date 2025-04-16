"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Search, RefreshCw, X, Eye, X as XIcon } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ContactsResponse {
  contacts: Contact[];
  total: number;
  limit?: number;
  offset?: number;
}

const ContactPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply debounce to search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0); // Reset pagination when searching
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Modal handlers
  const openModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ""; // Restore scrolling
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Query contacts
  const { data, isLoading, isError, error, refetch } =
    useQuery<ContactsResponse>({
      queryKey: ["contacts", debouncedSearch, limit, offset],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (limit) params.append("limit", limit.toString());
        if (offset) params.append("offset", offset.toString());

        const response = await fetch(`/api/contact?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        return response.json();
      },
    });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  // Handle delete contact
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (data && data.contacts.length === limit) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    setOffset(Math.max(0, offset - limit));
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Tin nhắn</h1>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value={5}>5 tin nhắn</option>
            <option value={10}>10 tin nhắn</option>
            <option value={25}>25 tin nhắn</option>
            <option value={50}>50 tin nhắn</option>
          </select>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Lỗi khi tải tin nhắn: {(error as Error).message}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && data && (
        <>
          {/* Contact list */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            {data.contacts.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                <p className="text-xl font-medium">
                  Không tìm thấy tin nhắn nào
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chủ đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày gửi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lựa chọn
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {contact.name}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500">
                            {contact.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openModal(contact)}
                            className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                            disabled={deleteMutation.isPending}
                            title="Xoá tin nhắn"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Contact Detail Modal */}
          {isModalOpen && selectedContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center border-b p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chi tiết tin nhắn
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <XIcon size={24} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{selectedContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedContact.email}</p>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Số điện thoại
                        </p>
                        <p className="text-gray-900">{selectedContact.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-gray-900">
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">
                        Chủ đề
                      </p>
                      <p className="text-gray-900">{selectedContact.subject}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">
                        Lời nhắn
                      </p>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-900">
                        {selectedContact.message}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="mr-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={deleteMutation.isPending}
                  >
                    Xoá
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Hiển thị {offset + 1} -{" "}
              {Math.min(offset + data.contacts.length, data.total)} trong{" "}
              {data.total} kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={
                  data.contacts.length < limit ||
                  offset + data.contacts.length >= data.total
                }
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactPage;
