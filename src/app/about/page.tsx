import Image from "next/image";
import { FaLeaf, FaHistory, FaMedal, FaHandshake } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/api/placeholder/1600/800"
              alt="Truyền thống Kim Vĩnh Vương"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            CÂU CHUYỆN KIM VĨNH VƯƠNG
          </h1>
          <div className="w-24 h-1 bg-amber-400 mb-6"></div>
          <p className="text-xl text-amber-100 max-w-2xl">
            Gìn giữ hương vị truyền thống – Chè lam và đặc sản dân gian Việt
          </p>
        </div>
      </div>

      {/* Giới thiệu tổng quát */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Về Kim Vĩnh Vương
            </h2>
            <div className="w-16 h-1 bg-amber-500 mb-6"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Kim Vĩnh Vương là thương hiệu ra đời từ lòng đam mê và sự trân
              trọng dành cho ẩm thực truyền thống Việt Nam. Chúng tôi chuyên
              cung cấp các sản phẩm như chè lam – món quà quê ngọt ngào, mang
              đậm bản sắc dân tộc.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Với mục tiêu không ngừng phát triển, Kim Vĩnh Vương sẽ mở rộng
              thêm các dòng sản phẩm như kẹo lạc, mứt, ô mai – tất cả đều được
              chế biến từ nguyên liệu tự nhiên, đảm bảo chất lượng và hương vị
              thuần Việt.
            </p>
          </div>
          <div className="md:w-1/2 relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/api/placeholder/800/600"
              alt="Sản phẩm Kim Vĩnh Vương"
              layout="fill"
              objectFit="cover"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Giá trị cốt lõi */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Những nguyên tắc tạo nên thương hiệu Kim Vĩnh Vương – gắn kết
              truyền thống và chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-800 mb-4">
                <FaLeaf className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Tự Nhiên
              </h3>
              <p className="text-gray-600">
                Nguyên liệu truyền thống, không phẩm màu nhân tạo, an toàn và
                giữ nguyên hương vị quê hương
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-800 mb-4">
                <FaHistory className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Truyền Thống
              </h3>
              <p className="text-gray-600">
                Gìn giữ công thức chế biến lâu đời, tôn vinh nét ẩm thực cổ
                truyền Việt Nam
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-800 mb-4">
                <FaMedal className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Chất Lượng
              </h3>
              <p className="text-gray-600">
                Đảm bảo vệ sinh an toàn thực phẩm và quy trình chế biến nghiêm
                ngặt trong từng mẻ sản phẩm
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-800 mb-4">
                <FaHandshake className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Tận Tâm
              </h3>
              <p className="text-gray-600">
                Luôn lấy sự hài lòng của khách hàng làm trọng tâm, phục vụ bằng
                cả tấm lòng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hành trình thương hiệu */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Hành Trình Phát Triển
            </h2>
            <div className="w-16 h-1 bg-amber-500 mb-6"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Khởi đầu từ một cơ sở thủ công nhỏ tại vùng quê Bắc Bộ, Kim Vĩnh
              Vương đã vươn mình trở thành một thương hiệu được yêu thích với hệ
              thống phân phối tại nhiều tỉnh thành.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi tự hào là lựa chọn của hàng ngàn khách hàng bởi sự chỉn
              chu trong từng sản phẩm – mang đậm tình quê và chất lượng đảm bảo.
            </p>
            <div className="mt-8">
              <blockquote className="italic text-amber-800 border-l-4 border-amber-500 pl-4 py-2">
                "Kim Vĩnh Vương không chỉ là một thương hiệu, mà còn là nơi lưu
                giữ và lan tỏa tinh hoa ẩm thực Việt."
                <footer className="text-gray-600 mt-2">— Người sáng lập</footer>
              </blockquote>
            </div>
          </div>
          <div className="md:w-1/2 relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/api/placeholder/800/600"
              alt="Xưởng Kim Vĩnh Vương"
              layout="fill"
              objectFit="cover"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-amber-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Khám Phá Sản Phẩm Kim Vĩnh Vương
          </h2>
          <p className="text-lg text-amber-200 max-w-2xl mx-auto mb-8">
            Từ chè lam truyền thống đến những món quà quê như kẹo lạc, mứt, ô
            mai – tất cả đều mang hồn Việt
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg">
            Xem Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
