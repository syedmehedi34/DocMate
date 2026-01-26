"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Award,
  Search,
  Filter,
  Stethoscope,
  Users,
  ChevronsRight,
} from "lucide-react";
import Loader from "@/components/Loader";
import Link from "next/link";

const DoctorPage = () => {
  const { data: session } = useSession();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 6; // adjusted to feel more like card-heavy layout

  // Lock body scroll + ESC close
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        const doctorList = data.filter((user) => user.role === "doctor");

        // Optional: sort by some rating if available, fallback to name
        doctorList.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setDoctors(doctorList);
        setFilteredDoctors(doctorList);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setTimeout(() => setIsLoading(false), 800); // fake delay for loader feel
      }
    };
    fetchDoctors();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...doctors];

    if (selectedCategory !== "All") {
      result = result.filter(
        (d) => (d.doctorCategory || "General") === selectedCategory,
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(term) ||
          (d.doctorCategory || "").toLowerCase().includes(term) ||
          d.email?.toLowerCase().includes(term) ||
          (d.location || "").toLowerCase().includes(term),
      );
    }

    setFilteredDoctors(result);
    setCurrentPage(1); // reset to page 1 on filter change
  }, [searchTerm, selectedCategory, doctors]);

  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const categories = [
    "All",
    ...new Set(doctors.map((d) => d.doctorCategory || "General")),
  ];

  const handleAppointmentClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleAppointmentSubmit = async () => {
    if (
      !selectedDoctor ||
      !appointmentDate ||
      !appointmentTime ||
      !patientName ||
      !phone ||
      !reason
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor._id,
      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      patientName,
      phone,
      reason,
      date: appointmentDate,
      time: appointmentTime,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const result = await res.json();

      if (res.ok) {
        // Optional: update user to patient
        await fetch(`/api/users/${session?.user?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPatient: true }),
        });

        alert("Appointment booked successfully!");
        setShowModal(false);
        setPatientName("");
        setPhone("");
        setReason("");
        setAppointmentDate("");
        setAppointmentTime("");
      } else {
        alert(result.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader message="Finding our best doctors..." />;
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero / Search Section */}
      <div
        className="relative h-80 text-black mb-16 md:mb-8"
        style={{
          backgroundImage: "url('/all-doc-header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 🔥 Background Overlay (blur + opacity) */}
        <div className="absolute inset-0 bg-gray-200/15 backdrop-blur-xs"></div>

        {/* ✅ Content */}
        <div className="h-full relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-full flex flex-col justify-center text-left mb-8 text-[#122B2B]">
            <h1 className="text-[50px] font-bold mb-3">Our Doctors</h1>
            <div className="flex items-center gap-2 text-[16px] ">
              <Link href="/" className="hover:font-extrabold">
                <span className="text-[#93C249] font-bold">Home</span>
              </Link>
              <ChevronsRight className="w-5 h-5 text-[#93C249] font-extrabold" />
              <span className="text-[#122B2B] font-semibold">Our Doctors</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-3xl px-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-5 border border-white/20">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Name search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Doctor name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                  />
                </div>

                {/* Category dropdown */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((doctor) => (
              <div
                key={doctor._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Available
                    </span>
                  </div>

                  <Image
                    src={doctor.doctorImageUrl || "/placeholder-doctor.jpg"}
                    alt={doctor.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm">
                        {doctor.doctorCategory || "General Practitioner"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">
                        {doctor.rating || "4.8"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="line-clamp-1">
                      {doctor.qualification || "MBBS, MD"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{doctor.experience || "8+"} years experience</span>
                  </div>

                  <div className="space-y-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {doctor.hospital || "City Hospital"}
                        </p>
                        <p className="text-gray-500">
                          {doctor.location || "Dhaka, Bangladesh"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${doctor.consultation_fee || "45"}
                      </p>
                    </div>
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={() => handleAppointmentClick(doctor)}
                    >
                      Book Now
                    </button>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-5 text-xs text-gray-500">
                    <a
                      href={`tel:${doctor.phone || ""}`}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`mailto:${doctor.email}`}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowModal(false)}
        />

        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all duration-300 ${
              showModal
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-10"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedDoctor && (
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  Book with {selectedDoctor.name}
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full min-h-28"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none"
                    onClick={handleAppointmentSubmit}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
