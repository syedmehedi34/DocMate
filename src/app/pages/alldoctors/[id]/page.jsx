"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ChevronsRight, Wallet } from "lucide-react";
import { FaStreetView, FaHourglassStart } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";

import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

/* ---------------- SOCIAL ICON MAP ---------------- */
const socialIconMap = {
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  website: FaGlobe,
};

const DoctorDetailsAndAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const currency = process.env.CURRENCY || "৳";

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p className="text-center my-20">Loading...</p>;
  if (!doctor) return <p className="text-center my-20">Doctor not found</p>;

  return (
    <>
      {/* ================= HEADER ================= */}
      <div
        className="relative h-96 text-black mb-16 md:mb-8"
        style={{
          backgroundImage: "url('/all-doc-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>

        <section className="h-full relative z-10 max-w-7xl mx-auto px-4 py-10">
          <div className="h-full flex flex-col justify-center text-[#003367]">
            <h1 className="text-[55px] font-bold mb-3">
              {doctor?.name} - <br />
              <span>Booking</span>
            </h1>

            <div className="flex items-center gap-2 text-[16px] mb-14">
              <Link href="/" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">Home</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <Link href="/alldoctors" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">All Doctors</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249]" />

              <span className="text-[#003367] font-semibold">
                {doctor?.name} - Booking
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ================= Profile Card ================= */}
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
            Appointment Available
          </button>
        </div>
      </section>

      {/* ================= TABS SECTION ================= */}
      <section className="max-w-6xl mx-auto my-16 bg-white rounded-2xl border  border-gray-200 px-6 py-8">
        <Tabs>
          {/* TAB HEADER */}
          <TabList className="flex justify-center gap-16 border-b border-gray-200">
            <Tab
              className="pb-4 text-lg font-extrabold text-[#003367]  cursor-pointer outline-none transition-all duration-150 w-48 text-center"
              selectedClassName="text-lime-600 text-emerald-600 border-b-2"
            >
              Overview
            </Tab>

            <Tab
              className="pb-4 text-lg font-extrabold text-[#003367]  cursor-pointer outline-none transition-all duration-150 w-48 text-center"
              selectedClassName="text-lime-600 border-b-2"
            >
              Booking
            </Tab>
          </TabList>

          {/* ================= OVERVIEW ================= */}
          <TabPanel>
            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#003367] mb-3">
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{doctor?.about}</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#003367] mb-4">
                  Education
                </h3>
                <ul className="space-y-2">
                  {doctor?.educations?.map((edu) => (
                    <li key={edu._id}>
                      <span className="font-semibold">{edu.degree}</span>,{" "}
                      {edu.institution} ({edu.year})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabPanel>

          {/* ================= BOOKING ================= */}
          <TabPanel>
            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#003367] mb-4">
                  Available Days
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {doctor?.chamberDays?.map((day, i) => (
                    <span
                      key={i}
                      className="px-4 py-1 rounded-full border text-sm"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <button className="bg-[#93C249] hover:bg-[#7cab32] text-white px-8 py-2 rounded-md font-semibold transition">
                Book Appointment
              </button>
            </div>
          </TabPanel>
        </Tabs>
      </section>
    </>
  );
};

export default DoctorDetailsAndAppointment;
