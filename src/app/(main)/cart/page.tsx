"use client";
import { useCart } from "@/app/context/CartContext";
import { formatCurrency } from "@/app/utils/format";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Giỏ hàng | KIM VĨNH VƯƠNG</title>
        </Head>
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold text-amber-900 mb-8">Giỏ hàng</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-amber-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Link
              href="/products"
              className="bg-amber-700 hover:bg-amber-800 text-white py-3 px-6 rounded-md font-medium inline-flex items-center"
            >
              <span>Tiếp tục mua sắm</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Giỏ hàng ({totalItems}) | KIM VĨNH VƯƠNG</title>
      </Head>
      <div className="bg-gray-50">
        <div className="container mx-auto py-12 px-4 ">
          <h1 className="text-3xl font-bold text-amber-900 mb-8">
            Giỏ hàng của bạn
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                        Sản phẩm
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">
                        Giá
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">
                        Số lượng
                      </th>
                      <th className="py-4 px-6 text-right text-sm font-medium text-gray-500">
                        Thành tiền
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="relative h-20 w-20 flex-shrink-0">
                              {item.imageUrl && item.imageUrl.length > 0 ? (
                                <Image
                                  src={item.imageUrl[0]}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              ) : (
                                <div className="bg-gray-100 h-full w-full rounded"></div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Link
                                href={`/products/${item.id}`}
                                className="text-amber-900 hover:text-amber-700 font-medium"
                              >
                                {item.name}
                              </Link>
                              {item.label && (
                                <p className="text-xs text-gray-500">
                                  {item.label}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-gray-700">
                            {formatCurrency(item.price)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-md"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-amber-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-medium text-amber-700">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between">
                <Link
                  href="/products"
                  className="inline-flex items-center text-amber-700 hover:text-amber-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600">
                      Tổng tiền hàng ({totalItems} sản phẩm)
                    </span>
                    <span className="font-medium text-amber-700">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium text-amber-700">
                        Miễn phí
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Mã giảm giá"
                          className="py-2 px-3 text-gray-700 border border-gray-300 rounded-l text-sm w-full"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 rounded-r text-sm">
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-amber-900">Tổng thanh toán</span>
                    <span className="text-amber-700">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (session) {
                        router.push("/checkout");
                      } else {
                        alert(
                          "Vui lòng đăng nhập để thanh toán sản phẩm trong giỏ hàng."
                        );
                        router.push("/login?redirect=/checkout");
                      }
                    }}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
                  >
                    Thanh toán
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Chúng tôi chấp nhận
                  </h3>
                  <div className="flex space-x-2">
                    {/* <div className="p-2 border border-gray-200 rounded flex flex-col items-center">
                      <Image
                        src="/icons/cash-icon.png"
                        alt="Visa"
                        width={32}
                        height={20}
                        className="h-8 w-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">Tiền mặt</p>
                    </div> */}
                    <div className="p-2 border border-gray-200 rounded flex flex-col items-center">
                      <Image
                        src="/icons/qr-code-icon.png"
                        alt="Visa"
                        width={32}
                        height={20}
                        className="h-8 w-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">QR Pay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
