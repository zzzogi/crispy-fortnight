import Image from "next/image";
import { FaLeaf, FaHistory, FaMedal, FaHandshake } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800">
          {/* Placeholder cho hình ảnh thực tế */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/api/placeholder/1600/800"
              alt="Truyền thống Dã Vị"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            CÂU CHUYỆN DÃ VỊ
          </h1>
          <div className="w-24 h-1 bg-amber-400 mb-6"></div>
          <p className="text-xl text-amber-100 max-w-2xl">
            Kết nối tinh hoa ẩm thực truyền thống Việt Nam với cuộc sống hiện
            đại
          </p>
        </div>
      </div>

      {/* Giới thiệu tổng quát */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Về Dã Vị</h2>
            <div className="w-16 h-1 bg-amber-500 mb-6"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Dã Vị được thành lập với tâm huyết gìn giữ và phát huy những giá
              trị ẩm thực truyền thống Việt Nam. Chúng tôi tự hào mang đến những
              sản phẩm thực phẩm chất lượng cao, được chế biến từ những nguyên
              liệu tự nhiên quý giá từ rừng núi Việt Nam theo quy trình sản xuất
              đảm bảo an toàn và chất lượng.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Qua nhiều năm phát triển, Dã Vị đã trở thành một thương hiệu uy
              tín và được yêu mến bởi sự kết hợp hài hòa giữa hương vị truyền
              thống và tiêu chuẩn chất lượng hiện đại, mang đến cho khách hàng
              những trải nghiệm ẩm thực đặc sắc và tinh tế.
            </p>
          </div>
          <div className="md:w-1/2 relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/api/placeholder/800/600"
              alt="Sản phẩm Dã Vị"
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
              Những giá trị định hình nên thương hiệu Dã Vị và là kim chỉ nam
              cho mọi hoạt động của chúng tôi
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
                Sử dụng nguyên liệu tự nhiên, không chất bảo quản độc hại, tôn
                trọng giá trị dinh dưỡng vốn có
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
                Gìn giữ và phát huy công thức chế biến truyền thống, bảo tồn
                hương vị Việt Nam nguyên bản
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
                Cam kết mang đến những sản phẩm chất lượng cao, đạt tiêu chuẩn
                an toàn vệ sinh thực phẩm
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
                Luôn đặt sự hài lòng của khách hàng lên hàng đầu, tận tâm trong
                từng sản phẩm và dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Câu chuyện thương hiệu */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Hành Trình Phát Triển
            </h2>
            <div className="w-16 h-1 bg-amber-500 mb-6"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Từ một xưởng sản xuất nhỏ tại Hải Dương, Dã Vị đã không ngừng phát
              triển và mở rộng quy mô với hệ thống phân phối rộng khắp cả nước,
              bao gồm các chi nhánh tại Hà Nội, TP Vinh và Thành phố Hồ Chí
              Minh.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi tự hào đã phục vụ hàng triệu khách hàng trong suốt chặng
              đường phát triển và được tin tưởng lựa chọn bởi sự cam kết không
              ngừng nâng cao chất lượng sản phẩm cũng như dịch vụ khách hàng.
            </p>
            <div className="mt-8">
              <blockquote className="italic text-amber-800 border-l-4 border-amber-500 pl-4 py-2">
                "Với Dã Vị, chúng tôi không chỉ bán sản phẩm, mà còn truyền tải
                nền văn hóa ẩm thực phong phú của Việt Nam đến với mọi người."
                <footer className="text-gray-600 mt-2">— Sáng lập Dã Vị</footer>
              </blockquote>
            </div>
          </div>
          <div className="md:w-1/2 relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/api/placeholder/800/600"
              alt="Xưởng sản xuất Dã Vị"
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
          <h2 className="text-3xl font-bold mb-6">Khám Phá Sản Phẩm Dã Vị</h2>
          <p className="text-lg text-amber-200 max-w-2xl mx-auto mb-8">
            Trải nghiệm hương vị truyền thống Việt Nam qua các sản phẩm chất
            lượng của Dã Vị
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg">
            Xem Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
