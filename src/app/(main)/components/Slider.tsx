/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Imperial_Script } from "next/font/google";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

const imperial_script = Imperial_Script({
  subsets: ["vietnamese"],
  weight: "400",
});

// Define the banner type
interface Banner {
  banners: {
    id: string;
    imageUrl: string;
    caption: string;
  }[];
}

// Function to fetch banners from API
const fetchBanners = async (): Promise<Banner> => {
  const response = await fetch("/api/banners");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// Fallback images in case API fails
const fallbackImages = [
  {
    imageUrl: "/slider/image-1.jpg",
    caption: "Chè lam vị truyền thống",
  },
  {
    imageUrl: "/slider/image-2.jpg",
    caption: "Hộp quà tặng cao cấp",
  },
  {
    imageUrl: "/slider/image-3.jpg",
    caption: "Món ngon từ thiên nhiên",
  },
];

export default function ImageSlider() {
  const [swiperRef, setSwiperRef] = useState<any>(null);

  // Use React Query to fetch banners
  const {
    data: banners,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  // Display a loading state while fetching data
  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  // Use fallback images if there was an error or if no banners were returned
  const displayImages =
    isError || !banners || banners.banners.length === 0
      ? fallbackImages
      : banners.banners;

  console.log("Banners:", displayImages);
  return (
    <div className="relative w-full h-[600px]">
      {/* SLIDER */}
      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={setSwiperRef}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        navigation={false}
        className="relative"
      >
        {displayImages.map((item, index) => (
          <SwiperSlide key={index} className="relative">
            <Image
              src={item.imageUrl}
              alt={item.caption}
              className="w-full h-[600px] object-cover"
              width={1920}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-end p-6">
              <h2
                className={`${imperial_script.className} text-white text-3xl sm:text-4xl md:text-5xl font-semibold text-center`}
              >
                {item.caption}
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
