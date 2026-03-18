"use client";

import React, { useEffect } from "react";
import { Quote, Star, ArrowRight, MessageSquarePlus } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const reviews = [
  {
    text: "I was nervous about traveling for my spine surgery, but DocMate made the process so easy. The care I received was exceptional, and I'm now completely pain-free!",
    name: "Mr. Okoye",
    role: "Spine Surgery Patient",
    img: "https://i.ibb.co/tMz6zDkK/u1.jpg",
    rating: 5,
    tag: "Spine Surgery",
  },
  {
    text: "My knee replacement surgery was a success, and the costs were so much lower than in my home country. I'm so grateful to the entire DocMate team!",
    name: "Ms. Zainab",
    role: "Orthopedic Patient",
    img: "https://i.ibb.co/XrspSkbW/u2.jpg",
    rating: 5,
    tag: "Knee Replacement",
  },
  {
    text: "The cardiac care I received was world-class. The team was with me every step of the way, from my first consultation to my follow-up care.",
    name: "Jesmin Nipa",
    role: "Cardiac Patient",
    img: "https://i.ibb.co/vCgjx0bj/u3.jpg",
    rating: 5,
    tag: "Heart Surgery",
  },
  {
    text: "Traveling for surgery was a big decision, but DocMate made everything seamless. The medical team was attentive, and I recovered much quicker than expected.",
    name: "Dr. Emmanuel",
    role: "General Patient",
    img: "https://i.ibb.co/vCgjx0bj/u3.jpg",
    rating: 4,
    tag: "General Care",
  },
];

const StarRating = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        className={
          i < count
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </div>
);

const Review = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: false });
    const handleScroll = () => AOS.refresh();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[#f8faf9] py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ── Top header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          {/* Left label + heading */}
          <div data-aos="fade-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Patient Testimonials
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Trusted by Thousands of{" "}
              <span className="text-green-700">Happy Patients</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Real stories from patients who found world-class care through
              DocMate.
            </p>
          </div>

          {/* Right — overall rating badge */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="flex items-center gap-4 bg-white border border-green-100
                       rounded-2xl px-6 py-4 shadow-sm self-start md:self-auto shrink-0"
          >
            <div>
              <p className="text-4xl font-black text-gray-900 leading-none">
                4.9
              </p>
              <StarRating count={5} />
              <p className="text-[0.68rem] text-gray-400 mt-1">
                Based on 2,400+ reviews
              </p>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div className="text-center">
              <p className="text-2xl font-black text-green-700 leading-none">
                98%
              </p>
              <p className="text-[0.68rem] text-gray-400 mt-1 leading-snug">
                Would
                <br />
                recommend us
              </p>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* ── Review cards column 1+2 — 2 col masonry ── */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group bg-white border border-gray-100 rounded-2xl p-6
                           shadow-sm hover:shadow-md hover:border-green-100
                           transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <StarRating count={r.rating} />
                  <span
                    className="text-[0.65rem] font-semibold text-green-700
                                   bg-green-50 border border-green-100 px-2.5 py-1 rounded-full"
                  >
                    {r.tag}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                  "{r.text}"
                </p>

                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={r.img}
                        alt={r.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-100"
                      />
                      {/* verified dot */}
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                                       bg-green-500 rounded-full border-2 border-white"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-none">
                        {r.name}
                      </p>
                      <p className="text-[0.7rem] text-gray-400 mt-0.5">
                        {r.role}
                      </p>
                    </div>
                  </div>
                  <Quote
                    size={20}
                    className="text-green-200 group-hover:text-green-400 transition-colors duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Right CTA column ── */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-col gap-4 md:sticky md:top-24"
          >
            {/* Description card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase mb-3">
                Why Patients Trust Us
              </p>
              <p className="text-gray-800 font-bold text-lg leading-snug mb-3">
                Positive Reviews Appreciated by Our Happy Patients
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Thousands of patients have experienced world-class care through
                DocMate — from life-changing surgeries to compassionate support.
                Their success stories reflect our commitment to excellence.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { val: "10k+", label: "Patients Served" },
                  { val: "1,200+", label: "Expert Doctors" },
                  { val: "15+", label: "Partner Hospitals" },
                  { val: "12+", label: "Years Experience" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#f8faf9] rounded-xl px-4 py-3 text-center"
                  >
                    <p className="text-lg font-black text-green-700">{s.val}</p>
                    <p className="text-[0.65rem] text-gray-400 leading-snug mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <button
              className="flex items-center justify-center gap-2 w-full
                         bg-green-700 hover:bg-green-800 text-white
                         text-sm font-semibold px-6 py-3.5 rounded-xl
                         transition-colors duration-200 shadow-sm"
            >
              <MessageSquarePlus size={16} />
              Give Your Feedback
            </button>

            <a
              href="/all-reviews"
              className="flex items-center justify-center gap-2 w-full
                         border border-green-200 hover:border-green-400
                         bg-white hover:bg-green-50
                         text-green-700 text-sm font-semibold px-6 py-3.5 rounded-xl
                         transition-all duration-200"
            >
              See All Reviews
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
