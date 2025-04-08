"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiChevronDown,
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: string;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

const fetchProducts = async ({ queryKey }: { queryKey: any[] }) => {
  const [_, search, priceOrder, page, limit] = queryKey;
  const offset = (page - 1) * limit;

  const response = await fetch(
    `http://localhost:3000/api/products?limit=${limit}&offset=${offset}&search=${
      search || ""
    }&${priceOrder || ""}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 border border-amber-100">
      <div className="relative h-52 w-full bg-gray-200">
        {product.imageUrl[0] ? (
          <Image
            src={product.imageUrl[0]}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-amber-100">
            <span className="text-amber-800">Hình ảnh đang cập nhật</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-2 right-2 bg-amber-700 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold transform rotate-12">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-amber-800 font-bold">
            {formatPrice(product.price)}
          </span>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition-colors">
            Khám phá
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceOrder, setPriceOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", searchTerm, priceOrder, currentPage, limit],
    queryFn: fetchProducts,
    placeholderData: {
      products: [],
      total: 0,
      limit,
      offset: 0,
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePriceSort = (order: string) => {
    setPriceOrder(order);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">
          Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-12 py-8 pb-16 bg-amber-50">
      {/* Hero Section with Storytelling */}
      <div className="relative overflow-hidden rounded-xl mb-12">
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-12 md:px-10 md:py-16">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-repeat opacity-20"
              style={{ backgroundImage: "url('/pattern-bg.png')" }}
            ></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Khám Phá Tinh Hoa Đặc Sản Kinh Bắc
            </h1>
            <p className="text-amber-100 md:text-lg mb-6">
              Từ những ngọn đồi xanh ngát của vùng đất Kinh Bắc, chúng tôi đã
              chắt lọc và mang đến những sản phẩm đặc trưng được chế biến bằng
              bí quyết gia truyền, kết hợp với công nghệ hiện đại.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#product-list"
                className="bg-white text-amber-800 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/about"
                className="border border-white text-white hover:text-amber-800 hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Câu chuyện của chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      {/* <div className="mb-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">
          Danh Mục Nổi Bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Chè Lam", "Kẹo Đậu Phộng", "Mứt", "Đặc Sản Khác"].map(
            (category, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden h-32"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-900"></div>
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-medium">{category}</h3>
                </div>
              </div>
            )
          )}
        </div>
      </div> */}

      {/* Search and Filters */}
      <div
        id="product-list"
        className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <form onSubmit={handleSearch} className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          </div>
        </form>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 rounded border border-amber-300 text-amber-800 flex items-center gap-2"
          >
            <FiFilter />
            Lọc sản phẩm
            <FiChevronDown
              className={`ml-1 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 py-2 border border-amber-100">
              <div className="px-4 py-2 text-sm font-medium text-amber-800 border-b border-amber-100">
                Sắp xếp theo giá
              </div>
              <button
                onClick={() => handlePriceSort("priceAsc")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  priceOrder === "priceAsc"
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-gray-700 hover:bg-amber-50"
                }`}
              >
                Giá thấp đến cao
              </button>
              <button
                onClick={() => handlePriceSort("priceDesc")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  priceOrder === "priceDesc"
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-gray-700 hover:bg-amber-50"
                }`}
              >
                Giá cao đến thấp
              </button>
              <button
                onClick={() => handlePriceSort("")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  priceOrder === ""
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-gray-700 hover:bg-amber-50"
                }`}
              >
                Mặc định
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {priceOrder && (
        <div className="mb-6 flex items-center">
          <span className="text-sm text-amber-800 mr-2">Đang lọc: </span>
          <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full flex items-center">
            {priceOrder === "priceAsc"
              ? "Giá thấp đến cao"
              : "Giá cao đến thấp"}
            <button
              onClick={() => setPriceOrder("")}
              className="ml-2 text-amber-800 hover:text-amber-900"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Product Story Section */}
      <div className="mb-8 bg-amber-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-amber-900 mb-2">
          Câu Chuyện Đặc Sản Kim Vĩnh Vương
        </h2>
        <p className="text-amber-800">
          Mỗi sản phẩm từ Kim Vĩnh Vương đều có một câu chuyện riêng, từ cách
          lựa chọn nguyên liệu tự nhiên, đến quy trình sản xuất tỉ mỉ theo
          phương pháp truyền thống kết hợp công nghệ hiện đại. Hãy cùng khám phá
          hương vị đặc trưng của vùng đất Kinh Bắc qua từng sản phẩm.
        </p>
      </div>

      {/* Products */}
      {data?.products && data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.products.map((product: Product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    currentPage === 1
                      ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  <FiArrowLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        currentPage === page
                          ? "bg-amber-600 text-white"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-amber-800">
              Hiển thị {data.products.length} trên tổng số {data.total} sản phẩm
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-amber-50 rounded-lg">
          <Image
            src="/empty-basket.svg"
            width={120}
            height={120}
            alt="Không có sản phẩm"
          />
          <p className="text-xl text-amber-800 mt-4">
            Không tìm thấy sản phẩm nào
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      )}

      {/* Story & Testimonial */}
      <div className="mt-16 bg-amber-50 rounded-xl overflow-hidden border border-amber-200 shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Chất Lượng Từ Từng Nguyên Liệu
            </h2>
            <p className="text-amber-800 mb-4">
              Tại Kim Vĩnh Vương, chúng tôi đặc biệt chú trọng vào việc lựa chọn
              nguyên liệu tự nhiên, tươi ngon từ những vùng trồng nổi tiếng của
              Việt Nam.
            </p>
            <p className="text-amber-800 mb-6">
              Mỗi sản phẩm đều được chế biến theo công thức gia truyền, giữ trọn
              hương vị đặc trưng của vùng đất Kinh Bắc, nơi giao thoa giữa văn
              hóa và ẩm thực truyền thống.
            </p>
            <Link
              href="/about"
              className="text-amber-700 font-medium hover:text-amber-800 flex items-center"
            >
              Tìm hiểu thêm về chúng tôi
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="bg-amber-200 h-64 md:h-auto"></div>
        </div>
      </div>
    </div>
  );
}
