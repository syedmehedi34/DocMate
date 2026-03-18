import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, CalendarCheck, ArrowRight } from "lucide-react";

export default function Appointment() {
  return (
    <section
      className="relative bg-fixed bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/assets/doctor-bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-950/85" />

      {/* Top green accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 py-10">
        {/* ── Left: Text ── */}
        <div className="flex-1 max-w-xl">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Book an Appointment
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-[2rem] font-bold text-white leading-snug mb-4">
            More Specialists, Strong Partnerships,{" "}
            <span className="text-green-400">
              And The Power To Care You The Best!
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 text-sm md:text-[0.9rem] leading-relaxed mb-8 max-w-md">
            Bridging healthcare gaps with expert medical tourism — connecting
            patients to world-class treatment with trusted specialists.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/pages/alldoctors"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                         text-white text-sm font-semibold px-6 py-3 rounded-xl
                         transition-colors duration-200 shadow-md"
            >
              <CalendarCheck size={16} />
              Book An Appointment
            </Link>

            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-2 border border-white/15
                         hover:border-white/30 bg-white/5 hover:bg-white/10
                         text-white text-sm font-medium px-6 py-3 rounded-xl
                         transition-all duration-200"
            >
              <Phone size={15} className="text-green-400" />
              +880 1700-000000
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
            {[
              { value: "12+", label: "Years Experience" },
              { value: "1,200+", label: "Expert Doctors" },
              { value: "50k+", label: "Happy Patients" },
            ].map((b) => (
              <div key={b.label}>
                <p className="text-xl font-bold text-white">{b.value}</p>
                <p className="text-[0.68rem] text-gray-500 mt-0.5">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Doctor image ── */}
        <div className="relative w-72 h-96 md:w-85 md:h-110 shrink-0 self-end">
          {/* Glow behind doctor */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-green-600/20 rounded-full blur-3xl" />
          <Image
            src="/assets/doctor-image.png"
            alt="Doctor"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
