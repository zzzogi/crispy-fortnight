"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Imperial_Script } from "next/font/google";

const imperial_script = Imperial_Script({
  subsets: ["vietnamese"],
  weight: "400",
});

const images = [
  {
    src: "/slider/image-1.jpg",
    title: "Chè lam vị truyền thống",
  },
  {
    src: "/slider/image-2.jpg",
    title: "Hộp quà tặng cao cấp",
  },
  {
    src: "/slider/image-3.jpg",
    title: "Món ngon từ thiên nhiên",
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-end p-6">
              <h2
                className={`${imperial_script.className} text-white text-3xl sm:text-4xl md:text-5xl font-semibold text-center`}
              >
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
