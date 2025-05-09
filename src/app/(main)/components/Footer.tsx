import { useCategoryContext } from "@/app/context/CategoryContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaMapMarkerAlt } from "react-icons/fa";

type Category = {
  id: string;
  name: string;
  label: string;
};

export default function Footer() {
  const router = useRouter();
  const { setSlug } = useCategoryContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug = "") => {
    setSlug(categorySlug);
    router.push("/products");
  };

  // Show only first 6 categories as featured products
  const featuredProducts = categories.slice(0, 6);

  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto py-10 px-6">
        {/* First row - Company info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Image
              src="/icons/kim-vinh-vuong-icon.png"
              alt="Logo"
              className="w-20 h-16 mb-2"
              width={80}
              height={64}
            />
            <div>
              <h2 className="text-3xl font-bold text-amber-100">
                THỰC PHẨM KIM VĨNH VƯƠNG
              </h2>
              <p className="text-amber-200 text-sm italic">
                Tinh hoa đặc sản Kinh Bắc
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-4 max-w-2xl">
            Mang đến những sản phẩm thực phẩm tự nhiên, hương vị đặc trưng từ
            rừng núi Việt Nam, được chế biến theo phương pháp truyền thống kết
            hợp công nghệ hiện đại.
          </p>
        </div>

        {/* Second row - Three columns layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Featured Products Column */}
          <div>
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2 mb-4">
              Sản phẩm nổi bật
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                <li className="text-gray-300">Đang tải...</li>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((category) => (
                  <li key={category.id}>
                    <div
                      onClick={() => handleCategoryClick(category.label)}
                      className="text-gray-300 hover:text-amber-200 transition duration-300 cursor-pointer"
                    >
                      • {category.name}
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/category/che-lam"
                      className="text-gray-300 hover:text-amber-200 transition duration-300"
                    >
                      • Chè lam
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/keo-lac"
                      className="text-gray-300 hover:text-amber-200 transition duration-300"
                    >
                      • Kẹo lạc
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/mut"
                      className="text-gray-300 hover:text-amber-200 transition duration-300"
                    >
                      • Mứt
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2 mb-4">
              Liên kết
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/gifts"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Quà tặng
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2 mb-4">
              Chính sách
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/policy/return"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/privacy"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/terms"
                  className="text-gray-300 hover:text-amber-200 transition duration-300"
                >
                  • Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Third row - Contact info */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2">
            THÔNG TIN CỬA HÀNG
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-200">Địa chỉ</p>
                <p className="text-sm text-gray-300">
                  Số 9, ngách 4, ngõ 93, đường Hoàng Quốc Việt, phường Nghĩa Đô,
                  quận Cầu Giấy, TP Hà Nội
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-200">Nơi sản xuất</p>
                <p className="text-sm text-gray-300">
                  Số 11, ngách 1, ngõ 117, đường Mỹ Độ, phường Mỹ Độ, TP Bắc
                  Giang
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-4 items-center">
          <p>Kết nối với chúng tôi: </p>
          <Link
            href="https://www.facebook.com/kimvinhvuong"
            target="_blank"
            className="text-gray-300 hover:text-amber-200 transition duration-300 bg-blue-900 rounded-full p-2"
          >
            <FaFacebookF size={24} />
          </Link>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-black bg-opacity-30 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Bản quyền thuộc THỰC PHẨM KIM VĨNH
            VƯƠNG
          </p>
        </div>
      </div>
    </footer>
  );
}
