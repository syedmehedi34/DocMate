"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowUpDown,
  Stethoscope,
  ArrowUpRight,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";

/* ── avatar initials ── */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
const avatarColor = (name = "") => {
  const colors = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

/* ── status badge ── */
const StatusBadge = ({ status }) => {
  const cfg = {
    available: "bg-green-50 text-green-700 border-green-200",
    busy: "bg-amber-50 text-amber-700 border-amber-200",
    "on-leave": "bg-gray-100 text-gray-500 border-gray-200",
  };
  const dot = {
    available: "bg-green-500",
    busy: "bg-amber-400",
    "on-leave": "bg-gray-400",
  };
  const key = status?.toLowerCase() || "unknown";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-[0.65rem] font-bold border capitalize
                      ${cfg[key] || "bg-gray-100 text-gray-500 border-gray-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dot[key] || "bg-gray-400"}`}
      />
      {status || "Unknown"}
    </span>
  );
};

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const doctorData = data.filter((u) => u.role === "doctor");
      setDoctors(doctorData);
      setFilteredDoctors(doctorData);
    } catch (err) {
      setError(err.message || "Could not load doctors list.");
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      const cats = [
        ...new Set(doctors.map((d) => d.doctorCategory || "Uncategorized")),
      ];
      setUniqueCategories(cats.sort());
    }
  }, [doctors]);

  useEffect(() => {
    let result = [...doctors];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(term) ||
          (d.email || "").toLowerCase().includes(term),
      );
    }
    if (selectedCategory) {
      result = result.filter(
        (d) =>
          (d.doctorCategory || "Uncategorized").toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }
    setFilteredDoctors(result);
  }, [doctors, searchTerm, selectedCategory]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedCategory("");

  const highlightText = (text = "") => {
    if (!searchTerm.trim() || !text) return text;
    return text.replace(
      new RegExp(
        `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi",
      ),
      '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>',
    );
  };

  const handleViewDetails = (doctor) => {
    console.log("Viewing details for doctor:", doctor);
  };

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading doctors...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchDoctors}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                     bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </RoleGuard>
    );

  /* ─────────────── RENDER ─────────────── */
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">All Doctors</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-700">
                {filteredDoctors.length}
              </span>{" "}
              doctor{filteredDoctors.length !== 1 ? "s" : ""} found
              {selectedCategory && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-green-700 font-semibold capitalize">
                    {selectedCategory}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchDoctors}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                       bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#f8faf9]
                       hover:border-green-200 transition-all duration-200"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Search + filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-800 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative sm:w-56">
            <ArrowUpDown
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <button
                onClick={clearFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Empty state ── */}
        {filteredDoctors.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <Stethoscope size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm || selectedCategory
                ? "No doctors match your filters."
                : "No doctors found."}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-3 text-xs text-green-700 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f8faf9]">
                      {[
                        { label: "#", cls: "w-12" },
                        { label: "Doctor", cls: "" },
                        { label: "Email", cls: "hidden md:table-cell" },
                        { label: "Category", cls: "" },
                        { label: "Status", cls: "hidden sm:table-cell" },
                        { label: "Actions", cls: "" },
                      ].map(({ label, cls }) => (
                        <th
                          key={label}
                          className={`px-5 py-3.5 text-left text-[0.62rem] font-bold
                                       text-gray-400 uppercase tracking-widest ${cls}`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedDoctors.map((doctor, index) => (
                      <tr
                        key={doctor._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-semibold text-gray-400">
                          {index + 1}
                        </td>

                        {/* Doctor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {doctor.doctorImageUrl ? (
                              <div className="relative shrink-0">
                                <img
                                  src={doctor.doctorImageUrl}
                                  alt={doctor.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                                />
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
                                  ${doctor.currentStatus === "available" ? "bg-green-400" : "bg-amber-400"}`}
                                />
                              </div>
                            ) : (
                              <div
                                className={`relative flex items-center justify-center w-10 h-10 rounded-xl
                                              text-xs font-bold shrink-0 ${avatarColor(doctor.name || "")}`}
                              >
                                {initials(doctor.name || "")}
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
                                  ${doctor.currentStatus === "available" ? "bg-green-400" : "bg-amber-400"}`}
                                />
                              </div>
                            )}
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(doctor.name || "—"),
                                }}
                              />
                              <div className="flex items-center gap-2 mt-0.5">
                                {doctor.experienceYear && (
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock size={10} /> {doctor.experienceYear}{" "}
                                    yrs
                                  </span>
                                )}
                                {doctor.location && (
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <MapPin size={10} /> {doctor.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="hidden md:table-cell px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Mail
                              size={12}
                              className="text-green-500 shrink-0"
                            />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(doctor.email || "—"),
                              }}
                            />
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span
                            className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full border capitalize
                            ${
                              doctor.doctorCategory
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-400 border-gray-200"
                            }`}
                          >
                            {doctor.doctorCategory || "Uncategorized"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="hidden sm:table-cell px-5 py-4">
                          <StatusBadge status={doctor.currentStatus} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <Link href={`/dashboard/admin/doctors/${doctor._id}`}>
                            <button
                              onClick={() => handleViewDetails(doctor)}
                              className="flex items-center gap-1.5 text-xs font-bold text-white
                                         bg-green-700 hover:bg-green-800 px-3.5 py-2 rounded-xl
                                         transition-colors duration-200 shadow-sm whitespace-nowrap"
                            >
                              Details <ArrowUpRight size={13} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              data={filteredDoctors}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedDoctors}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorPage;
