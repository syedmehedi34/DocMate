"use client";

import React, { useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Review = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="max-w-screen-xl md:mx-auto my-20 mx-5">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Our Reviews</h2>
        <p className="text-gray-600 mt-2">
          Hear from our happy patients and their experiences
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center items-start">
        {/* Left side div */}
        <div className="flex flex-col gap-10" data-aos="fade-up">
          {/* First Review */}
          <div
            className="flex flex-col bg-gray-50 shadow-xl p-5 rounded-md mb-5"
            data-aos="fade-up"
          >
            <p className="text-justify">
              “I was nervous about traveling to India for my spine surgery, but
              MedExpert India made the process so easy. The care I received was
              exceptional, and I’m now pain-free!”
            </p>

            <div className="flex my-7 items-center">
              <img
                src="https://i.ibb.co/tMz6zDkK/u1.jpg"
                alt="patient"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col ml-4">
                <p className="text-base font-semibold">Mr. Okoye</p>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
              <FaQuoteLeft className="text-2xl text-emerald-500 ml-auto" />
            </div>
          </div>

          {/* Second Review */}
          <div
            className="flex flex-col bg-gray-50 shadow-xl p-5 rounded-md mb-5"
            data-aos="fade-up"
          >
            <p className="text-justify">
              “My knee replacement surgery in India was a success, and the costs
              were so much lower than in my home country. I’m so grateful to the
              MedExpert India team!”
            </p>

            <div className="flex my-7 items-center">
              <img
                src="https://i.ibb.co/XrspSkbW/u2.jpg"
                alt="patient"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col ml-4">
                <p className="text-base font-semibold">Ms. Zainab</p>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
              <FaQuoteLeft className="text-2xl text-emerald-500 ml-auto" />
            </div>
          </div>
        </div>

        {/* Middle div */}
        <div className="flex flex-col gap-10" data-aos="fade-up">
          {/* Third Review */}
          <div
            className="flex flex-col bg-gray-50 shadow-xl p-5 rounded-md mb-5"
            data-aos="fade-up"
          >
            <p className="text-justify">
              “The cardiac care I received in India was world-class. The team at
              MedExpert India was with me every step of the way, from my first
              consultation to my follow-up care.”
            </p>

            <div className="flex my-7 items-center">
              <img
                src="https://i.ibb.co/vCgjx0bj/u3.jpg"
                alt="patient"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col ml-4">
                <p className="text-base font-semibold">Jesmin Nipa</p>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
              <FaQuoteLeft className="text-2xl text-emerald-500 ml-auto" />
            </div>
          </div>

          {/* Fourth Review */}
          <div
            className="flex flex-col bg-gray-50 shadow-xl p-5 rounded-md mb-5"
            data-aos="fade-up"
          >
            <p className="text-justify">
              “Traveling to India for my surgery was a big decision, but
              MedExpert India made everything seamless. The medical team was
              attentive, and I recovered quickly.”
            </p>

            <div className="flex my-7 items-center">
              <img
                src="https://i.ibb.co/vCgjx0bj/u3.jpg"
                alt="patient"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col ml-4">
                <p className="text-base font-semibold">Dr. Emmanuel</p>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
              <FaQuoteLeft className="text-2xl text-emerald-500 ml-auto" />
            </div>
          </div>
        </div>

        {/* Right side div */}
        <div className="flex flex-col items-start space-y-5" data-aos="fade-up">
          <p className="text-lg text-teal-500">PATIENT’S TESTIMONIALS</p>
          <p className="text-xl font-semibold">
            Positive Review & Appreciated By Happy Patient’s
          </p>
          <p className="text-justify text-gray-600">
            Discover inspiring testimonials from our patients across Africa who
            have experienced world-class medical care in India. From
            life-changing surgeries to compassionate support, their success
            stories reflect our commitment to delivering the best healthcare
            solutions with trust and excellence.
          </p>

          {/* Only Feedback + See More Reviews */}
          <div className="flex flex-col mt-4 space-y-2">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition">
              Give Your Feedback
            </button>
            <a
              href="/all-reviews"
              className="text-teal-500 font-semibold hover:underline"
            >
              See More Reviews
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
