"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const images = [
  { src: "https://i.ibb.co.com/cK3xXQS4/two.png", alt: "Partner 1" },
  { src: "https://i.ibb.co.com/NdBtxRjy/three.png", alt: "Partner 2" },
  { src: "https://i.ibb.co.com/0pmZP6Nm/ten.jpg", alt: "Partner 3" },
  { src: "https://i.ibb.co.com/VWLm75vm/six.png", alt: "Partner 4" },
  { src: "https://i.ibb.co.com/dwkC100s/seven.png", alt: "Partner 5" },
  { src: "https://i.ibb.co.com/JRSDSWkq/one.jpg", alt: "Partner 6" },
  { src: "https://i.ibb.co.com/v6pVWBvK/nine.jpg", alt: "Partner 7" },
  { src: "https://i.ibb.co.com/fGCqgf8H/five.png", alt: "Partner 8" },
  { src: "https://i.ibb.co.com/N64VtvyN/eight.jpg", alt: "Partner 9" },
  { src: "https://i.ibb.co.com/x8cvsHWQ/four.jpg", alt: "Partner 10" },
];

const OurCommunity = () => {
  return (
    <section className="bg-white py-16 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-green-600 rounded-full" />
            <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
              Trusted Partners
            </p>
            <span className="w-8 h-0.5 bg-green-600 rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our <span className="text-green-700">Community</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-sm">
            Partnered with leading hospitals and medical institutions worldwide.
          </p>
        </div>

        {/* ── Marquee row 1 — left to right ── */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <Marquee pauseOnHover speed={40} gradient={false}>
            {images.map((img, i) => (
              <div
                key={i}
                className="mx-4 flex items-center justify-center
                           h-16 w-36 md:h-20 md:w-44
                           bg-[#f8faf9] hover:bg-green-50
                           border border-gray-100 hover:border-green-200
                           rounded-xl px-5 py-3
                           transition-all duration-300 cursor-pointer group
                           shadow-none hover:shadow-sm"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* ── Marquee row 2 — right to left ── */}
        <div className="relative mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <Marquee pauseOnHover speed={30} direction="right" gradient={false}>
            {[...images].reverse().map((img, i) => (
              <div
                key={i}
                className="mx-4 flex items-center justify-center
                           h-16 w-36 md:h-20 md:w-44
                           bg-[#f8faf9] hover:bg-green-50
                           border border-gray-100 hover:border-green-200
                           rounded-xl px-5 py-3
                           transition-all duration-300 cursor-pointer group
                           shadow-none hover:shadow-sm"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default OurCommunity;
