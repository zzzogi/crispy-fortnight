"use client";
import { useCart } from "@/app/context/CartContext";
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
} from "@/app/types/checkout-types";
import { PayOSConfig, usePayOS } from "@payos/payos-checkout";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Checkout = () => {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [showPaymentInterface, setShowPaymentInterface] = useState(false);
  const [paymentData, setPaymentData] =
    useState<CheckoutResponseDataType | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const orderSubmitted = useRef(false);

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
  });

  // Configure PayOS
  const payOSConfig: PayOSConfig = {
    RETURN_URL: `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/thank-you`,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: checkoutUrl,
    embedded: true,
    onSuccess: () => {
      handleCompletePayment();
    },
    onExit: () => {
      setShowPaymentInterface(false);
    },
    onCancel: () => {
      setShowPaymentInterface(false);
    },
  };

  const { exit, open } = usePayOS(payOSConfig);

  // Effect to open PayOS when checkoutUrl changes
  useEffect(() => {
    if (checkoutUrl && showPaymentInterface) {
      // Check if the element exists before trying to open PayOS
      const paymentContainer = document.getElementById(
        "embedded-payment-container"
      );
      if (paymentContainer) {
        // Small delay to ensure DOM is fully ready
        const timer = setTimeout(() => {
          open();
        }, 300); // Increased delay to give more time
        return () => clearTimeout(timer);
      }
    }
  }, [checkoutUrl, showPaymentInterface, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // if not number, return
    if (name === "buyerPhone" && isNaN(Number(value))) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPayment = async () => {
    const orderCode = Math.floor(Math.random() * 1000000);

    const requestData: CheckoutRequestType = {
      orderCode,
      amount: totalPrice,
      description: `Đơn hàng #${orderCode}`,
      cancelUrl: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/cart`,
      returnUrl: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/thank-you`,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      ...formData,
    };

    const response = await fetch("/api/create-embedded-payment-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment link");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (data: CheckoutResponseDataType) => {
      setPaymentData(data);
      setCheckoutUrl(data.checkoutUrl);
      setShowPaymentInterface(true);
    },
  });

  // Create a new mutation for sending order to API
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      // Check if order has already been submitted
      if (orderSubmitted.current) {
        console.log("Order already submitted, preventing duplicate submission");
        return { status: "already_submitted" };
      }

      // Check if cart is empty
      if (items.length === 0 || totalPrice === 0) {
        throw new Error("Cart is empty");
      }

      // Mark as submitted before making the API call
      orderSubmitted.current = true;

      const orderData = {
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        buyerAddress: formData.buyerAddress,
        products: items, // Pass the entire items array instead of mapping
        totalPrice: totalPrice,
      };

      console.log("Sending order data:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        // If there's an error, reset the submission flag so user can try again
        orderSubmitted.current = false;
        throw new Error("Failed to create order");
      }

      return response.json();
    },
    onSuccess: () => {
      clearCart();
      router.push("/thank-you");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      // Still redirect to thank you page even if order creation fails
      // You might want to handle this differently in production
      clearCart();
      router.push("/thank-you");
    },
  });

  const handleTogglePayment = () => {
    if (showPaymentInterface) {
      exit();
      setShowPaymentInterface(false);
    } else if (paymentData) {
      setCheckoutUrl(paymentData.checkoutUrl);
      setShowPaymentInterface(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleCompletePayment = () => {
    // Only proceed if order hasn't been submitted yet
    if (!orderSubmitted.current) {
      createOrderMutation.mutate();
    } else {
      console.log("Payment completed but order already submitted");
      clearCart();
      router.push("/thank-you");
    }
  };

  // Reset the order submitted flag when component unmounts
  useEffect(() => {
    return () => {
      orderSubmitted.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900">Thanh toán</h1>
          <p className="mt-2 text-lg text-gray-600">
            Hoàn tất thông tin để tiến hành thanh toán
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Thông tin đơn hàng
            </h2>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex items-start">
                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden relative">
                    <Image
                      src={item.imageUrl[0] || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-700">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description.substring(0, 60)}...
                    </p>
                  </div>
                  <p className="ml-4 text-sm font-medium text-gray-900">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Tổng sản phẩm:</p>
                <p>{totalItems}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                <p>Tổng tiền:</p>
                <p>
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form or Payment Interface */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            {!showPaymentInterface ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Thông tin khách hàng
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="buyerName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Họ và tên
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="buyerName"
                          name="buyerName"
                          value={formData.buyerName}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 px-2 text-gray-700"
                          placeholder="Nhập họ và tên"
                          maxLength={50}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="buyerEmail"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="buyerEmail"
                          name="buyerEmail"
                          value={formData.buyerEmail}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 px-2 text-gray-700"
                          placeholder="Nhập email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="buyerPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Số điện thoại
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="buyerPhone"
                          name="buyerPhone"
                          value={formData.buyerPhone}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 p-2 text-gray-700"
                          placeholder="Nhập số điện thoại"
                          maxLength={12}
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="buyerAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Địa chỉ giao hàng
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="buyerAddress"
                          name="buyerAddress"
                          rows={3}
                          value={formData.buyerAddress}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-24 p-2 text-gray-700"
                          placeholder="Nhập địa chỉ giao hàng"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full bg-amber-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      disabled={
                        mutation.isPending || createOrderMutation.isPending
                      }
                    >
                      {mutation.isPending || createOrderMutation.isPending
                        ? "Đang xử lý..."
                        : "Thanh toán"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Thanh toán đơn hàng</h2>
                  <button
                    type="button"
                    onClick={handleTogglePayment}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Đóng
                  </button>
                </div>

                {/* PayOS Embedded Payment Container */}
                <div
                  id="embedded-payment-container"
                  className="w-full h-96 border rounded-md"
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
