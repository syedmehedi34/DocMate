"use client";

import Link from "next/link";
import { ChevronsRight } from "lucide-react";

const DoctorDetailsPageHeader = () => {
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
      </div>
    </div>
  );
};

export default DoctorDetailsPageHeader;
