"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  "Leading Edge Medical Technology",
  "High Standards & Safety at Hospital",
  "Certified Professionals in Health",
  "Specialists in Diseases & Diagnosis",
];

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className="bg-[#f8faf9] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3" data-aos="fade-up">
          <span className="w-8 h-0.5 bg-green-600 rounded-full" />
          <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
            About DocMate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 md:grid-rows-6 gap-3 md:h-130">
          {/* ── Short Image 1 ── */}
          <div
            className="md:col-span-2 md:row-span-3 rounded-2xl overflow-hidden shadow-sm"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <Image
              src="/assets/abouts-img1.jpg"
              alt="About Image 1"
              width={500}
              height={400}
              className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* ── Short Image 2 ── */}
          <div
            className="md:col-span-2 md:row-span-3 md:col-start-1 md:row-start-4 rounded-2xl overflow-hidden shadow-sm"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Image
              src="/assets/abouts-img1.jpg"
              alt="About Image 2"
              width={500}
              height={400}
              className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* ── Long / Tall Image ── */}
          <div
            className="md:col-span-2 md:row-span-6 md:col-start-3 md:row-start-1 rounded-2xl overflow-hidden shadow-sm"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <Image
              src="/assets/abouts-img2.jpg"
              alt="Long About Image"
              width={500}
              height={800}
              className="w-full h-56 md:h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* ── Text Content ── */}
          <div
            className="md:col-span-3 md:row-span-6 md:col-start-5 md:row-start-1
                       flex flex-col justify-center px-2 md:px-6 py-6 md:py-0"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2 className="text-2xl md:text-[1.75rem] font-bold text-gray-900 leading-snug mb-3">
              We Are Here To Hear & Help With{" "}
              <span className="text-green-700">Your Health Problems</span>
            </h2>

            <p className="text-gray-500 text-sm md:text-[0.9rem] leading-relaxed mb-6">
              We are a leading medical tourism facilitator in Bangladesh,
              providing patients with world-class healthcare at affordable
              prices — combining expertise, technology, and compassionate care.
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-7">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-gray-700"
                >
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Bottom row — experience badge + CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Experience badge */}
              <div className="flex items-center gap-3 bg-white border border-green-100 rounded-2xl px-5 py-3 shadow-sm">
                <div className="text-center">
                  <p className="text-4xl font-black text-green-700 leading-none">
                    12
                  </p>
                  <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                    Years of
                    <br />
                    Experience
                  </p>
                </div>
                <div className="w-px h-12 bg-green-100" />
                <p className="text-[0.72rem] text-gray-500 max-w-22.5 leading-snug">
                  Trusted by thousands of patients
                </p>
              </div>

              {/* CTA button */}
              <Link
                href="/pages/about"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800
                           text-white text-sm font-semibold px-6 py-3 rounded-xl
                           transition-colors duration-200 shadow-sm"
              >
                More About Us
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
