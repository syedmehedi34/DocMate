"use client";

import Link from "next/link";
import { ChevronsRight } from "lucide-react";

const AllDoctorsHeader = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div
      className="relative h-80 text-black mb-16 md:mb-8"
      style={{
        backgroundImage: "url('/all-doc-header-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gray-200/15 backdrop-blur-xs"></div>

      <div className="h-full relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="h-full flex flex-col justify-center text-[#122B2B]">
          <h1 className="text-[50px] font-bold mb-3">Our Doctors</h1>

          <div className="flex items-center gap-2 text-[16px] mb-14">
            <Link href="/" className="hover:font-extrabold">
              <span className="text-[#93C249] font-bold">Home</span>
            </Link>
            <ChevronsRight className="w-5 h-5 text-[#93C249]" />
            <span className="font-semibold">Our Doctors</span>
          </div>
        </div>

        {/* Search & Filter Box */}
        <div className="border border-[#93C249]/30 shadow-xl p-4 rounded-2xl bg-white/5 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-3xl">
          <div className="bg-white rounded-xl p-5">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered w-full"
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
