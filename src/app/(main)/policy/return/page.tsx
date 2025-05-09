// app/policies/return/page.tsx
"use client";

import Link from "next/link";
import React from "react";
import { FiBox, FiCalendar, FiPhoneCall } from "react-icons/fi";

const ReturnPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <nav className="mb-6 flex">
          <Link href="/" className="text-amber-600 hover:text-amber-800">
            Trang chủ
          </Link>
          <span className="mx-2 text-amber-400">/</span>
          <span className="text-amber-800">Chính sách đổi trả</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6 border-b border-amber-200 pb-3">
            CHÍNH SÁCH ĐỔI TRẢ
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
              <FiBox className="mr-2" />
              1. Điều kiện đổi trả
            </h2>
            <p className="mb-4 text-gray-700">
              Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi
              hàng/ trả lại hàng ngay tại thời điểm giao/nhận hàng trong những
              trường hợp sau:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc
                như trên website tại thời điểm đặt hàng.
              </li>
              <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
              <li>
                Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể
                vỡ…
              </li>
            </ul>
            <p className="text-gray-700">
              Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự
              thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
              <FiCalendar className="mr-2" />
              2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả
            </h2>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                Thời gian thông báo đổi trả: trong vòng 48h kể từ khi nhận sản
                phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc
                bể vỡ.
              </li>
              <li>
                Thời gian gửi chuyển trả sản phẩm: trong vòng 14 ngày kể từ khi
                nhận sản phẩm.
              </li>
              <li>
                Địa điểm đổi trả sản phẩm: Khách hàng có thể mang hàng trực tiếp
                đến văn phòng/ cửa hàng của chúng tôi hoặc chuyển qua đường bưu
                điện.
              </li>
            </ul>
            <div className="bg-amber-100 p-4 rounded-md border-l-4 border-amber-500">
              <p className="text-amber-800 flex items-center">
                <FiPhoneCall className="mr-2" />
                Trong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại
                liên quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên
                hệ đường dây chăm sóc khách hàng của chúng tôi.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
