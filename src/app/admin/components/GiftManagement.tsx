/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader, Plus, Search, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Gift {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  label: string;
  type: "RETAIL" | "GIFT";
  categoryId: string;
  category?: {
    id: string;
    name: string;
    label: string;
  };
}

interface GiftsResponse {
  products: Gift[];
  total: number;
  limit: number;
  offset: number;
}

interface UploadedImage {
  file: File;
  preview: string;
}

interface ICategory {
  id: string;
  name: string;
  label: string;
}

const ITEMS_PER_PAGE = 8;

const GiftsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [newGift, setNewGift] = useState<Omit<Gift, "id">>({
    name: "",
    price: 0,
    available: true,
    description: "",
    imageUrl: [],
    label: "",
    type: "GIFT",
    categoryId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Image Upload States
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup image previews when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);

  // API Calls with @tanstack/react-query
  const fetchGifts = async ({ queryKey }: any) => {
    const [_, page, limit, search] = queryKey;
    const offset = (page - 1) * limit;
    const response = await fetch(
      `/api/products?type=GIFT&limit=${limit}&offset=${offset}&search=${search}`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    return response.json();
  };

  const fetchCategories = async () => {
    const response = await fetch("/api/category");

    if (!response.ok) throw new Error("Network response was not ok");

    return response.json();
  };

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    setNewGift({
      ...newGift,
      categoryId: categories[0]?.id || "",
      label: "Mới",
    });
  }, [categories?.length]);

  const { data, isLoading, error } = useQuery<GiftsResponse>({
    queryKey: ["gifts", currentPage, ITEMS_PER_PAGE, searchTerm],
    queryFn: fetchGifts,
  });

  const uploadToS3Mutation = useMutation({
    mutationFn: async (giftName: string) => {
      if (uploadedImages.length === 0) return null;

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("productName", giftName);

      uploadedImages.forEach((image) => {
        formData.append(`images`, image.file);
      });

      const response = await fetch(`/api/products/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading images");
      }

      setIsUploading(false);
      const data = await response.json();
      return {
        imageUrl: data.allImages,
      };
    },
  });

  const addGiftMutation = useMutation({
    mutationFn: async (gift: Omit<Gift, "id">) => {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      if (!response.ok) throw new Error("Error adding gift");
      return response.json();
    },
    onSuccess: (data) => {
      // If we have images to upload, do that now using the returned gift ID
      if (uploadedImages.length > 0) {
        uploadToS3Mutation.mutate(data.name, {
          onSuccess: (imageUrl) => {
            // Update the gift with the new image URL
            if (imageUrl) {
              updateGiftMutation.mutate({
                id: data.id,
                ...newGift,
                imageUrl: imageUrl.imageUrl,
              });
            }
            finishGiftOperation();
          },
          onError: (error) => {
            console.error("Failed to upload images:", error);
            // Still finish the operation, but gift will not have images
            finishGiftOperation();
          },
        });
      } else {
        finishGiftOperation();
      }
    },
  });

  const updateGiftMutation = useMutation({
    mutationFn: async (gift: Gift) => {
      const response = await fetch(`/api/products`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      if (!response.ok) throw new Error("Error updating gift");
      return response.json();
    },
    onSuccess: (data) => {
      // If we have images to upload, do that now - this will replace existing images
      if (uploadedImages.length > 0) {
        uploadToS3Mutation.mutate(data.name, {
          onSuccess: (imageUrl) => {
            // Update the gift with the new image URL if necessary
            if (imageUrl && imageUrl !== data.imageUrl) {
              updateGiftMutation.mutate({
                ...data,
                imageUrl: imageUrl.imageUrl,
              });
            }
            finishGiftOperation();
          },
          onError: (error) => {
            console.error("Failed to upload images:", error);
            finishGiftOperation();
          },
        });
      } else {
        finishGiftOperation();
      }
    },
  });

  const deleteGiftMutation = useMutation({
    mutationFn: async (obj: { id: string; name: string }) => {
      // First delete S3 images
      await fetch(`/api/products/upload?productName=${obj.name}`, {
        method: "DELETE",
      });

      // Then delete the gift from database
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: obj.id }),
      });

      if (!response.ok) throw new Error("Error deleting gift");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      setShowDetailModal(false);
    },
  });

  const finishGiftOperation = () => {
    queryClient.invalidateQueries({ queryKey: ["gifts"] });
    setShowAddModal(false);
    setUploadedImages([]);
    resetForm();
    setIsEditing(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const openAddModal = () => {
    setIsEditing(false);
    setUploadedImages([]);
    setShowAddModal(true);
  };

  const openEditModal = (gift: Gift) => {
    setIsEditing(true);
    setNewGift({
      name: gift.name,
      price: gift.price,
      available: gift.available,
      description: gift.description,
      imageUrl: gift.imageUrl,
      category: gift.category,
      type: "GIFT",
      label: gift.label,
      categoryId: gift.categoryId,
    });
    setCurrentGift(gift);
    setUploadedImages([]);
    setShowAddModal(true);
  };

  const openDetailModal = (gift: Gift) => {
    setCurrentGift(gift);
    setShowDetailModal(true);
  };

  const handleAddOrUpdateGift = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && currentGift) {
      updateGiftMutation.mutate({
        id: currentGift.id,
        ...newGift,
      });
    } else {
      addGiftMutation.mutate(newGift);
    }
  };

  const handleDeleteGift = () => {
    if (currentGift) {
      if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteGiftMutation.mutate({
          id: currentGift.id,
          name: currentGift.name,
        });
      }
    }
  };

  const resetForm = () => {
    setNewGift({
      name: "",
      price: 0,
      available: true,
      description: "",
      imageUrl: [],
      label: "",
      type: "GIFT",
      categoryId: "",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create preview URLs for each file
    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);

      // Remove the image at the specified index
      return prev.filter((_, i) => i !== index);
    });
  };

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý quà tặng
      </h2>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex w-1/2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tìm kiếm
          </button>
        </form>

        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <Plus size={18} className="mr-1" />
          Thêm mới sản phẩm
        </button>
      </div>

      {/* Gifts Grid */}
      {isLoading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Đã xảy ra lỗi: {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.products ? (
              data.products.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openDetailModal(gift)}
                >
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={gift.imageUrl[0] || "/images/placeholder.jpg"}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800">
                      {gift.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {gift.price.toLocaleString("vi-VN")} đ
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          gift.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {gift.available ? "Còn hàng" : "Hết hàng"}
                      </span>
                      <span className="text-sm text-gray-600 rounded-full bg-gray-100 px-2 py-1">
                        {gift.label}
                      </span>
                      <span className="text-sm text-gray-600 rounded-full bg-gray-100 px-2 py-1">
                        {gift?.category?.name || "Không có danh mục"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                Không tìm thấy sản phẩm nào 🥲
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                >
                  &lt;
                </button>

                {totalPages &&
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                >
                  &gt;
                </button>
              </nav>
            </div>
          ) : null}
        </>
      )}

      {/* Add/Edit Gift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddOrUpdateGift}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    value={newGift.name}
                    onChange={(e) =>
                      setNewGift({ ...newGift, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    value={newGift.price}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setNewGift({ ...newGift, price: 0 });
                      } else {
                        setNewGift({
                          ...newGift,
                          price: parseFloat(e.target.value),
                        });
                      }
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh
                  </label>

                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                    <div className="flex flex-wrap gap-4 mb-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                            width={100}
                            height={100}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      <div
                        className="w-24 h-24 border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          Upload
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Click để chọn một hoặc nhiều hình ảnh (định dạng: JPG,
                      PNG, GIF)
                    </p>
                  </div>

                  {isUploading && (
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <Loader
                          size={16}
                          className="animate-spin mr-2 text-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          Đang tải ảnh lên ({uploadProgress}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="giftType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Loại sản phẩm
                  </label>
                  <select
                    id="giftType"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newGift.label}
                    onChange={(e) =>
                      setNewGift({
                        ...newGift,
                        label: e.target.value,
                      })
                    }
                  >
                    <option value="Mới">Mới</option>
                    <option value="Hot">Hot</option>
                    <option value="Truyền thống">Truyền thống</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Danh mục sản phẩm
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newGift.categoryId}
                    onChange={(e) =>
                      setNewGift({
                        ...newGift,
                        categoryId: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    value={newGift.description}
                    onChange={(e) =>
                      setNewGift({
                        ...newGift,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={newGift.available}
                      onChange={(e) =>
                        setNewGift({
                          ...newGift,
                          available: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">Còn hàng</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-white ${
                    isEditing
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={
                    isUploading ||
                    addGiftMutation.isPending ||
                    updateGiftMutation.isPending
                  }
                >
                  {isUploading ||
                  addGiftMutation.isPending ||
                  updateGiftMutation.isPending
                    ? "Đang xử lý..."
                    : isEditing
                    ? "Cập nhật"
                    : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gift Detail Modal */}
      {showDetailModal && currentGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết sản phẩm
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Image
                  src={currentGift.imageUrl[0] || "/images/placeholder.jpg"}
                  alt={currentGift.name}
                  className="w-full h-auto object-cover rounded-lg"
                  width={500}
                  height={500}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {currentGift.name}
                </h2>
                <p className="text-xl text-blue-600 font-medium mb-4">
                  {currentGift.price.toLocaleString("vi-VN")} đ
                </p>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      currentGift.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentGift.available ? "Còn hàng" : "Hết hàng"}
                  </span>
                  <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {currentGift.label}
                  </span>
                  <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {currentGift?.category?.name || "Không có danh mục"}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Mô tả sản phẩm:
                  </h4>
                  <p className="text-gray-600">{currentGift.description}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(currentGift);
                    }}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Edit size={16} className="mr-1" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDeleteGift}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftsManagement;
