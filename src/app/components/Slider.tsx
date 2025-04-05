"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  {
    src: "/images/slider1.jpg",
    title: "Mẫu chè lam 3 vị đựng giỏ tre",
  },
  {
    src: "/images/slider2.jpg",
    title: "Hộp quà tặng cao cấp 2024",
  },
  {
    src: "/images/slider3.jpg",
    title: "Chè lam vị truyền thống",
  },
];

export default function ImageSlider() {
  const [swiperRef, setSwiperRef] = useState<any>(null);

  return (
    <div className="relative w-full">
      {/* SLIDER */}
      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={setSwiperRef}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        navigation={false}
        className="relative"
      >
        {images.map((item, index) => (
          <SwiperSlide key={index} className="relative">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
              <h2 className="text-white text-2xl font-bold text-center">
                {item.title}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* BUTTONS */}
      <button
        onClick={() => swiperRef?.slidePrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => swiperRef?.slideNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
