import React from "react";
import Image from "next/image";
import { Wallet } from "lucide-react";
import {
  FaStreetView,
  FaHourglassStart,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { IoCall } from "react-icons/io5";

/* ---------------- SOCIAL ICON MAP ---------------- */
const socialIconMap = {
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  website: FaGlobe,
};

const ProfileCard = ({ doctor, currency }) => {
  return (
    <>
      <section className="max-w-6xl mx-auto my-20 p-6 bg-white rounded-2xl hover:shadow-2xl  transition-all duration-300  border border-gray-100 flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE */}
        <div className="flex gap-6 flex-1">
          <Image
            src={doctor?.doctorImageUrl || "/placeholder-doctor.jpg"}
            alt={doctor?.name}
            width={220}
            height={180}
            className="rounded-2xl object-cover border shadow"
          />

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#003367]">
              {doctor?.name}
            </h2>

            <p className="capitalize bg-blue-800/90 shadow shadow-gray-500 badge border border-blue-300 rounded-full text-white font-medium">
              {doctor?.doctorCategory}
            </p>

            <p className="text-gray-700">
              {doctor?.educations?.[0]?.degree} –{" "}
              {doctor?.educations?.[0]?.institution}
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <FaStreetView /> {doctor?.location}
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <IoCall /> {doctor?.appointmentNumber}
            </p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor?.specializations?.map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50/50 border border-blue-100 text-blue-800 text-sm px-3 py-1 rounded-[5px] hover:bg-blue-100 transition cursor-default"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-64 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-gray-700">
              <FaHourglassStart />
              Joined: {doctor?.joinedHospitals?.[0]} –{" "}
              {doctor?.joinedHospitals?.[1]}
            </p>

            <p className="font-semibold text-[#93C249] flex items-center gap-2">
              <Wallet size={19} />
              Consultation Fee: {doctor?.consultationFee}
              {currency}
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex gap-3 mt-4">
              {doctor?.socialMediaLinks?.map((social) => {
                const Icon =
                  socialIconMap[social.platform.toLowerCase()] || FaGlobe;

                return (
                  <a
                    key={social._id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-[5px] border border-[#93C249]/10 bg-gray-100 hover:bg-[#93C249] hover:text-white flex items-center justify-center transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <button className="mt-6 bg-[#93C249] hover:bg-[#7cab32] text-white py-2 rounded-[5px] font-semibold shadow transition">
            {/* <CircleCheckBig />
            <CircleX /> */}
            Appointment Available
          </button>
        </div>
      </section>
    </>
  );
};

export default ProfileCard;
