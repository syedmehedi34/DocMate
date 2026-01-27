"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar, Award } from "lucide-react";

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

  /* ================= FETCH DOCTORS ================= */
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

  /* ================= FILTER LOGIC ================= */
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* HEADER */}
      <AllDoctorsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={["All", ...new Set(doctors.map((d) => d.doctorCategory))]}
      />

      {/* DOCTORS GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative h-60">
                <Image
                  src={doctor.doctorImageUrl || "/placeholder-doctor.jpg"}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{doctor.name}</h3>

                    <p className="capitalize badge bg-gradient-to-r from-sky-700 to-cyan-600 text-white font-semibold mt-1">
                      {doctor.doctorCategory}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 badge rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">
                      {calculateRating(doctor.reviews)}
                    </span>
                  </div>
                </div>

                <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Award className="w-4 h-4" />
                  {doctor.degree?.join(", ") || "MBBS"}
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  {doctor.experienceYear}+ years experience
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  {doctor.location}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-[#212121]/30">
                  <div>
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="text-xl font-bold">
                      {currency} {doctor.consultationFee}
                    </p>
                  </div>

                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="btn rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION COMPONENT */}
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
