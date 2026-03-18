import React from "react";
import Image from "next/image";
import { CircleCheckBig, Wallet, MapPin, Phone } from "lucide-react";
import {
  FaHourglassStart,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

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
    <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10 mb-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Top green accent */}
        <div className="h-1 bg-green-500 w-full" />

        <div className="flex flex-col lg:flex-row gap-0">
          {/* ── LEFT: Image + basic info ── */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1 p-6 lg:p-8">
            {/* Doctor image */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={doctor?.doctorImageUrl || "/placeholder-doctor.jpg"}
                  alt={doctor?.name}
                  width={176}
                  height={176}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Available badge */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2
                              bg-green-600 text-white text-[0.6rem] font-bold
                              px-3 py-1 rounded-full whitespace-nowrap shadow-sm"
              >
                ● Available
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-2.5 min-w-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {doctor?.name}
                </h2>
                <span
                  className="inline-block mt-1.5 text-xs font-semibold capitalize
                                 bg-green-50 border border-green-200 text-green-700
                                 px-3 py-1 rounded-full"
                >
                  {doctor?.doctorCategory}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {doctor?.educations?.[0]?.degree} —{" "}
                <span className="text-gray-700 font-medium">
                  {doctor?.educations?.[0]?.institution}
                </span>
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={13} className="text-green-600 shrink-0" />
                  {doctor?.location}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Phone size={13} className="text-green-600 shrink-0" />
                  {doctor?.appointmentNumber}
                </p>
              </div>

              {/* Specialization tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doctor?.specializations?.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-[0.68rem] font-medium bg-blue-50 border border-blue-100
                               text-blue-700 px-2.5 py-0.5 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Stats + social ── */}
          <div
            className="lg:w-60 xl:w-72 border-t lg:border-t-0 lg:border-l border-gray-100
                          p-6 lg:p-8 flex flex-col justify-between gap-5 bg-[#f8faf9]"
          >
            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg
                                bg-green-100 shrink-0"
                >
                  <FaHourglassStart className="text-green-700" size={13} />
                </div>
                <div>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">
                    Joined
                  </p>
                  <p className="font-semibold text-gray-800 text-xs">
                    {doctor?.joinedHospitals?.[0]} –{" "}
                    {doctor?.joinedHospitals?.[1]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg
                                bg-green-100 shrink-0"
                >
                  <Wallet size={13} className="text-green-700" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">
                    Consultation Fee
                  </p>
                  <p className="font-black text-gray-900 text-base leading-none mt-0.5">
                    {currency} {doctor?.consultationFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider mb-2">
                Connect
              </p>
              <div className="flex flex-wrap gap-2">
                {doctor?.socialMediaLinks?.map((social) => {
                  const Icon =
                    socialIconMap[social.platform.toLowerCase()] || FaGlobe;
                  return (
                    <a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg border border-gray-200 bg-white
                                 hover:bg-green-600 hover:border-green-600 hover:text-white
                                 text-gray-500 flex items-center justify-center
                                 transition-all duration-200"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              className="flex items-center justify-center gap-2 w-full
                               bg-green-700 hover:bg-green-800 text-white
                               text-sm font-semibold py-2.5 rounded-xl
                               transition-colors duration-200 shadow-sm"
            >
              <CircleCheckBig size={15} />
              Appointment Available
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
