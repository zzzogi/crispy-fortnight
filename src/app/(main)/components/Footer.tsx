import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto py-10 px-6">
        {/* Grid layout cho footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần thông tin thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/icons/kim-vinh-vuong-icon.png"
                alt="Logo"
                className="w-20 h-16 mb-2"
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
            <p className="text-sm text-gray-300">
              Mang đến những sản phẩm thực phẩm tự nhiên, hương vị đặc trưng từ
              rừng núi Việt Nam, được chế biến theo phương pháp truyền thống kết
              hợp công nghệ hiện đại.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://www.facebook.com/tinhhoachelam"
                target="_blank"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-amber-600 transition duration-300"
              >
                <FaFacebookF className="text-amber-100" />
              </Link>
            </div>
          </div>

          {/* Phần các chi nhánh */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2">
              THÔNG TIN CỬA HÀNG
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-200">Địa chỉ</p>
                  <p className="text-sm text-gray-300">
                    Số 9, ngách 4, ngõ 93, đường Hoàng Quốc Việt, phường Nghĩa
                    Đô, quận Cầu Giấy, TP Hà Nội
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
