"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { ArrowRight, Phone, Mail, MoveRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const services = [
  {
    img: "/assets/cancer.png",
    title: "Oncology Treatment",
    desc: "Advanced oncology care with top specialists and cutting-edge technology.",
  },
  {
    img: "/assets/bone.png",
    title: "Spine Surgery",
    desc: "Advanced treatment for spinal disorders with expert surgeons.",
  },
  {
    img: "/assets/liver.png",
    title: "Organ Transplant",
    desc: "Life-saving transplants with top specialists and world-class facilities.",
  },
  {
    img: "/assets/heartbeat.png",
    title: "Heart Surgery",
    desc: "Advanced cardiac care with top surgeons and world-class hospitals.",
  },
  {
    img: "/assets/neuron.png",
    title: "Neuro Surgery",
    desc: "Cutting-edge brain and spine treatments by expert neurosurgeons.",
  },
  {
    img: "/assets/arthritis.png",
    title: "Orthopedic Surgery",
    desc: "Expert care for joint and bone treatments with top surgeons.",
  },
];

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: false });
    const handleScroll = () => AOS.refresh();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-white pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Top header row ── */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
          data-aos="fade-up"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Health Facilities
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Explore Our Medical{" "}
              <span className="text-green-700">Departments</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Find world-class treatments across specialties, ensuring the best
              care for your needs.
            </p>
          </div>
          <Link
            href="/pages/alldoctors"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800
                       text-white text-sm font-semibold px-5 py-2.5 rounded-xl
                       transition-colors duration-200 shadow-sm self-start md:self-auto shrink-0"
          >
            View All Departments
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ── Service cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 60}
              className="group flex items-start gap-4 bg-[#f8faf9] hover:bg-white
                         border border-transparent hover:border-green-100
                         rounded-2xl p-5 shadow-none hover:shadow-md
                         transition-all duration-300 cursor-pointer"
            >
              {/* Icon box */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl
                              bg-green-50 border border-green-100 shrink-0
                              group-hover:bg-green-100 transition-colors duration-200"
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[0.92rem] font-bold text-gray-900 mb-1">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                  {service.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-green-700 text-xs
                                 font-semibold mt-2 opacity-0 group-hover:opacity-100
                                 -translate-x-1 group-hover:translate-x-0
                                 transition-all duration-200"
                >
                  Learn more <MoveRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom contact card ── */}
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-2xl bg-gray-950 px-8 py-10
                     flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* BG image overlay */}
          <div className="absolute inset-0 bg-[url('/assets/abouts-img1.jpg')] bg-cover bg-center opacity-10" />
          {/* Green glow */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-green-600/20 rounded-full blur-3xl" />
          <div className="absolute right-20 top-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl" />

          {/* Left text */}
          <div className="relative z-10">
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-2">
              Need Immediate Help?
            </p>
            <h3 className="text-white text-xl md:text-2xl font-bold leading-snug">
              Speak to a Medical Expert
            </h3>
            <p className="text-gray-400 text-sm mt-1.5 max-w-xs">
              Our specialists are available around the clock for your health
              concerns.
            </p>
          </div>

          {/* Right contact pills */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+880123456789"
              className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10
                         border border-white/10 hover:border-green-500/40
                         text-white text-sm font-medium px-5 py-3 rounded-xl
                         transition-all duration-200"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/15">
                <Phone size={14} className="text-green-400" />
              </div>
              +880 1234-56789
            </a>
            <a
              href="mailto:info@docmate.com"
              className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10
                         border border-white/10 hover:border-green-500/40
                         text-white text-sm font-medium px-5 py-3 rounded-xl
                         transition-all duration-200"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/15">
                <Mail size={14} className="text-green-400" />
              </div>
              info@docmate.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
