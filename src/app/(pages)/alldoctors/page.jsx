"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar, Award, ArrowRight, Users } from "lucide-react";

import Loader from "@/components/Loader";
import AllDoctorsHeader from "./AllDoctorsHeader";
import Pagination from "@/components/Pagination";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);

  const currency = process.env.CURRENCY || "৳";
  const itemsPerPage = 6;

  /* ── Fetch ── */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        const doctorList = data.filter((u) => u.role === "doctor");
        setDoctors(doctorList);
        setFilteredDoctors(doctorList);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchDoctors();
  }, []);

  /* ── Filter ── */
  useEffect(() => {
    let result = [...doctors];
    if (selectedCategory !== "All") {
      result = result.filter((d) => d.doctorCategory === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(term) ||
          d.doctorCategory?.toLowerCase().includes(term) ||
          d.location?.toLowerCase().includes(term),
      );
    }
    setFilteredDoctors(result);
  }, [searchTerm, selectedCategory, doctors]);

  const calculateRating = (reviews = []) => {
    if (!reviews.length) return "4.5";
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  if (isLoading) return <Loader message="Finding our best doctors..." />;

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Header */}
      <AllDoctorsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={["All", ...new Set(doctors.map((d) => d.doctorCategory))]}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Result count */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Available Specialists
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredDoctors.length}
              </span>{" "}
              doctor{filteredDoctors.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-green-700 font-semibold">
                    {selectedCategory}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {filteredDoctors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100
                            flex items-center justify-center mb-4"
            >
              <Users size={28} className="text-green-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No doctors found
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Try adjusting your search or selecting a different category.
            </p>
          </div>
        )}

        {/* Doctors grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedDoctors.map((doctor) => {
            const rating = calculateRating(doctor.reviews);
            return (
              <div
                key={doctor._id}
                className="group bg-white rounded-2xl border border-gray-100
                           hover:border-green-100 hover:shadow-lg shadow-sm
                           transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={
                      doctor?.doctorImageUrl ||
                      "https://img.icons8.com/?size=100&id=41799&format=png&color=000000"
                    }
                    alt={doctor.name}
                    fill
                    className="object-cover object-top group-hover:scale-105
                               transition-transform duration-500"
                  />
                  {/* Category badge over image */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[0.65rem] font-semibold capitalize px-2.5 py-1
                                     bg-white/90 backdrop-blur-sm border border-green-100
                                     text-green-700 rounded-full"
                    >
                      {doctor.doctorCategory}
                    </span>
                  </div>
                  {/* Rating badge over image */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1
                                  bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1
                                  border border-amber-100"
                  >
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-gray-800">
                      {rating}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Name */}
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {doctor.name}
                  </h3>

                  {/* Info rows */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
                        <Award size={12} className="text-green-600" />
                      </div>
                      {doctor.degree?.join(", ") || "MBBS"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
                        <Calendar size={12} className="text-green-600" />
                      </div>
                      {doctor.experienceYear}+ years experience
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
                        <MapPin size={12} className="text-green-600" />
                      </div>
                      {doctor.location}
                    </div>
                  </div>

                  {/* Divider + fee + CTA */}
                  <div
                    className="mt-auto pt-4 border-t border-gray-100
                                  flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">
                        Consultation Fee
                      </p>
                      <p className="text-lg font-black text-gray-900 leading-none mt-0.5">
                        {currency} {doctor.consultationFee}
                      </p>
                    </div>

                    <Link
                      href={`/alldoctors/${doctor._id}`}
                      className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800
                                 text-white text-xs font-semibold px-4 py-2.5 rounded-xl
                                 transition-colors duration-200 shadow-sm"
                    >
                      View Profile
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          data={filteredDoctors}
          itemsPerPage={itemsPerPage}
          onPageDataChange={setPaginatedDoctors}
        />
      </div>
    </div>
  );
};

export default DoctorPage;
