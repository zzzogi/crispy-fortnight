"use client";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { use } from "react";

const ThankYouPage = ({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) => {
  const { totalItems, totalPrice } = useCart();

  // Optional: Extract order information from URL parameters
  const { orderCode } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            {/* Success icon */}
            <div className="h-24 w-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Thank you message */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              Cảm ơn bạn đã đặt hàng!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              {orderCode && <span> Mã đơn hàng của bạn là #{orderCode}.</span>}
            </p>

            {/* Order details summary */}
            {totalItems > 0 && (
              <div className="border-t border-b border-gray-200 py-4 mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tổng sản phẩm:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Tổng thanh toán:</span>
                  <span>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Information about next steps */}
            <div className="text-left mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-3">
                Các bước tiếp theo
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Bạn sẽ nhận được email hoặc cuộc gọi xác nhận đơn hàng trong
                  thời gian sớm nhất.
                </li>
                <li>Chúng tôi sẽ chuẩn bị và đóng gói sản phẩm của bạn.</li>
                <li>Đơn hàng sẽ được vận chuyển trong 1-3 ngày làm việc.</li>
                <li>
                  Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản của
                  mình.
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-800 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>

        {/* Contact information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với
            chúng tôi qua{" "}
            <Link
              href="/contact"
              className="font-medium text-amber-800 hover:text-amber-700"
            >
              trang liên hệ
            </Link>{" "}
            hoặc gọi <span className="font-medium">0935 388 699</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
