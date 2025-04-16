"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDropdown() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex items-center hover:text-amber-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaShoppingCart className="cursor-pointer hover:text-amber-100 transition duration-300" />

        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              Giỏ hàng ({totalItems})
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Giỏ hàng của bạn đang trống
              </div>
            ) : (
              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 border-b border-gray-100 flex"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0">
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

                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-1 flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-xs text-amber-900 border-r border-gray-200"
                          >
                            -
                          </button>
                          <span className="px-2 text-sm text-amber-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-xs text-amber-900 border-l border-gray-200"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-medium text-amber-700">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between mb-4">
                <span className="font-medium text-amber-900">Tổng tiền:</span>
                <span className="font-bold text-amber-700">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  href="/cart"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Xem giỏ hàng
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Thanh toán
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
