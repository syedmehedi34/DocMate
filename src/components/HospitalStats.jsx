"use client";

import React, { useEffect, useState, useRef } from "react";
import { Award, Hospital, BedDouble, Stethoscope } from "lucide-react";

const stats = [
  {
    icon: <Award size={22} />,
    target: 15,
    suffix: "+",
    label: "Partner Hospitals",
    sub: "Across Bangladesh",
  },
  {
    icon: <Hospital size={22} />,
    target: 10000,
    suffix: "+",
    label: "Satisfied Patients",
    sub: "And growing every day",
  },
  {
    icon: <BedDouble size={22} />,
    target: 750,
    suffix: "+",
    label: "Hospital Rooms",
    sub: "Modern & well-equipped",
  },
  {
    icon: <Stethoscope size={22} />,
    target: 450,
    suffix: "+",
    label: "Doctors & Staff",
    sub: "Certified professionals",
  },
];

/* ── Animated counter ── */
const Counter = ({ target, suffix, duration = 2000, startCounting }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = target / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.ceil(start));
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);

  return (
    <span className="text-3xl md:text-4xl font-black text-gray-900 leading-none tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ── Main section ── */
const HospitalStats = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Card container */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-100
                        border-2 border-gray-100 rounded-2xl overflow-hidden bg-[#f8faf9] shadow-sm"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center
                         px-6 py-10 group hover:bg-green-50 transition-colors duration-300"
            >
              {/* Icon circle */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl
                              bg-green-100 text-green-700 mb-5
                              group-hover:bg-green-700 group-hover:text-white
                              transition-colors duration-300"
              >
                {stat.icon}
              </div>

              {/* Number */}
              <Counter
                target={stat.target}
                suffix={stat.suffix}
                startCounting={visible}
              />

              {/* Label */}
              <p className="text-sm font-semibold text-gray-700 mt-2 leading-snug">
                {stat.label}
              </p>

              {/* Sub label */}
              <p className="text-[0.7rem] text-gray-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HospitalStats;
