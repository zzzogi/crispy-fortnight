// app/policies/terms/page.tsx
"use client";

import React from "react";
import { FiBookOpen, FiUserCheck, FiCreditCard } from "react-icons/fi";
import Link from "next/link";

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <nav className="mb-6 flex">
          <Link href="/" className="text-amber-600 hover:text-amber-800">
            Trang chủ
          </Link>
          <span className="mx-2 text-amber-400">/</span>
          <span className="text-amber-800">Điều khoản sử dụng</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6 border-b border-amber-200 pb-3">
            ĐIỀU KHOẢN SỬ DỤNG
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
              <FiBookOpen className="mr-2" />
              1. Giới thiệu
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Chào mừng quý khách hàng đến với website chúng tôi.</p>
              <p>
                Khi quý khách hàng truy cập vào trang website của chúng tôi có
                nghĩa là quý khách đồng ý với các điều khoản này. Trang web có
                quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào
                trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các
                thay đổi có hiệu lực ngay khi được đăng trên trang web mà không
                cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang
                web, sau khi các thay đổi về Điều khoản này được đăng tải, có
                nghĩa là quý khách chấp nhận với những thay đổi đó.
              </p>
              <p className="bg-amber-100 p-4 rounded-md">
                Quý khách hàng vui lòng kiểm tra thường xuyên để cập nhật những
                thay đổi của chúng tôi.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
              <FiUserCheck className="mr-2" />
              2. Hướng dẫn sử dụng website
            </h2>
            <div className="text-gray-700">
              <p>
                Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi,
                hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp
                pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện
                các giao dịch mua bán hàng hóa theo quy định hiện hành của pháp
                luật Việt Nam.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
              <FiCreditCard className="mr-2" />
              3. Thanh toán an toàn và tiện lợi
            </h2>
            <div className="text-gray-700">
              <p className="mb-3">
                Người mua có thể tham khảo các phương thức thanh toán sau đây và
                lựa chọn áp dụng phương thức phù hợp:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">Cách 1:</h3>
                  <p>
                    Thanh toán trực tiếp (người mua nhận hàng tại địa chỉ người
                    bán)
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">Cách 2:</h3>
                  <p>Thanh toán sau (COD – giao hàng và thu tiền tận nơi)</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">Cách 3:</h3>
                  <p>Thanh toán online qua thẻ tín dụng, chuyển khoản</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
