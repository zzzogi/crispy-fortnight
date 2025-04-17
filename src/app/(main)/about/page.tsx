"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaHandshake,
  FaHistory,
  FaLeaf,
  FaMedal,
  FaStar,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function About() {
  const router = useRouter();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/about/banner.jpg"
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
          <div className="md:w-1/2 h-80 rounded-lg overflow-hidden shadow-xl">
            <div className="relative w-full h-full">
              <Image
                src="/images/logo-quote-horizontal.jpg"
                alt="Sản phẩm Kim Vĩnh Vương"
                className="w-full h-full object-scale-down rounded-lg"
                fill
              />
            </div>
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

      {/* Giấy tờ chứng nhận - PHẦN MỚI */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Chứng Nhận Chất Lượng
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Kim Vĩnh Vương tự hào đạt được các chứng nhận uy tín từ cơ quan có
            thẩm quyền, khẳng định cam kết vệ sinh an toàn thực phẩm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="relative h-64 mb-6 rounded overflow-hidden">
              <Image
                src="/about/test-result-2.jpg"
                alt="Giấy xét nghiệm dưỡng chất"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Kết quả xét nghiệm dưỡng chất
            </h3>
            <p className="text-gray-600 mb-4">
              Hàm lượng dưỡng chất ổn định, nhà nhà đều có thể thưởng thức
            </p>
            <div className="flex items-center text-amber-700">
              <IoMdCheckmarkCircleOutline className="mr-2" /> Năm 2021
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="relative h-64 mb-6 rounded overflow-hidden">
              <Image
                src="/about/test-result-3.jpg"
                alt="Giấy xét nghiệm dưỡng chất"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Kết quả xét nghiệm ô nhiễm sinh học
            </h3>
            <p className="text-gray-600 mb-4">
              Đạt tiêu chuẩn vệ sinh an toàn thực phẩm theo quy định của Bộ Y Tế
              Bắc Giang
            </p>
            <div className="flex items-center text-amber-700">
              <IoMdCheckmarkCircleOutline className="mr-2" /> Năm 2021
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="relative h-64 mb-6 rounded overflow-hidden">
              <Image
                src="/about/vietgap.jpg"
                alt="Chứng nhận tiểu chuẩn VIETGAP"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Chứng Nhận ĐẠT TIÊU CHUẨN VIETGAP
            </h3>
            <p className="text-gray-600 mb-4">
              Sản phẩm đạt tiêu chuẩn VietGAP trong sản xuất nông nghiệp
            </p>
            <div className="flex items-center text-amber-700">
              <IoMdCheckmarkCircleOutline className="mr-2" /> Cấp năm 2023
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Sản phẩm - PHẦN MỚI */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Sản Phẩm Kim Vĩnh Vương
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Khám phá những sản phẩm chất lượng mang hương vị thuần Việt
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sản phẩm 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <div className="relative h-60">
                <Image
                  src="/about/item-1.jpg"
                  alt="Chè Lam Truyền Thống"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-amber-900">
                  Chè Lam Truyền Thống
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Hương vị gừng đặc trưng, thơm ngon đậm đà
                </p>
              </div>
            </div>

            {/* Sản phẩm 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <div className="relative h-60">
                <Image
                  src="/about/item-2.jpg"
                  alt="Chè Lam Lạc"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-amber-900">
                  Chè Lam Lạc
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Kết hợp độc đáo giữa vị chè lam và đậu phộng giòn tan
                </p>
              </div>
            </div>

            {/* Sản phẩm 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <div className="relative h-60">
                <Image
                  src="/about/item-3.jpg"
                  alt="chè lam & trà"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-amber-900">
                  Thưởng thức cùng trà
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Món tráng miệng giòn ngọt, đậm vị thiên nhiên
                </p>
              </div>
            </div>

            {/* Sản phẩm 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <div className="relative h-60">
                <Image
                  src="/about/item-4.jpg"
                  alt="Mứt Gừng"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-amber-900">
                  Túi quà sang trọng
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Dùng để tặng những người thân cận, mang tình cảm nồng ấm
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg"
              onClick={() => router.push("/products")}
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Hành trình phát triển */}
      <div className="container mx-auto py-16 px-20">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
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
                &quot;Kim Vĩnh Vương không chỉ là một thương hiệu, mà còn là nơi
                lưu giữ và lan tỏa tinh hoa ẩm thực Việt.&quot;
                <footer className="text-gray-600 mt-2">— Người sáng lập</footer>
              </blockquote>
            </div>
          </div>
          <div className="md:w-1/3 w-full h-80 rounded-lg overflow-hidden shadow-xl">
            <div className="relative w-full h-full">
              <Image
                src="/images/founder.jpg"
                alt="Founder của Kim Vĩnh Vương"
                className="w-full h-full object-contain rounded-lg"
                fill
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials - PHẦN MỚI */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Những trải nghiệm và cảm nhận từ khách hàng thân thiết của Kim
              Vĩnh Vương
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;Bố mẹ chồng em rất kén đồ, thử bao loại chè lam nhưng Chè
                của Bà vẫn được đánh giá số 1. Tết ko có túi chè lam của bà là
                thiếu hương vị tết.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/about/guest-1.jpg"
                    alt="Khách hàng"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">Hang Le Kim</h4>
                  <p className="text-gray-600 text-sm">Khách hàng thân thiết</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;Chưa thấy hương vị chè lam nào ngon như vậy, mặc dù mình
                đã ăn thử khá nhiều loại ở các nơi. Tuyệt vời!!!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/about/guest-2.jpg"
                    alt="Khách hàng"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">
                    Trịnh Hồng Đức
                  </h4>
                  <p className="text-gray-600 text-sm">Khách hàng tại Hà Nội</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;Đã ăn rất nhiều loại chè lam nhưng chưa nơi nào ngon như
                chè lam của Bà 😋&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/about/guest-3.jpg"
                    alt="Khách hàng"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">
                    Đinh Thị Lam Anh
                  </h4>
                  <p className="text-gray-600 text-sm">Khách hàng thân thiết</p>
                </div>
              </div>
            </div>
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
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg"
            onClick={() => router.push("/products")}
          >
            Xem Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
