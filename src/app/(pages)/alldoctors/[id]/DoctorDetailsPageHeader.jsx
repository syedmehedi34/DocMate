"use client";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";

const DoctorDetailsPageHeader = ({ doctor }) => {
  return (
    <div
      className="relative h-72 md:h-80"
      style={{
        backgroundImage: "url('/all-doc-header-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-950/72" />
      {/* Top green accent */}
      <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

      <section className="h-full relative z-10 max-w-7xl mx-auto px-4 flex flex-col justify-center">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs mb-5">
          <Link
            href="/"
            className="text-green-400 font-semibold hover:text-green-300 transition-colors"
          >
            Home
          </Link>
          <ChevronsRight className="w-3.5 h-3.5 text-green-500" />
          <Link
            href="/pages/alldoctors"
            className="text-green-400 font-semibold hover:text-green-300 transition-colors"
          >
            All Doctors
          </Link>
          <ChevronsRight className="w-3.5 h-3.5 text-green-500" />
          <span className="text-gray-300 font-medium truncate max-w-50">
            {doctor?.name}
          </span>
        </div>

        {/* Pill label */}
        <div
          className="inline-flex items-center gap-2 bg-green-500/12 border border-green-500/25
                        rounded-full px-3 py-1 mb-3 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-green-400 text-[0.65rem] font-semibold tracking-widest uppercase">
            Doctor Profile & Booking
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
          {doctor?.name}
        </h1>
        <p className="text-gray-400 text-sm mt-2 capitalize">
          {doctor?.doctorCategory} Specialist
        </p>
      </section>
    </div>
  );
};

export default DoctorDetailsPageHeader;
