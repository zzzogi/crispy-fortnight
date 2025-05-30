"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Define the Product type based on your Prisma schema
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

// Interface for the API response
interface ProductsResponse {
  products: Product[];
  total: number;
  limit?: number;
  offset?: number;
}

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();

  // Fetch retail products (regular products)
  const { data: retailProducts, isLoading: isLoadingRetail } =
    useQuery<ProductsResponse>({
      queryKey: ["products", "RETAIL"],
      queryFn: async () => {
        const response = await fetch("/api/products?type=RETAIL&limit=4");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    });

  // Fetch gift products (gift sets)
  const { data: giftProducts, isLoading: isLoadingGifts } =
    useQuery<ProductsResponse>({
      queryKey: ["products", "GIFT"],
      queryFn: async () => {
        const response = await fetch("/api/products?type=GIFT&limit=3");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    });

  const benefits = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ),
      title: "Sản phẩm chất lượng",
      description:
        "Sản phẩm được tuyển chọn kỹ lưỡng, \nđảm bảo chất lượng tốt nhất",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
      title: "Giao hàng nhanh",
      description: "Giao hàng nhanh chóng trong vòng 24h",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc",
    },
  ];

  // Fallback data in case the API fails or is loading
  const fallbackProducts = [
    {
      id: "fallback1",
      name: "Chè lam truyền thống",
      price: 85000,
      imageUrl: "/images/placeholder.jpg",
    },
    {
      id: "fallback2",
      name: "Chè lam trà xanh",
      price: 90000,
      imageUrl: "/images/placeholder.jpg",
    },
    {
      id: "fallback3",
      name: "Chè lam sầu riêng",
      price: 95000,
      imageUrl: "/images/placeholder.jpg",
    },
    {
      id: "fallback4",
      name: "Trà cổ thụ đặc biệt",
      price: 120000,
      imageUrl: "/images/placeholder.jpg",
    },
  ];

  const fallbackGiftSets = [
    {
      id: "gift1",
      name: "Set Quà Tặng Đoàn Viên",
      price: 350000,
      imageUrl: "/images/placeholder.jpg",
      description:
        "Hộp quà sang trọng với chè lam, trà sen và kẹo lạc truyền thống",
    },
    {
      id: "gift2",
      name: "Set Quà Tặng Tâm Giao",
      price: 450000,
      imageUrl: "/images/placeholder.jpg",
      description: "Bộ quà tặng cao cấp với hộp gỗ thiết kế tinh tế",
    },
    {
      id: "gift3",
      name: "Set Quà Tặng Thịnh Vượng",
      price: 650000,
      imageUrl: "/images/placeholder.jpg",
      description: "Bộ sưu tập đặc biệt dành cho các dịp lễ trọng đại",
    },
  ];

  // Helper to format price from number to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Products to display - use API data if available, otherwise use fallbacks
  const productsToDisplay =
    isLoadingRetail || !retailProducts?.products.length
      ? fallbackProducts
      : retailProducts.products;

  const giftsToDisplay =
    isLoadingGifts || !giftProducts?.products.length
      ? fallbackGiftSets
      : giftProducts.products.map((product) => ({
          ...product,
          description:
            product.description || "Bộ quà tặng đặc biệt từ Kim Vĩnh Vương",
        }));

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="relative overflow-hidden rounded-3xl mb-16 bg-amber-100">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/10 z-0"></div>
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10 p-8 md:p-12">
            <div className="text-center md:text-left">
              <h1
                className="text-3xl md:text-4xl font-bold text-amber-900 mb-4"
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                Thực phẩm Kim Vĩnh Vương &#45; {"\n"} Tinh hoa đặc sản Kinh Bắc
              </h1>
              {/* <p className="text-lg text-amber-800 mb-6">
                Khám phá hương vị truyền thống từ những sản phẩm tự nhiên, chất
                lượng cao. Chúng tôi mang đến cho bạn những trải nghiệm ẩm thực
                độc đáo và đáng nhớ.
              </p> */}
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
                onClick={() => router.push("/about")}
              >
                Về chúng tôi
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl bg-white shadow-xl overflow-hidden">
                <Image
                  src="/images/logo-quote.jpg"
                  alt="Sản phẩm Kim Vĩnh Vương"
                  fill
                  className="object-scale-down hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-amber-100"
              >
                <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-amber-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  {benefit.title}
                </h3>
                {/* <p
                  className="text-amber-700"
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {benefit.description}
                </p> */}
              </div>
            ))}
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-10">
          <div className="flex justify-center border-b border-amber-200">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === "products"
                  ? "text-amber-700 border-b-2 border-amber-600"
                  : "text-amber-400 hover:text-amber-600"
              }`}
            >
              Sản phẩm nổi bật
            </button>
            {/* <button
              onClick={() => setActiveTab("giftsets")}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === "giftsets"
                  ? "text-amber-700 border-b-2 border-amber-600"
                  : "text-amber-400 hover:text-amber-600"
              }`}
            >
              Set quà tặng
            </button> */}
          </div>
        </div>

        {/* Featured products */}
        {activeTab === "products" && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-amber-900 mb-3">
                Sản phẩm nổi bật
              </h2>
              <p className="text-amber-700 max-w-2xl mx-auto">
                Đặc sản Kinh Bắc thơm ngon, đảm bảo vệ sinh an toàn thực phẩm.
              </p>
            </div>

            {/* Loading State */}
            {isLoadingRetail && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-amber-700"></div>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.imageUrl[0] || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-amber-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-amber-600 font-semibold">
                      {formatPrice(product.price)}
                    </p>
                    <button
                      className="mt-3 w-full bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-2 rounded-lg transition duration-300"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 px-6 rounded-lg transition duration-300"
                onClick={() => router.push("/products")}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        )}

        {activeTab === "giftsets" && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-amber-900 mb-3">
                Set quà tặng cao cấp
              </h2>
              <p
                className="text-amber-700 max-w-2xl mx-auto"
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                Bộ sưu tập quà tặng đặc biệt phù hợp cho mọi dịp lễ, tết, sinh
                nhật và kỷ niệm.{"\n"} Thiết kế sang trọng, ý nghĩa và đậm đà
                hương vị truyền thống.
              </p>
            </div>

            {isLoadingGifts && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-amber-700"></div>
              </div>
            )}

            <div className="space-y-8">
              {giftsToDisplay.map((giftSet) => (
                <div
                  key={giftSet.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-amber-100"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={giftSet.imageUrl[0] || "/images/placeholder.jpg"}
                        alt={giftSet.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full font-medium">
                        Hot
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-amber-900 mb-2">
                          {giftSet.name}
                        </h3>
                        <p className="text-amber-700 mb-4">
                          {giftSet.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-amber-600">
                          {formatPrice(giftSet.price)}
                        </div>
                        <button
                          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center"
                          onClick={() => router.push(`/products/${giftSet.id}`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 px-6 rounded-lg transition duration-300"
                onClick={() => router.push("/gifts")}
              >
                Xem tất cả set quà tặng
              </button>
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Sứ mệnh của Kim Vĩnh Vương
          </h2>
          <p
            className="text-lg mb-6 max-w-2xl mx-auto italic"
            style={{
              whiteSpace: "pre-line",
            }}
          >
            &quot;Chúng tôi không chỉ bán chè lam hay kẹo lạc &#45; chúng tôi
            gửi gắm cả tâm huyết và niềm tự hào về văn hóa ẩm thực dân tộc. Mỗi
            sản phẩm là một cam kết về{"\n"} chất lượng và sự chân thành.&quot;
          </p>
          {/* <p className="text-sm text-amber-100 mb-8">
            &#45; Người sáng lập Kim Vĩnh Vương
          </p> */}
        </div>
      </section>
    </div>
  );
}
