"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  X,
  RefreshCw,
  Calendar,
  CalendarDays,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";

/* ─────────────────────────────────────────
   FORMAT HELPERS
   API date format: "Mar 27, 2026"
   Calendar must output the EXACT same format.
───────────────────────────────────────── */
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/* Build the string in API format: "Mar 27, 2026" */
const toApiFormat = (year, month, day) =>
  `${MONTHS_SHORT[month]} ${day}, ${year}`;

/* Parse "Mar 27, 2026" → { year, month (0-indexed), day }
   Avoids new Date() timezone shift — splits the string directly. */
const parseApiDate = (str) => {
  if (!str) return null;
  try {
    // str = "Mar 27, 2026"
    const [monthStr, rest] = str.split(" ");
    const [dayStr, yearStr] = rest.replace(",", "").split(" ").filter(Boolean);
    const month = MONTHS_SHORT.indexOf(monthStr); // 0-indexed
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    if (month === -1 || isNaN(day) || isNaN(year)) return null;
    return { year, month, day };
  } catch {
    return null;
  }
};

/* ══════════════════════════════════════
   MINI CALENDAR PICKER
══════════════════════════════════════ */
const CalendarPicker = ({
  activeDates = [],
  selectedDate,
  onSelect,
  onClear,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  /* Does this day have an appointment? Compare in API format */
  const hasAppointment = (day) => {
    if (!day) return false;
    const str = toApiFormat(viewYear, viewMonth, day);
    return activeDates.includes(str);
  };

  /* Is this day the currently selected filter? */
  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const parsed = parseApiDate(selectedDate);
    return (
      parsed &&
      parsed.year === viewYear &&
      parsed.month === viewMonth &&
      parsed.day === day
    );
  };

  const isToday = (day) => {
    if (!day) return false;
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-4 w-72 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg
                     hover:bg-[#f8faf9] text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-gray-800">
          {MONTHS_LONG[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg
                     hover:bg-[#f8faf9] text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="text-center text-[0.6rem] font-bold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => {
                  const apiStr = toApiFormat(viewYear, viewMonth, day);
                  if (isSelected(day)) onClear();
                  else onSelect(apiStr);
                }}
                className={`relative w-8 h-8 rounded-lg text-xs font-semibold
                            transition-all duration-150 leading-none
                  ${
                    isSelected(day)
                      ? "bg-green-700 text-white shadow-sm"
                      : isToday(day)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : hasAppointment(day)
                          ? "text-gray-800 hover:bg-green-50 hover:text-green-700"
                          : "text-gray-400 hover:bg-gray-50 cursor-default"
                  }`}
              >
                {day}
                {/* green dot — only on days with appointments (not selected) */}
                {hasAppointment(day) && !isSelected(day) && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2
                                   w-1 h-1 rounded-full bg-green-500"
                  />
                )}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[0.65rem] text-gray-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Has appointments
        </span>
        {selectedDate && (
          <button
            onClick={onClear}
            className="text-[0.65rem] font-semibold text-red-400 hover:text-red-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
const DoctorAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState(""); // stored as "Mar 27, 2026"
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef(null);

  /* close calendar on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (session?.user?.id) fetchPendingAppointments();
  }, [session]);

  /* ── filter logic ── */
  useEffect(() => {
    let result = [...appointments];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((appt) => {
        const name = (appt.patientName || "").toLowerCase();
        const email = (
          appt.applicantEmail ||
          appt.patientEmail ||
          ""
        ).toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    // Direct string equality — both are "Mar 27, 2026" format
    if (sortDate) {
      result = result.filter((appt) => appt.appointmentDate === sortDate);
    }

    setFilteredAppointments(result);
  }, [searchTerm, sortDate, appointments]);

  /* collect unique appointment dates for dot markers */
  useEffect(() => {
    const dates = [
      ...new Set(appointments.map((a) => a.appointmentDate).filter(Boolean)),
    ];
    setUniqueDates(dates);
  }, [appointments]);

  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorId = session?.user?.id;
      if (!doctorId) throw new Error("Doctor ID not found in session");
      const res = await fetch(
        `/api/appointments/pending-appointments?doctorId=${doctorId}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (err) {
      setError("Failed to load pending appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = (appointmentId, approved) => {
    const actionText = approved ? "Approve" : "Reject";
    const successText = approved ? "approved" : "rejected";
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              {actionText} Appointment?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3 bg-[#f8faf9]">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading(
                  `${actionText}ing appointment…`,
                );
                try {
                  const status = approved ? "confirmed" : "rejected";
                  const res = await fetch(
                    `/api/appointments/${appointmentId}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status }),
                    },
                  );
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "Failed to update status");
                  }
                  toast.success(`Appointment ${successText} successfully`, {
                    id: loadingId,
                    duration: 2500,
                  });
                  fetchPendingAppointments();
                } catch (err) {
                  toast.error(err.message || "Failed to update appointment", {
                    id: loadingId,
                    duration: 5000,
                  });
                }
              }}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors
                ${approved ? "bg-green-700 hover:bg-green-800" : "bg-red-600 hover:bg-red-700"}`}
            >
              {actionText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        },
      },
    );
  };

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
    ];
    return colors[(name.charCodeAt(0) || 0) % colors.length];
  };

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading appointments...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["doctor"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchPendingAppointments}
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
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Doctor Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Pending Appointments
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-700">
                {filteredAppointments.length}
              </span>{" "}
              request{filteredAppointments.length !== 1 ? "s" : ""} awaiting
              review
              {sortDate && (
                <>
                  {" "}
                  —{" "}
                  <span className="text-green-700 font-semibold">
                    {sortDate}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchPendingAppointments}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                       bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#f8faf9]
                       hover:border-green-200 transition-all duration-200"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Search + calendar filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-800 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Calendar date picker */}
          <div className="relative sm:w-64" ref={calRef}>
            <button
              onClick={() => setCalOpen((v) => !v)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl border
                          transition-all duration-200 text-left
                          ${
                            sortDate
                              ? "bg-green-50 border-green-300 text-green-800 font-semibold"
                              : "bg-white border-gray-200 text-gray-500 hover:border-green-300 hover:bg-[#f8faf9]"
                          }`}
            >
              <CalendarDays
                size={15}
                className={sortDate ? "text-green-600" : "text-gray-400"}
              />
              <span className="flex-1 truncate text-sm">
                {sortDate || "Filter by date"}
              </span>
              {sortDate ? (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortDate("");
                  }}
                  className="text-green-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </span>
              ) : (
                <ChevronRight
                  size={13}
                  className={`text-gray-400 transition-transform duration-200 ${calOpen ? "rotate-90" : ""}`}
                />
              )}
            </button>

            {/* Dropdown */}
            {calOpen && (
              <div className="absolute top-full mt-2 right-0 z-50">
                <CalendarPicker
                  activeDates={uniqueDates}
                  selectedDate={sortDate}
                  onSelect={(d) => {
                    setSortDate(d);
                    setCalOpen(false);
                  }}
                  onClear={() => {
                    setSortDate("");
                    setCalOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Empty state ── */}
        {filteredAppointments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <Calendar size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm || sortDate
                ? "No appointments match your filters."
                : "No pending requests right now."}
            </p>
            {(searchTerm || sortDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSortDate("");
                }}
                className="mt-3 text-xs text-green-700 font-semibold hover:underline"
              >
                Clear filters
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
                      { label: "Patient", cls: "" },
                      { label: "Contact", cls: "hidden md:table-cell" },
                      { label: "Date", cls: "hidden lg:table-cell" },
                      { label: "Status", cls: "" },
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
                  {filteredAppointments.map((appt) => {
                    const name = appt.patientName || "—";
                    return (
                      <tr
                        key={appt._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* Patient */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center justify-center w-9 h-9 rounded-xl
                                            text-xs font-bold shrink-0 ${avatarColor(name)}`}
                            >
                              {initials(name)}
                            </div>
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(name),
                                }}
                              />
                              <div className="flex items-center gap-2 mt-0.5">
                                {appt.patientGender && (
                                  <span
                                    className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md
                                    ${
                                      appt.patientGender?.toLowerCase() ===
                                      "male"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-pink-50 text-pink-600"
                                    }`}
                                  >
                                    {appt.patientGender}
                                  </span>
                                )}
                                {appt.patientAge && (
                                  <span className="text-xs text-gray-400">
                                    {appt.patientAge} yrs
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="hidden md:table-cell px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail
                                size={12}
                                className="text-green-500 shrink-0"
                              />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(
                                    appt.applicantEmail ||
                                      appt.patientEmail ||
                                      "—",
                                  ),
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone
                                size={12}
                                className="text-green-500 shrink-0"
                              />
                              {appt.patientPhone || (
                                <span className="text-gray-300">—</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="hidden lg:table-cell px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <CalendarDays
                              size={13}
                              className="text-green-500 shrink-0"
                            />
                            {appt.appointmentDate || "—"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                           text-[0.65rem] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                          >
                            <Clock size={10} /> Pending
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecision(appt._id, true)}
                              className="flex items-center gap-1.5 text-xs font-bold text-white
                                         bg-green-700 hover:bg-green-800 px-3.5 py-2 rounded-xl
                                         transition-colors duration-200 shadow-sm"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleDecision(appt._id, false)}
                              className="flex items-center gap-1.5 text-xs font-bold text-red-600
                                         bg-red-50 hover:bg-red-100 border border-red-200
                                         px-3.5 py-2 rounded-xl transition-colors duration-200"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
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

export default DoctorAppointmentsPage;
