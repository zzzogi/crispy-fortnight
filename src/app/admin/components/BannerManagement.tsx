// app/admin/banner/page.tsx
"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Banner type definition matching your model
interface Banner {
  id: string;
  imageUrl: string | null;
  caption: string | null;
}

// Initial form state
const initialFormState = {
  caption: "",
  imageFile: null as File | null,
};

export default function BannerManagement() {
  // State for banners and loading status
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch all banners from the API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      const data = await response.json();

      if (data.success) {
        setBanners(data.banners);
      } else {
        toast.error("Không tải được danh sách banner");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách banners:", error);
      toast.error("Lỗi khi tải banners");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "imageFile" && files && files.length > 0) {
      setFormData({ ...formData, imageFile: files[0] });
    } else if (name === "caption") {
      setFormData({ ...formData, caption: value });
    }
  };

  // Handle form submission for creating or updating a banner
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    if (!formData.imageFile && !editingBanner) {
      toast.error("Vui lòng chọn hình ảnh cho banner");
      setUploading(false);
      return;
    }
    if (!formData.caption) {
      toast.error("Vui lòng nhập chú thích cho banner");
      setUploading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      formDataToSend.append("caption", formData.caption || "");

      // If editing, include the banner ID
      if (editingBanner) {
        formDataToSend.append("id", editingBanner.id);
      }

      const url = editingBanner
        ? `/api/banners/${editingBanner.id}`
        : "/api/banners";

      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingBanner ? "Đã cập nhật banner" : "Đã thêm banner");
        setFormData(initialFormState);
        setEditingBanner(null);
        fetchBanners();
      } else {
        toast.error(data.message || "Lỗi khi lưu banner");
      }
    } catch (error) {
      console.error("Lỗi khi lưu banner:", error);
      toast.error("Lỗi khi lưu banner");
    } finally {
      setUploading(false);
    }
  };

  // Start editing a banner
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      caption: banner.caption || "",
      imageFile: null,
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBanner(null);
    setFormData(initialFormState);
  };

  // Delete a banner
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có muốn xoá banner này không?")) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Đã xoá banner");
        fetchBanners();
      } else {
        toast.error(data.message || "Lỗi khi xoá banner");
      }
    } catch (error) {
      console.error("Lỗi khi xoá banner:", error);
      toast.error("Lỗi khi xoá banner");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Quản lý Banner</h1>

      {/* Banner Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingBanner ? "Sửa banner" : "Thêm mới banner"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="imageFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hình ảnh
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleInputChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editingBanner?.imageUrl && !formData.imageFile && (
              <p className="mt-2 text-sm text-gray-500">
                Hình ảnh hiện tại:{" "}
                <Image
                  src={editingBanner.imageUrl}
                  alt="Current banner image"
                  width={144}
                  height={80}
                  className="rounded mt-2"
                />
                <br />
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chú thích
            </label>
            <input
              type="text"
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-500 p-2"
              placeholder="Nhập chú thích cho banner"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading
                ? "Đang tải..."
                : editingBanner
                ? "Cập nhật Banner"
                : "Thêm Banner"}
            </button>

            {editingBanner && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banner List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b text-gray-500">
          Danh sách banner
        </h2>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải danh sách banner...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có banner nào để hiển thị.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hình ảnh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Chú thích
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.imageUrl ? (
                        <div className="w-36 h-20 relative">
                          <Image
                            src={banner.imageUrl}
                            alt={banner.caption || "Banner image"}
                            fill
                            className="object-cover rounded"
                            sizes="144px"
                          />
                        </div>
                      ) : (
                        <div className="w-36 h-20 bg-gray-100 flex items-center justify-center rounded">
                          <span className="text-gray-400">
                            Không có hình ảnh
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {banner.caption || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
