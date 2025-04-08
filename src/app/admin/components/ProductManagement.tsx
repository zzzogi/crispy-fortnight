"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Image,
  Loader,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

interface UploadedImage {
  file: File;
  preview: string;
}

const ITEMS_PER_PAGE = 8;

const ProductsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    available: true,
    description: "",
    imageUrl: [],
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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
  const fetchProducts = async ({ queryKey }: any) => {
    const [_, page, limit, search] = queryKey;
    const offset = (page - 1) * limit;
    const response = await fetch(
      `http://localhost:3000/api/products?limit=${limit}&offset=${offset}&search=${search}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["products", currentPage, ITEMS_PER_PAGE, searchTerm],
    queryFn: fetchProducts,
  });

  const uploadToS3Mutation = useMutation({
    mutationFn: async (productName: string) => {
      if (uploadedImages.length === 0) return null;

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("productName", productName);

      uploadedImages.forEach((image, _) => {
        formData.append(`images`, image.file);
      });

      const response = await fetch("http://localhost:3000/api/products/upload", {
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

  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Error adding product");
      return response.json();
    },
    onSuccess: (data) => {
      // If we have images to upload, do that now using the returned product ID
      if (uploadedImages.length > 0) {
        uploadToS3Mutation.mutate(data.name, {
          onSuccess: (imageUrl) => {
            // Update the product with the new image URL
            if (imageUrl) {
              updateProductMutation.mutate({
                id: data.id,
                ...newProduct,
                imageUrl: imageUrl.imageUrl,
              });
            }
            finishProductOperation();
          },
          onError: (error) => {
            console.error("Failed to upload images:", error);
            // Still finish the operation, but product will not have images
            finishProductOperation();
          },
        });
      } else {
        finishProductOperation();
      }
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Error updating product");
      return response.json();
    },
    onSuccess: (data) => {
      // If we have images to upload, do that now - this will replace existing images
      if (uploadedImages.length > 0) {
        uploadToS3Mutation.mutate(data.name, {
          onSuccess: (imageUrl) => {
            // Update the product with the new image URL if necessary
            if (imageUrl && imageUrl !== data.imageUrl) {
              updateProductMutation.mutate({
                ...data,
                imageUrl: imageUrl.imageUrl,
              });
            }
            finishProductOperation();
          },
          onError: (error) => {
            console.error("Failed to upload images:", error);
            finishProductOperation();
          },
        });
      } else {
        finishProductOperation();
      }
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (obj: { id: string; name: string }) => {
      // First delete S3 images
      const imageDeleteResponse = await fetch(
        `http://localhost:3000/api/products/upload?productName=${obj.name}`,
        {
          method: "DELETE",
        }
      );

      // Then delete the product from database
      const response = await fetch("http://localhost:3000/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: obj.id }),
      });

      if (!response.ok) throw new Error("Error deleting product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDetailModal(false);
    },
  });

  const finishProductOperation = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
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
    resetForm();
    setUploadedImages([]);
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setNewProduct({
      name: product.name,
      price: product.price,
      available: product.available,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    setCurrentProduct(product);
    setUploadedImages([]);
    setShowAddModal(true);
  };

  const openDetailModal = (product: Product) => {
    setCurrentProduct(product);
    setShowDetailModal(true);
  };

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && currentProduct) {
      updateProductMutation.mutate({
        id: currentProduct.id,
        ...newProduct,
      });
    } else {
      addProductMutation.mutate(newProduct);
    }
  };

  const handleDeleteProduct = () => {
    if (currentProduct) {
      if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteProductMutation.mutate({
          id: currentProduct.id,
          name: currentProduct.name,
        });
      }
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: 0,
      available: true,
      description: "",
      imageUrl: [],
      category: "",
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
        Quản lý sản phẩm
      </h2>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex w-1/2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Đã xảy ra lỗi: {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openDetailModal(product)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.imageUrl[0] || "/images/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder-image.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {product.price.toLocaleString("vi-VN")} đ
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.available ? "Còn hàng" : "Hết hàng"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, index) => (
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
        </>
      )}

      {/* Add/Edit Product Modal */}
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

            <form onSubmit={handleAddOrUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
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
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
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
                      checked={newProduct.available}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
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
                    addProductMutation.isPending ||
                    updateProductMutation.isPending
                  }
                >
                  {isUploading ||
                  addProductMutation.isPending ||
                  updateProductMutation.isPending
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

      {/* Product Detail Modal */}
      {showDetailModal && currentProduct && (
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
                <img
                  src={
                    currentProduct.imageUrl[0] ||
                    "/images/placeholder-image.jpg"
                  }
                  alt={currentProduct.name}
                  className="w-full h-auto object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder-image.jpg";
                  }}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {currentProduct.name}
                </h2>
                <p className="text-xl text-blue-600 font-medium mb-4">
                  {currentProduct.price.toLocaleString("vi-VN")} đ
                </p>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      currentProduct.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentProduct.available ? "Còn hàng" : "Hết hàng"}
                  </span>
                  <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {currentProduct.category}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Mô tả sản phẩm:
                  </h4>
                  <p className="text-gray-600">{currentProduct.description}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(currentProduct);
                    }}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Edit size={16} className="mr-1" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDeleteProduct}
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

export default ProductsManagement;
