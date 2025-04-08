"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiGift,
  FiSearch,
  FiChevronDown,
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

interface Gift {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: string;
  createdAt: string;
}

interface GiftsResponse {
  gifts: Gift[];
  total: number;
  limit: number;
  offset: number;
}

const fetchGifts = async ({ queryKey }: { queryKey: any[] }) => {
  const [_, search, priceOrder, page, limit] = queryKey;
  const offset = (page - 1) * limit;

  const response = await fetch(
    `http://localhost:3000/api/gifts?limit=${limit}&offset=${offset}&search=${
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

const GiftCard = ({ gift }: { gift: Gift }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-amber-50">
      <div className="relative h-64 w-full bg-amber-50 overflow-hidden">
        {gift.imageUrl[0] ? (
          <Image
            src={gift.imageUrl[0]}
            alt={gift.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-amber-100">
            <FiGift className="h-16 w-16 text-amber-300" />
          </div>
        )}

        <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-amber-800 text-xs px-2 py-1 rounded-full">
          {gift.category}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>

        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-center space-x-2">
            <button className="bg-amber-700 hover:bg-amber-800 text-white p-2 rounded-full">
              <FiShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          {gift.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {gift.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-amber-800 font-bold">
            {formatPrice(gift.price)}
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              gift.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {gift.available ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Gifts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceOrder, setPriceOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [occasion, setOccasion] = useState("all");
  const limit = 8;

  const { data, isLoading, error } = useQuery({
    queryKey: ["gifts", searchTerm, priceOrder, currentPage, limit],
    queryFn: fetchGifts,
    placeholderData: {
      gifts: [],
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

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      const parallaxEl = document.querySelector(".parallax-bg") as HTMLElement;
      if (parallaxEl) {
        const scrollPosition = window.scrollY;
        parallaxEl.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          Đã xảy ra lỗi khi tải quà tặng. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  const occasions = [
    { id: "all", name: "Tất cả" },
    { id: "tet", name: "Tết" },
    { id: "birthday", name: "Sinh nhật" },
    { id: "wedding", name: "Đám cưới" },
    { id: "housewarming", name: "Tân gia" },
    { id: "corporate", name: "Doanh nghiệp" },
  ];

  return (
    <div className="px-12 pb-16 bg-amber-50">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden mb-16">
        <div
          className="parallax-bg absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/gift-banner.jpg')",
            transform: "translateY(0)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-black/40"></div>
        </div>

        <div className="container mx-auto px-12 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white text-amber-800 text-sm font-medium mb-4">
              Quà tặng Kim Vĩnh Vương
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Món Quà Tinh Tế
              <br />
              Trao Gửi Yêu Thương
            </h1>
            <p className="text-amber-100 text-lg md:text-xl mb-8 max-w-xl">
              Giỏ quà đặc sản tinh hoa vùng Kinh Bắc - Món quà ý nghĩa cho người
              thân, đối tác và bạn bè.
            </p>
            <a
              href="#gift-list"
              className="inline-block px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition-colors"
            >
              Khám phá ngay
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Gift Occasions */}
        {/* <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900">
              Giỏ Quà Theo Dịp
            </h2>
            <Link
              href="/occasions"
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((item) => (
              <button
                key={item.id}
                onClick={() => setOccasion(item.id)}
                className={`relative px-4 py-3 rounded-lg text-center transition-all ${
                  occasion === item.id
                    ? "bg-amber-700 text-white"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div> */}

        {/* Premium Gift Banner */}
        {/* <div className="mb-12">
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Bộ Sưu Tập Giỏ Quà Cao Cấp
                </h2>
                <p className="text-amber-100 mb-6">
                  Giỏ quà cao cấp được thiết kế tinh tế, sang trọng với các sản
                  phẩm đặc sản chất lượng cao, đóng gói tỉ mỉ và trình bày đẹp
                  mắt. Món quà hoàn hảo cho những dịp quan trọng và đối tác đặc
                  biệt.
                </p>
                <Link
                  href="/premium-gifts"
                  className="inline-block px-6 py-3 bg-white text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  Khám phá bộ sưu tập
                </Link>
              </div>
              <div className="md:col-span-2 bg-amber-100 h-48 md:h-auto relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white">
                    <div className="w-full h-full bg-amber-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Search and Filters */}
        <div
          id="gift-list"
          className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <form onSubmit={handleSearch} className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm quà tặng..."
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
              Lọc quà tặng
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
        {(priceOrder || occasion !== "all") && (
          <div className="mb-6 flex items-center flex-wrap gap-2">
            <span className="text-sm text-amber-800">Đang lọc: </span>

            {priceOrder && (
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
            )}

            {occasion !== "all" && (
              <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full flex items-center">
                {occasions.find((o) => o.id === occasion)?.name}
                <button
                  onClick={() => setOccasion("all")}
                  className="ml-2 text-amber-800 hover:text-amber-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Gift Description */}
        <div className="mb-10 bg-amber-50 p-6 rounded-lg border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">
            Quà Tặng Kim Vĩnh Vương - Tinh Hoa Vùng Kinh Bắc
          </h2>
          <p className="text-amber-800">
            Giỏ quà Kim Vĩnh Vương được thiết kế tỉ mỉ, sang trọng với các sản
            phẩm đặc sản truyền thống được tuyển chọn kỹ lưỡng từ vùng đất Kinh
            Bắc. Mỗi giỏ quà là sự kết hợp hài hòa giữa giá trị văn hóa và hương
            vị đặc trưng, là món quà ý nghĩa cho các dịp lễ, tết, sinh nhật,
            khai trương hay làm quà biếu tặng đối tác, người thân.
          </p>
        </div>

        {/* Gifts */}
        {data?.gifts && data.gifts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {data.gifts.map((gift: Gift) => (
                <Link href={`/gift/${gift.id}`} key={gift.id} className="block">
                  <GiftCard gift={gift} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="my-12 flex justify-center">
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
                            ? "bg-amber-700 text-white"
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

            <div className="text-center">
              <p className="text-amber-800">
                Hiển thị {data.gifts.length} trên tổng số {data.total} quà tặng
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-amber-50 rounded-lg">
            <FiGift className="mx-auto h-16 w-16 text-amber-300" />
            <p className="text-xl text-amber-800 mt-4">
              Không tìm thấy quà tặng nào
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

        {/* Gift Box Process */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-amber-900 mb-8 text-center">
            Quy Trình Tạo Nên Giỏ Quà Tặng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Lựa Chọn Nguyên Liệu
              </h3>
              <p className="text-amber-800">
                Chọn lọc các nguyên liệu tự nhiên, chất lượng cao từ vùng đất
                Kinh Bắc
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Chế Biến Truyền Thống
              </h3>
              <p className="text-amber-800">
                Áp dụng bí quyết gia truyền kết hợp công nghệ hiện đại tạo nên
                sản phẩm đặc sắc
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Thiết Kế Sang Trọng
              </h3>
              <p className="text-amber-800">
                Thiết kế và đóng gói tinh tế, sang trọng, phù hợp với từng dịp
                và đối tượng
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Giao Hàng Tận Nơi
              </h3>
              <p className="text-amber-800">
                Dịch vụ giao hàng tận nơi, đảm bảo sản phẩm đến tay người nhận
                nguyên vẹn, đúng hẹn
              </p>
            </div>
          </div>
        </div>

        {/* Custom Gift Option */}
        <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-block px-3 py-1 bg-amber-700 text-white text-sm rounded-full mb-4">
                Dịch vụ đặc biệt
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
                Thiết Kế Giỏ Quà Theo Yêu Cầu
              </h2>
              <p className="text-amber-800 mb-6">
                Bạn có thể tự thiết kế giỏ quà theo ý thích hoặc để chúng tôi tư
                vấn giỏ quà phù hợp với ngân sách và mục đích của bạn. Đội ngũ
                chuyên nghiệp sẽ giúp bạn tạo nên món quà ý nghĩa và đặc biệt.
              </p>
              <Link
                href="/custom-gift"
                className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
              >
                Liên hệ tư vấn
              </Link>
            </div>
            <div className="flex items-center justify-center p-12 bg-amber-200">
              <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center">
                <FiGift className="h-20 w-20 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
