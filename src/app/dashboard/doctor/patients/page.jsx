"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  X,
  RefreshCw,
  Users,
  Mail,
  Phone,
  Calendar,
  FileText,
} from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

const DoctorPatientsPage = () => {
  const { data: session } = useSession();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id && session.user.role === "doctor")
      fetchDoctorPatients();
  }, [session]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }
    const term = searchTerm.toLowerCase().trim();
    setFilteredPatients(
      patients.filter((p) => {
        const name = (
          p.patientName ||
          p.applicantName ||
          p.name ||
          ""
        ).toLowerCase();
        const email = (p.applicantEmail || p.email || "").toLowerCase();
        return name.includes(term) || email.includes(term);
      }),
    );
  }, [searchTerm, patients]);

  const fetchDoctorPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/patients");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setPatients(data || []);
      setFilteredPatients(data || []);
    } catch (err) {
      setError(err.message || "Could not load patient list.");
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => setSearchTerm("");

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

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading patients...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchDoctorPatients}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                     bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </RoleGuard>
    );

  /* ────────────── RENDER ────────────── */
  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Doctor Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">My Patients</h1>
            <p className="text-sm text-gray-400 mt-1">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""}
              {searchTerm && (
                <>
                  {" "}
                  matching "
                  <span className="text-green-700 font-semibold">
                    {searchTerm}
                  </span>
                  "
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchDoctorPatients}
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
                : "No patients yet."}
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {searchTerm
                ? "Try a different name or email."
                : "Patients with confirmed or completed appointments will appear here."}
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f8faf9]">
                    {[
                      { label: "#", cls: "" },
                      { label: "Patient", cls: "" },
                      { label: "Email", cls: "hidden md:table-cell" },
                      { label: "Phone", cls: "hidden md:table-cell" },
                      { label: "Age / Gender", cls: "" },
                      { label: "Reason", cls: "hidden lg:table-cell" },
                      { label: "Last Visit", cls: "hidden lg:table-cell" },
                      { label: "Visits", cls: "" },
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
                  {filteredPatients.map((patient, index) => {
                    const name =
                      patient.patientName || patient.applicantName || "—";
                    const email =
                      patient.applicantEmail || patient.email || "—";
                    return (
                      <tr
                        key={patient._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-semibold text-gray-400 w-10">
                          {index + 1}
                        </td>

                        {/* Patient */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(name),
                                }}
                              />
                              <p className="text-[0.65rem] text-gray-400 mt-0.5 font-mono">
                                #{patient.applicantUserId?.slice(-8) || "—"}
                              </p>
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
                                __html: highlightText(email),
                              }}
                            />
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="hidden md:table-cell px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone
                              size={12}
                              className="text-green-500 shrink-0"
                            />
                            {patient.patientPhone || (
                              <span className="text-gray-300">N/A</span>
                            )}
                          </div>
                        </td>

                        {/* Age / Gender */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            {patient.patientAge && (
                              <span className="text-xs font-semibold text-gray-700">
                                {patient.patientAge} yrs
                              </span>
                            )}
                            {patient.patientGender && (
                              <span
                                className={`inline-flex text-[0.6rem] font-bold px-2 py-0.5 rounded-full w-fit
                                ${
                                  patient.patientGender?.toLowerCase() ===
                                  "male"
                                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                                    : "bg-pink-50 text-pink-600 border border-pink-100"
                                }`}
                              >
                                {patient.patientGender}
                              </span>
                            )}
                            {!patient.patientAge && !patient.patientGender && (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="hidden lg:table-cell px-5 py-4 max-w-45">
                          <div className="flex items-start gap-1.5">
                            <FileText
                              size={12}
                              className="text-green-500 shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {patient.diseaseDetails || (
                                <span className="text-gray-300">—</span>
                              )}
                            </p>
                          </div>
                        </td>

                        {/* Last Visit */}
                        <td className="hidden lg:table-cell px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar
                              size={12}
                              className="text-green-500 shrink-0"
                            />
                            {patient.lastAppointmentDate || (
                              <span className="text-gray-300">—</span>
                            )}
                          </div>
                        </td>

                        {/* Visits */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center justify-center
                                           w-7 h-7 rounded-xl bg-green-50 border border-green-200
                                           text-xs font-bold text-green-700"
                          >
                            {patient.appointmentCount || 1}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorPatientsPage;
