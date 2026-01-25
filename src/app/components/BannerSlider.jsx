"use client";

import React from "react";
import Image from "next/image";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function BannerSlider() {
  return (
    <div className="w-full bg-gray-100">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{ delay: 1800, disableOnInteraction: false }}
        className="h-[250px] md:h-[500px]" // Set explicit height
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src="https://i.ibb.co.com/vxZyhmc5/three-1.png"
              alt="Slide 1"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src="https://i.ibb.co.com/WNcXBdsf/two-1.png"
              alt="Slide 2"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src="https://i.ibb.co.com/CKFMNVWn/one-1.png"
              alt="Slide 3"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
