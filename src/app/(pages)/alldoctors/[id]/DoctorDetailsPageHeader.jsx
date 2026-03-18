"use client";

import Link from "next/link";
import { ChevronsRight } from "lucide-react";

const DoctorDetailsPageHeader = ({ doctor }) => {
  return (
    <>
      <div
        className="relative h-96 text-black mb-16 md:mb-8"
        style={{
          backgroundImage: "url('/all-doc-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>

        <section className="h-full relative z-10 max-w-7xl mx-auto px-4 py-10">
          <div className="h-full flex flex-col justify-center text-[#003367]">
            <h1 className="text-[55px] font-bold mb-3">
              {doctor?.name} - <br />
              <span>Booking</span>
            </h1>

            <div className="flex items-center gap-2 text-[16px] mb-14">
              <Link href="/" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">Home</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <Link href="/alldoctors" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">All Doctors</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <span className="text-[#003367] font-semibold">
                {doctor?.name} - Booking
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DoctorDetailsPageHeader;
