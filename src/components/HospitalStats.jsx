"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaMedal, FaHospital, FaUsers, FaUserMd } from "react-icons/fa";

// Counter component
const Counter = ({ target, duration = 2000, startCounting }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return; // যদি scroll না আসে, count হবে না

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

  return <h3 className="text-3xl font-bold text-gray-800">{count}+</h3>;
};

const HospitalStats = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target); // একবার observer remove
          }
        });
      },
      { threshold: 0.5 }, // section এর 50% visible হলে trigger
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-w-screen-xl mx-5 md:mx-auto my-20 bg-gray-100 py-12"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center text-center space-y-8 md:space-y-0 md:space-x-12">
          {/* Card 1 */}
          <div className="flex-1">
            <FaMedal className="text-5xl text-teal-500 mx-auto mb-2" />
            <Counter target={15} startCounting={visible} />
            <p className="text-gray-600">PARTNER HOSPITALS</p>
          </div>

          <div className="hidden md:block w-px h-24 bg-gray-300"></div>

          {/* Card 2 */}
          <div className="flex-1">
            <FaHospital className="text-5xl text-teal-500 mx-auto mb-2" />
            <Counter target={10000} startCounting={visible} />
            <p className="text-gray-600">SATISFIED PATIENTS</p>
          </div>

          <div className="hidden md:block w-px h-24 bg-gray-300"></div>

          {/* Card 3 */}
          <div className="flex-1">
            <FaUsers className="text-5xl text-teal-500 mx-auto mb-2" />
            <Counter target={750} startCounting={visible} />
            <p className="text-gray-600">HOSPITAL ROOMS</p>
          </div>

          <div className="hidden md:block w-px h-24 bg-gray-300"></div>

          {/* Card 4 */}
          <div className="flex-1">
            <FaUserMd className="text-5xl text-teal-500 mx-auto mb-2" />
            <Counter target={450} startCounting={visible} />
            <p className="text-gray-600">QUALIFIED DOCTORS & STAFF</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalStats;
