"use client";

import React from "react";
import { Parallax } from "react-parallax";
import RoleGuard from "@/app/components/RoleGuard";
import useUserById from "@/hooks/useUserById";
import {
  MapPin,
  Stethoscope,
  GraduationCap,
  BadgeDollarSign,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";

const ProfilePage = () => {
  const { user, isLoading, error } = useUserById();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-teal-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100">
        {/* Banner */}
        <Parallax
          blur={{ min: -30, max: 30 }}
          bgImage="https://i.ibb.co.com/qYkBsgdW/three.jpg"
          strength={-200}
        >
          <div className="h-[220px] md:h-[320px] bg-black/40" />
        </Parallax>

        {/* Profile Wrapper */}
        <div className="relative -mt-28 md:-mt-36 max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur opacity-70" />
                <img
                  src={
                    user?.doctorImageUrl || "https://i.ibb.co/33gs5fP/user.png"
                  }
                  alt={user?.name}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-xl relative object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {user?.name}
                </h1>

                <p className="mt-1 flex items-center justify-center md:justify-start gap-2 text-teal-600 font-semibold">
                  <Stethoscope size={18} />
                  {user?.doctorCategory || "Specialist"}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    {user?.appointmentEmail || user?.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    {user?.appointmentNumber || "Not provided"}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {user?.location || "Location not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-6 p-8 md:p-10">
              {/* About */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  About Doctor
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {user?.abouts || "No description provided yet."}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-teal-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Briefcase size={18} />
                    Experience
                  </span>
                  <span className="font-bold text-teal-700">
                    {user?.experienceYear || 0}+ Years
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-700">
                    <BadgeDollarSign size={18} />
                    Consultation Fee
                  </span>
                  <span className="font-bold text-teal-700">
                    ৳ {user?.consultationFee || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Extra Sections */}
            <div className="grid md:grid-cols-2 gap-6 p-8 md:p-10 pt-0">
              {/* Degrees */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                  <GraduationCap size={18} />
                  Degrees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.degrees?.length > 0 ? (
                    user.degrees.map((d, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium"
                      >
                        {d}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No degrees added</p>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.specializations?.length > 0 ? (
                    user.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No specializations added
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ProfilePage;
