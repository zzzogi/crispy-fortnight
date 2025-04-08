"use client";
// Trang liên hệ với bản đồ và form
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Reset form sau khi gửi
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Banner tiêu đề */}
      <div className="bg-amber-800 text-white py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">LIÊN HỆ</h1>
          <p className="mt-2">Kết nối với Thực phẩm Kim Vĩnh Vương</p>
        </div>
      </div>

      {/* Bản đồ Google */}
      <div className="w-full h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.666721195125!2d105.79943817503194!3d21.046017280607618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3d762822b1%3A0x939f7732eb3ad4ef!2zOTMgSG_DoG5nIFF14buRYyBWaeG7h3QsIE5naMSpYSDEkMO0LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1743867726646!5m2!1svi!2s"
          width="600"
          height="450"
          style={{
            border: 0,
            width: "100%",
            height: "100%",
          }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Thông tin liên hệ và form */}
      <div className="container mx-auto px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Thông tin liên hệ */}
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Thông Tin Liên Hệ
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Địa Chỉ</h3>
                  <p className="text-gray-700">
                    Số 9, ngách 4, ngõ 93, đường Hoàng Quốc Việt, phường Nghĩa
                    Đô, quận Cầu Giấy, TP Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    Số Điện Thoại
                  </h3>
                  <p className="text-gray-700">0935 388 699</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Email</h3>
                  <p className="text-gray-700">
                    thucphamkimvinhvuong@gmail.com
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                  <FaClock />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    Giờ Làm Việc
                  </h3>
                  <p className="text-gray-700">Thứ 2 - Thứ 7: 8:00 - 17:30</p>
                  <p className="text-gray-700">Chủ nhật: 8:00 - 12:00</p>
                </div>
              </div> */}
            </div>

            {/* Chi nhánh */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Chi Nhánh
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Nơi sản xuất
                    </h3>
                    <p className="text-gray-700">
                      Số 11, ngách 1, ngõ 117, đường Mỹ Độ, phường Mỹ Độ, TP Bắc
                      Giang
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-3 mr-4 text-amber-800">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Chi Nhánh TP.HCM
                    </h3>
                    <p className="text-gray-700">
                      456 Lê Lợi, Quận 1, TP. Hồ Chí Minh
                    </p>
                    <p className="text-gray-700">SĐT: 028 1234 5678</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Kết Nối Với Chúng Tôi
              </h2>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/tinhhoachelam"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-full transition-colors duration-300"
                >
                  <FaFacebookF size={20} />
                </a>
                {/* <a
                  href="#"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-full transition-colors duration-300"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-full transition-colors duration-300"
                >
                  <FaYoutube size={20} />
                </a> */}
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <p className="text-gray-700 mb-6">
              Bạn có câu hỏi hoặc đề xuất hợp tác? Hãy gửi tin nhắn cho chúng
              tôi, và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
            </p>

            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p>
                  Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi
                  trong thời gian sớm nhất.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-1">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-1">
                    Chủ Đề *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-1">
                  Tin Nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Gửi Tin Nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
