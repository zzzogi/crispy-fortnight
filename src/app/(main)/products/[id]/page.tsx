"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, use } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import ProductCard from "./components/ProductCart";
import Head from "next/head";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: string;
  createdAt: string;
  type: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
};

const fetchRandomProducts = async (): Promise<Product[]> => {
  const res = await fetch("/api/products?type=RETAIL&limit=4&offset=0");
  if (!res.ok) {
    throw new Error("Failed to fetch random products");
  }
  const data = await res.json();
  return data.products;
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: !!id,
  });

  const { data: randomProducts } = useQuery({
    queryKey: ["randomProducts"],
    queryFn: fetchRandomProducts,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-700"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-red-700">
            Không thể tải thông tin sản phẩm
          </h2>
          <p className="mt-2">Vui lòng thử lại sau hoặc quay lại trang chủ.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} | KIM VĨNH VƯƠNG</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="bg-amber-50">
        <div className="container mx-auto py-8 px-4">
          <div className="container mx-auto py-4 px-4 text-sm">
            <div className="flex items-center text-amber-800">
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:underline">
                Sản phẩm
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium">{product.name}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {product.imageUrl && product.imageUrl.length > 0 ? (
                  <div className="relative h-96 w-full">
                    <Image
                      src={product.imageUrl[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative h-96 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Không có hình ảnh</span>
                  </div>
                )}

                {/* Thumbnail gallery if there are multiple images */}
                {product.imageUrl && product.imageUrl.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto p-2">
                    {product.imageUrl.map((img, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 relative flex-shrink-0"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - ảnh ${index + 1}`}
                          fill
                          className="object-cover rounded border-2 border-amber-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                    {product.category}
                  </span>
                  {product.available ? (
                    <span className="ml-3 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Còn hàng
                    </span>
                  ) : (
                    <span className="ml-3 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      Hết hàng
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-amber-900 mt-4">
                  {product.name}
                </h1>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-amber-700">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Mô tả sản phẩm
                  </h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.available && (
                  <div className="mt-8">
                    <div className="flex items-center">
                      <span className="mr-4 text-amber-900">Số lượng:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-md"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-amber-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-md"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="mt-6 w-full bg-amber-700 hover:bg-amber-800 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Random Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Có thể bạn cũng thích
            </h2>

            {randomProducts && randomProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {randomProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Đang tải sản phẩm gợi ý...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
