"use client";

import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowUpRight,
  Mail,
  Phone,
  Calendar,
  Users,
} from "lucide-react";
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

const UserPage = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [paginatedPatients, setPaginatedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-users-and-appointment");
      if (!res.ok) throw new Error("Failed to load patients");
      const data = await res.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Could not load patient list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...patients];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(term) ||
          (p.email || "").toLowerCase().includes(term) ||
          (p.appointmentNumber || "").toLowerCase().includes(term),
      );
    }
    setFilteredPatients(result);
  }, [patients, searchTerm]);

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

  const clearSearch = () => setSearchTerm("");

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading patients...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchData}
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
            <h1 className="text-2xl font-black text-gray-900">All Patients</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-700">
                {filteredPatients.length}
              </span>{" "}
              patient{filteredPatients.length !== 1 ? "s" : ""} found
              {searchTerm && (
                <>
                  {" "}
                  · matching "
                  <span className="text-green-700 font-semibold">
                    {searchTerm}
                  </span>
                  "
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                       bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#f8faf9]
                       hover:border-green-200 transition-all duration-200"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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

        {/* ── Empty state ── */}
        {filteredPatients.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <Users size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm
                ? "No patients match your search."
                : "No patients found."}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-3 text-xs text-green-700 font-semibold hover:underline"
              >
                Clear search
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
                        { label: "Patient", cls: "" },
                        { label: "Contact", cls: "hidden md:table-cell" },
                        { label: "Appointments", cls: "" },
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
                    {paginatedPatients.map((patient, index) => {
                      const apptCount = patient.appointments?.length || 0;
                      const name = patient.name || "";
                      return (
                        <tr
                          key={patient._id}
                          className="hover:bg-[#f8faf9] transition-colors duration-150"
                        >
                          {/* # */}
                          <td className="px-5 py-4 text-xs font-semibold text-gray-400">
                            {index + 1}
                          </td>

                          {/* Patient */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {patient.image ? (
                                <img
                                  src={patient.image}
                                  alt={name}
                                  className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                                />
                              ) : (
                                <div
                                  className={`flex items-center justify-center w-10 h-10 rounded-xl
                                                text-xs font-bold shrink-0 ${avatarColor(name)}`}
                                >
                                  {initials(name)}
                                </div>
                              )}
                              <div>
                                <p
                                  className="text-sm font-bold text-gray-900"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(name || "—"),
                                  }}
                                />
                                <p className="text-[0.65rem] text-gray-400 font-mono mt-0.5">
                                  #{patient._id.slice(-8)}
                                </p>
                                {/* Show email on mobile */}
                                <p className="text-xs text-gray-400 md:hidden mt-0.5 truncate max-w-40">
                                  {patient.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="hidden md:table-cell px-5 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Mail
                                  size={12}
                                  className="text-green-500 shrink-0"
                                />
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(patient.email || "—"),
                                  }}
                                />
                              </div>
                              {patient.appointmentNumber && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Phone
                                    size={12}
                                    className="text-green-500 shrink-0"
                                  />
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: highlightText(
                                        patient.appointmentNumber,
                                      ),
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Appointments */}
                          <td className="px-5 py-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                            text-[0.65rem] font-bold border
                                            ${
                                              apptCount > 0
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-gray-100 text-gray-400 border-gray-200"
                                            }`}
                            >
                              <Calendar size={11} />
                              {apptCount} {apptCount === 1 ? "visit" : "visits"}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <Link
                              href={`/dashboard/admin/patients/${patient._id}`}
                            >
                              <button
                                className="flex items-center gap-1.5 text-xs font-bold text-white
                                                 bg-green-700 hover:bg-green-800 px-3.5 py-2 rounded-xl
                                                 transition-colors duration-200 shadow-sm whitespace-nowrap"
                              >
                                Details <ArrowUpRight size={13} />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              data={filteredPatients}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedPatients}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
};

export default UserPage;
