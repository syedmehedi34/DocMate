"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Pagination from "@/components/Pagination";
import {
  Search,
  X,
  RefreshCw,
  Clock,
  ArrowDownUp,
  CalendarDays,
  Stethoscope,
  ArrowUpRight,
  FileText,
  BadgeCheck,
  XCircle,
  CircleDashed,
  CheckCircle2,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";

/* ── status config ── */
const statusConfig = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <CircleDashed size={11} />,
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-50  text-green-700  border-green-200",
    icon: <CheckCircle2 size={11} />,
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-gray-100  text-gray-500   border-gray-200",
    icon: <Ban size={11} />,
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50    text-red-600    border-red-200",
    icon: <XCircle size={11} />,
  },
  completed: {
    label: "Completed",
    cls: "bg-blue-50   text-blue-700   border-blue-200",
    icon: <BadgeCheck size={11} />,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold border ${cfg.cls}`}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
};

const AllAppointmentsPage = () => {
  const { data: session } = useSession();
  const itemsPerPage = 8;

  const [appointments, setAppointments] = useState([]);
  const [paginatedAppointments, setPaginatedAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const highlightText = (text = "") => {
    if (!searchTerm.trim() || !text) return text;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(
      new RegExp(`(${escaped})`, "gi"),
      '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>',
    );
  };

  const fetchAppointments = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/appointments/user/${session.user.id}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (err) {
      setError(err.message || "Could not load appointments.");
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchAppointments();
    else setLoading(false);
  }, [session]);

  useEffect(() => {
    let result = [...appointments];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (a) =>
          (a.doctorName || "").toLowerCase().includes(term) ||
          (a.doctorEmail || "").toLowerCase().includes(term),
      );
    }
    if (selectedStatus)
      result = result.filter(
        (a) => a.status?.toLowerCase() === selectedStatus.toLowerCase(),
      );
    setFilteredAppointments(result);
  }, [appointments, searchTerm, selectedStatus]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedStatus("");

  const handleCancelAppointment = (appointmentId) => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              Cancel Appointment?
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
              Keep
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading("Cancelling appointment…");
                try {
                  const res = await fetch(
                    `/api/appointments/${appointmentId}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "cancelled" }),
                    },
                  );
                  const data = await res.json();
                  if (!res.ok)
                    throw new Error(
                      data.error || "Failed to cancel appointment",
                    );
                  fetchAppointments();
                  toast.success("Appointment cancelled successfully", {
                    id: loadingId,
                    duration: 2000,
                  });
                } catch (err) {
                  toast.error(err.message || "Failed to cancel appointment", {
                    id: loadingId,
                    duration: 5000,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700"
            >
              Cancel Appointment
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

  const openModal = (appt) => {
    setSelectedAppointment(appt);
    document.getElementById("appointment_modal")?.showModal();
  };

  /* ── loading ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["user"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading appointments...</p>
        </div>
      </RoleGuard>
    );

  /* ── error ── */
  if (error)
    return (
      <RoleGuard allowedRoles={["user"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchAppointments}
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
    <RoleGuard allowedRoles={["user"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              My Appointments
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={fetchAppointments}
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
              placeholder="Search by doctor name or email..."
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
            <ArrowDownUp
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            {selectedStatus && (
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
        {filteredAppointments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <CalendarDays size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm || selectedStatus
                ? "No appointments match your filter."
                : "No appointments yet."}
            </p>
            {(searchTerm || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("");
                }}
                className="mt-3 text-xs text-green-700 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f8faf9]">
                      {["#", "Doctor", "Date", "Status", "Actions"].map(
                        (h, i) => (
                          <th
                            key={h}
                            className={`px-5 py-3.5 text-left text-[0.62rem] font-bold
                                                 text-gray-400 uppercase tracking-widest
                                                 ${i === 3 ? "hidden md:table-cell" : ""}`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedAppointments.map((appt, index) => (
                      <tr
                        key={appt._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-semibold text-gray-400 w-10">
                          {index + 1}
                        </td>

                        {/* Doctor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center w-8 h-8 rounded-xl
                                            bg-green-50 border border-green-100 shrink-0"
                            >
                              <Stethoscope
                                size={14}
                                className="text-green-600"
                              />
                            </div>
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(appt.doctorName || "—"),
                                }}
                              />
                              <p
                                className="text-xs text-gray-400 mt-0.5"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(
                                    appt.doctorEmail || "—",
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium whitespace-nowrap">
                            <CalendarDays
                              size={13}
                              className="text-green-600 shrink-0"
                            />
                            {appt.appointmentDate || "—"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="hidden md:table-cell px-5 py-4">
                          <StatusBadge status={appt.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal(appt)}
                              className="flex items-center gap-1 text-xs font-semibold text-green-700
                                         hover:text-green-800 bg-green-50 hover:bg-green-100 border border-green-200
                                         px-3 py-1.5 rounded-lg transition-colors duration-200"
                            >
                              Details <ArrowUpRight size={12} />
                            </button>
                            {appt.status === "pending" &&
                              !appt.isAppointmentConfirmed && (
                                <button
                                  onClick={() =>
                                    handleCancelAppointment(appt._id)
                                  }
                                  className="text-xs font-semibold text-red-500 hover:text-red-600
                                           bg-red-50 hover:bg-red-100 border border-red-100
                                           px-3 py-1.5 rounded-lg transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              data={filteredAppointments}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedAppointments}
            />
          </>
        )}

        {/* ════════════════════════════════════
            DETAILS MODAL
        ════════════════════════════════════ */}
        <dialog
          id="appointment_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box max-w-2xl w-11/12 p-0 rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                  <FileText size={16} className="text-green-700" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold">
                    Appointment Details
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">
                    {selectedAppointment?.doctorName || "—"}
                  </p>
                </div>
              </div>
              <form method="dialog">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg
                                   bg-[#f8faf9] border border-gray-200 text-gray-400
                                   hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X size={15} />
                </button>
              </form>
            </div>

            {/* Modal body */}
            {selectedAppointment && (
              <div className="p-6 bg-[#f8faf9] space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Top info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Doctor",
                      value: selectedAppointment.doctorName,
                      icon: (
                        <Stethoscope size={13} className="text-green-600" />
                      ),
                    },
                    {
                      label: "Date",
                      value: selectedAppointment.appointmentDate,
                      icon: (
                        <CalendarDays size={13} className="text-green-600" />
                      ),
                    },
                    {
                      label: "Patient",
                      value: `${selectedAppointment.patientName} • ${selectedAppointment.patientAge || "—"} yrs • ${selectedAppointment.patientGender || "—"}`,
                      icon: null,
                    },
                    {
                      label: "Status",
                      value: null,
                      badge: selectedAppointment.status,
                      icon: null,
                    },
                  ].map(({ label, value, badge, icon }) => (
                    <div
                      key={label}
                      className="bg-white rounded-xl border border-gray-100 p-4"
                    >
                      <p className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-semibold mb-1.5">
                        {label}
                      </p>
                      {badge ? (
                        <StatusBadge status={badge} />
                      ) : (
                        <div className="flex items-start gap-1.5">
                          {icon}
                          <p className="text-sm font-semibold text-gray-800 leading-snug">
                            {value || "—"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fee + Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                      Consultation Fee
                    </p>
                    <p className="text-xl font-black text-green-700">
                      {selectedAppointment.currency}
                      {selectedAppointment.consultationFee}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                      Payment
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedAppointment.cashOnAppointmentDay
                        ? "Cash on appointment day"
                        : "Already paid"}
                    </p>
                  </div>
                </div>

                {/* Disease / Notes */}
                {[
                  {
                    label: "Disease / Reason",
                    value: selectedAppointment.diseaseDetails,
                  },
                  {
                    label: "Doctor Notes",
                    value: selectedAppointment.doctorNotes,
                  },
                  {
                    label: "Admin Notes",
                    value: selectedAppointment.adminNotes,
                  },
                ].map(({ label, value }) =>
                  value ? (
                    <div
                      key={label}
                      className="bg-white rounded-xl border border-gray-100 p-4"
                    >
                      <p className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-semibold mb-1.5">
                        {label}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {value}
                      </p>
                    </div>
                  ) : null,
                )}

                {/* Applied at */}
                <p className="text-[0.65rem] text-gray-400 text-center">
                  Applied on{" "}
                  {new Date(selectedAppointment.appliedAt).toLocaleString(
                    "en-US",
                    { dateStyle: "medium", timeStyle: "short" },
                  )}
                </p>
              </div>
            )}

            {/* Modal footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0">
              <form method="dialog">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white
                                   border border-gray-200 rounded-xl hover:bg-[#f8faf9]"
                >
                  Close
                </button>
              </form>
              {selectedAppointment?.status === "pending" &&
                !selectedAppointment?.isAppointmentConfirmed && (
                  <button
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment._id);
                      document.getElementById("appointment_modal")?.close();
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600
                             hover:bg-red-700 rounded-xl transition-colors duration-200"
                  >
                    Cancel Appointment
                  </button>
                )}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </RoleGuard>
  );
};

export default AllAppointmentsPage;
