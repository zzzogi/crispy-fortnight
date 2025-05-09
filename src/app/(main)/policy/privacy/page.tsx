// app/policies/privacy/page.tsx
"use client";

import React from "react";
import { FiShield, FiLock, FiInfo } from "react-icons/fi";
import Link from "next/link";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <nav className="mb-6 flex">
          <Link href="/" className="text-amber-600 hover:text-amber-800">
            Trang chủ
          </Link>
          <span className="mx-2 text-amber-400">/</span>
          <span className="text-amber-800">Chính sách bảo mật</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6 border-b border-amber-200 pb-3 flex items-center">
            <FiShield className="mr-3" /> CHÍNH SÁCH BẢO MẬT
          </h1>

          <section className="mb-8">
            <div className="space-y-4 text-gray-700">
              <p>
                Chính sách bảo mật này nhằm giúp Quý khách hiểu về cách website
                thu thập và sử dụng thông tin cá nhân của mình thông qua việc sử
                dụng trang web, bao gồm mọi thông tin có thể cung cấp thông qua
                trang web khi Quý khách đăng ký tài khoản, đăng ký nhận thông
                tin liên lạc từ chúng tôi, hoặc khi Quý khách mua sản phẩm, dịch
                vụ, yêu cầu thêm thông tin dịch vụ từ chúng tôi.
              </p>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <FiInfo className="mr-2" /> Sử dụng thông tin
                </h3>
                <p>
                  Chúng tôi sử dụng thông tin cá nhân của Quý khách để liên lạc
                  khi cần thiết liên quan đến việc Quý khách sử dụng website của
                  chúng tôi, để trả lời các câu hỏi hoặc gửi tài liệu và thông
                  tin Quý khách yêu cầu.
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <FiLock className="mr-2" /> Bảo mật thông tin
                </h3>
                <p>
                  Trang web của chúng tôi coi trọng việc bảo mật thông tin và sử
                  dụng các biện pháp tốt nhất để bảo vệ thông tin cũng như việc
                  thanh toán của khách hàng.
                </p>
              </div>

              <p className="bg-amber-100 p-4 rounded-md border-l-4 border-amber-500 font-medium">
                Mọi thông tin giao dịch sẽ được bảo mật ngoại trừ trong trường
                hợp cơ quan pháp luật yêu cầu.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
