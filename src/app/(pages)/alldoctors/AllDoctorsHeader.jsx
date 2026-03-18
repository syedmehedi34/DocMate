"use client";

import Link from "next/link";
import { ChevronsRight, Search, SlidersHorizontal } from "lucide-react";

const AllDoctorsHeader = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div
      className="relative h-72 md:h-80 mb-20 md:mb-16"
      style={{
        backgroundImage: "url('/all-doc-header-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-950/72" />
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

      {/* Hero text */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center pt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs mb-4">
          <Link
            href="/"
            className="text-green-400 font-semibold hover:text-green-300 transition-colors"
          >
            Home
          </Link>
          <ChevronsRight className="w-3.5 h-3.5 text-green-500" />
          <span className="text-gray-300 font-medium">Our Doctors</span>
        </div>

        {/* Heading */}
        <div
          className="inline-flex items-center gap-2 bg-green-500/12 border border-green-500/25
                        rounded-full px-3 py-1 mb-3 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-green-400 text-[0.65rem] font-semibold tracking-widest uppercase">
            Expert Medical Professionals
          </p>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Our <span className="text-green-400">Doctors</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Find and book certified specialists across all medical departments.
        </p>
      </div>

      {/* Search & Filter card — floated */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                      w-[calc(100%-2rem)] max-w-3xl z-20"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search input */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                placeholder="Doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f8faf9] border border-gray-200
                           rounded-xl outline-none focus:border-green-400 focus:ring-2
                           focus:ring-green-100 transition-all duration-200 text-gray-700
                           placeholder-gray-400"
              />
            </div>

            {/* Category select */}
            <div className="relative">
              <SlidersHorizontal
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f8faf9] border border-gray-200
                           rounded-xl outline-none focus:border-green-400 focus:ring-2
                           focus:ring-green-100 transition-all duration-200 text-gray-700
                           appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDoctorsHeader;
