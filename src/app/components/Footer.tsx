import {
  FaMapMarkerAlt,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto py-10 px-6">
        {/* Grid layout cho footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phần thông tin thương hiệu */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-amber-100">DÃ VỊ</h2>
            <p className="text-amber-200 text-sm italic">
              Hương vị truyền thống
            </p>
            <p className="text-sm text-gray-300">
              Mang đến những sản phẩm thực phẩm tự nhiên, hương vị đặc trưng từ
              rừng núi Việt Nam, được chế biến theo phương pháp truyền thống kết
              hợp công nghệ hiện đại.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-amber-600 transition duration-300"
              >
                <FaFacebookF className="text-amber-100" />
              </a>
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-amber-600 transition duration-300"
              >
                <FaInstagram className="text-amber-100" />
              </a>
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-amber-600 transition duration-300"
              >
                <FaYoutube className="text-amber-100" />
              </a>
            </div>
          </div>

          {/* Phần các chi nhánh */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2">
              HỆ THỐNG CHI NHÁNH
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-200">Hải Dương</p>
                  <p className="text-sm text-gray-300">
                    Số 6 Hoàng Hoa Thám, TP Hải Dương
                  </p>
                  <p className="text-sm text-gray-300">
                    <FaPhone className="inline mr-1" /> 094 286 6969
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-200">Hà Nội</p>
                  <p className="text-sm text-gray-300">
                    Số 15, ngõ 343 Đội Cấn, Quận Ba Đình
                  </p>
                  <p className="text-sm text-gray-300">
                    <FaPhone className="inline mr-1" /> 090 456 6260
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phần liên hệ & đăng ký */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100 border-b border-amber-600 pb-2">
              LIÊN HỆ & ĐĂNG KÝ
            </h3>
            <div className="flex items-start mb-2">
              <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-200">TP Vinh</p>
                <p className="text-sm text-gray-300">
                  Đường Trần Huy Liệu, TP Vinh
                </p>
                <p className="text-sm text-gray-300">
                  <FaPhone className="inline mr-1" /> 098 198 2358
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-amber-300 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-200">Sài Gòn</p>
                <p className="text-sm text-gray-300">
                  Lầu 1 - 59 Cư Xá, Trần Quang Diệu, Quận 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-black bg-opacity-30 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Bản quyền thuộc DÃ VỊ - RỒNG VÀNG KỲ
            ANH
          </p>
        </div>
      </div>
    </footer>
  );
}
