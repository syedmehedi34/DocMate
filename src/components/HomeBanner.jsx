"use client";

import React from "react";
import Image from "next/image";
import BannerSlider from "./BannerSlider";
import { CalendarCheck, Star, Users } from "lucide-react";

const stats = [
  { icon: <Users size={14} />, value: "1,200+", label: "Doctors" },
  { icon: <CalendarCheck size={14} />, value: "50k+", label: "Appointments" },
  { icon: <Star size={14} />, value: "4.9", label: "Avg. Rating" },
];

const sideImages = [
  {
    src: "https://i.ibb.co.com/qYkBsgdW/three.jpg",
    alt: "Doctor consultation",
    title: "Specialist Doctors",
    sub: "Book in 60 seconds",
  },
  {
    src: "https://i.ibb.co.com/YFtKNNYY/one.jpg",
    alt: "Medical care",
    title: "24/7 Care Available",
    sub: "Emergency support",
  },
];

export default function HomeBanner() {
  return (
    <section className="bg-[#f8faf9] px-3 pt-10 pb-3 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2.5 md:h-140">
        {/* ── Main Slider ── */}
        <div className="relative md:col-span-2 rounded-2xl overflow-hidden h-75 md:h-full shadow-md">
          <BannerSlider />

          {/* Floating stats pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-white/90 backdrop-blur-md border border-black/[0.07] rounded-full shadow-lg px-1.5 py-2 whitespace-nowrap">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-2 px-4 ${
                  i !== 0 ? "border-l border-black/10" : ""
                }`}
              >
                <div className="flex items-center justify-center w-6.5 h-6.5 rounded-lg bg-green-100 text-green-700 shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-[0.82rem] font-bold text-gray-900 leading-none">
                    {s.value}
                  </p>
                  <p className="text-[0.68rem] text-gray-400 leading-none mt-0.75">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Side Images ── */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2.5">
          {sideImages.map((img) => (
            <div
              key={img.alt}
              className="relative flex-1 h-37.5 md:h-full rounded-2xl overflow-hidden shadow-md group cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-3.5 left-3.5 z-10">
                <p className="text-[0.82rem] font-semibold text-white leading-snug">
                  {img.title}
                </p>
                <p className="flex items-center gap-1.5 text-[0.68rem] text-white/70 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  {img.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
