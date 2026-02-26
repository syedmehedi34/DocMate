"use client";

import React from "react";
import Image from "next/image";
import BannerSlider from "./BannerSlider";

export default function HomeBanner() {
  return (
    <div className="grid grid-cols-1 gap-2 p-2 w-full md:grid-cols-3">
      {/* Banner Slider Section */}
      <div className="md:col-span-2">
        <BannerSlider />
      </div>

      {/* Two Small Images */}
      <div className="md:col-span-1 flex flex-row md:flex-col gap-px md:gap-1">
        <div className="relative w-1/2 md:w-full h-32.5 md:h-62.5">
          <Image
            src="https://i.ibb.co.com/qYkBsgdW/three.jpg"
            alt="Banner Image 1"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative w-1/2 md:w-full h-32.5 md:h-62.5">
          <Image
            src="https://i.ibb.co.com/YFtKNNYY/one.jpg"
            alt="Banner Image 2"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
