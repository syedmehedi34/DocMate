"use client";
import React from "react";
import { Parallax } from "react-parallax";
import RoleGuard from "@/app/components/RoleGuard";
import useUserById from "@/hooks/useUserById";

const ProfilePage = () => {
  const { user, isLoading, error } = useUserById();
  console.log(user);

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
          blur={{ min: -50, max: 50 }}
          bgImage="https://i.ibb.co.com/qYkBsgdW/three.jpg"
          strength={-200}
        >
          <div className="h-[190px] md:h-[300px] bg-opacity-60 bg-cover bg-center bg-no-repeat" />
        </Parallax>

        {/* Profile Card */}
        <div className="relative -mt-24 md:-mt-32 max-w-2xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-700" />
                <img
                  src={user?.image || "https://i.ibb.co/33gs5fP/user.png"}
                  alt={user?.name || "Doctor"}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl relative"
                />
              </div>

              {/* Info */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {user?.name}
                </h1>
                <p className="text-lg text-teal-600 font-medium">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ProfilePage;
