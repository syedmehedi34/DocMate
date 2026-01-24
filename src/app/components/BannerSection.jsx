"use client"; // ✅ Makes it a client component

import React from "react";
import BannerSlider from "./BannerSlider"; // Correct import

export default function BannerSection() {
  return (
    <div className="grid grid-cols-1 gap-2 p-2 w-full md:grid-cols-3">
      {/* Banner Slider Section */}
      <div className="md:col-span-2">
        <BannerSlider />
      </div>

      {/* Two Small Images */}
      <div className="md:col-span-1 flex flex-row md:flex-col gap-px md:gap-1">
        <img
          src="https://i.ibb.co.com/qYkBsgdW/three.jpg"
          alt="Banner Image 1"
          className="w-1/2 md:w-full h-32.5 md:h-62.5 object-cover"
        />
        <img
          src="https://i.ibb.co.com/YFtKNNYY/one.jpg"
          alt="Banner Image 2"
          className="w-1/2 md:w-full h-32.5 md:h-62.5 object-cover"
        />
      </div>
    </div>
  );
}
