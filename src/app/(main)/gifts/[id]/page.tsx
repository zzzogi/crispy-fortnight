"use client";
import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCart } from "@/app/context/CartContext";
import { formatCurrency } from "@/app/utils/format";

// Types
interface GiftProduct {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: {
    id: string;
    name: string;
    label: string;
  };
  label: string;
  createdAt: string;
  type: string;
}

// Fetch functions
const fetchProduct = async (id: string): Promise<GiftProduct> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

const fetchRelatedProducts = async (): Promise<GiftProduct[]> => {
  const res = await fetch("/api/products?type=GIFT&limit=6&offset=0");
  if (!res.ok) throw new Error("Failed to fetch related products");
  const data = await res.json();
  return data.products;
};

export default function GiftDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Queries
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: !!id,
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedProducts"],
    queryFn: fetchRelatedProducts,
  });

  // Handlers
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity,
      });
    }
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  if (productLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-amber-800">
          Đang tải sản phẩm...
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">
          Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50">
      {/* Breadcrumb */}
      <div className="container mx-auto py-4 px-4 text-sm">
        <div className="flex items-center text-amber-800">
          <Link href="/" className="hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/gifts" className="hover:underline">
            Quà tặng
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="relative h-96 bg-amber-100 rounded-lg overflow-hidden">
              {product.imageUrl && product.imageUrl.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-full w-full"
                >
                  {product.imageUrl.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full w-full">
                        {img ? (
                          <Image
                            src={img}
                            alt={`${product.name} - ảnh ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-amber-50">
                            <span className="text-amber-800">
                              Không có hình ảnh
                            </span>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-amber-800">Không có hình ảnh</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2 text-sm text-amber-600">
                <span className="inline-block px-2 py-1 bg-amber-100 rounded">
                  {product.label || "Sản phẩm đặc trưng"}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(product.price)} VNĐ
                </div>

                {!product.available && (
                  <span className="ml-3 px-2 py-1 bg-red-100 text-red-600 text-sm rounded">
                    Hết hàng
                  </span>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Mô tả sản phẩm:
                </h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {product.available && (
                <>
                  <div className="flex items-center mb-6">
                    <span className="mr-4 text-amber-900">Số lượng:</span>
                    <div className="flex items-center border border-amber-300 rounded">
                      <button
                        onClick={handleDecreaseQuantity}
                        className="px-3 py-2 text-amber-800 hover:bg-amber-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-amber-300 text-amber-900">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="px-3 py-2 text-amber-800 hover:bg-amber-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                </>
              )}

              <div className="mt-6 text-gray-600 text-sm">
                {product.createdAt && (
                  <p>
                    Ngày ra mắt:{" "}
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">
          Sản phẩm khác có thể bạn thích
        </h2>

        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="h-40 bg-amber-100 rounded mb-4"></div>
                <div className="h-4 bg-amber-100 rounded mb-2"></div>
                <div className="h-4 bg-amber-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedProducts &&
              relatedProducts.map((item) => (
                <Link
                  href={`/gifts/${item.id}`}
                  key={item.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                    <div className="relative h-40">
                      {item.imageUrl && item.imageUrl[0] ? (
                        <Image
                          src={item.imageUrl[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-amber-50">
                          <span className="text-amber-800 text-sm">
                            Không có hình
                          </span>
                        </div>
                      )}
                      {item.label && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                          {item.label}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-amber-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-red-600 font-bold">
                        {formatCurrency(item.price)} VNĐ
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
