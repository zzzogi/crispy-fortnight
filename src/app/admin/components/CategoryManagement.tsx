/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  label: string;
}

function slugify(str: string) {
  return str
    .toLowerCase() // lowercase
    .normalize("NFD") // normalize accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim() // trim whitespace
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // replace multiple dashes with single dash
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({ name: "", label: "" });

  // Fetch categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json() as Promise<Category[]>;
    },
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: { name: string; label: string }) => {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; label: string };
    }) => {
      const response = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/category/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  useEffect(() => {
    setFormData({ ...formData, label: slugify(formData.name) });
  }, [formData.name.length]);

  // Reset form and close modal
  const resetForm = () => {
    setFormData({ name: "", label: "" });
    setIsEditingCategory(null);
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingCategory) {
      updateCategoryMutation.mutate({
        id: isEditingCategory,
        data: formData,
      });
    } else {
      addCategoryMutation.mutate(formData);
    }
  };

  // Start editing a category
  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, label: category.label });
    setIsEditingCategory(category.id);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAddNew = () => {
    setFormData({ name: "", label: "" });
    setIsEditingCategory(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">Error: {(error as Error).message}</div>
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          Quản lí danh mục
        </h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {isEditingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="label"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhãn (slug)
                </label>
                <input
                  type="text"
                  id="label"
                  value={formData.label}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-500"
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={
                    addCategoryMutation.isPending ||
                    updateCategoryMutation.isPending
                  }
                >
                  {addCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                    ? "Đang xử lý..."
                    : isEditingCategory
                    ? "Cập nhật"
                    : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên danh mục
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nhãn (slug)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Bạn có chắc chắn muốn xóa danh mục này?"
                            )
                          ) {
                            deleteCategoryMutation.mutate(category.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có danh mục nào. Hãy thêm danh mục mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
