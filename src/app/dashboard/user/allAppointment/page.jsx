"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import {
  ArrowDownUp,
  Search,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  CheckSquare,
} from "lucide-react";

const AllAppointmentsPage = () => {
  const { data: session } = useSession();

  const itemsPerPage = 8;

  const [appointments, setAppointments] = useState([]);
  const [paginatedAppointments, setPaginatedAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] = useState(""); // "" = All

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ───────────────────────────────────────────────
  // Highlight matching text (same as DoctorPage)
  // ───────────────────────────────────────────────
  const highlightText = (text = "") => {
    if (!searchTerm.trim() || !text) return text;

    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    return text.replace(
      regex,
      '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>',
    );
  };

  // Fetch user's appointments
  const fetchAppointments = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/user/${session.user.id}`);
      const data = await res.json();

      if (res.ok) {
        setAppointments(data || []);
      } else {
        setError(data.message || "Failed to load appointments");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Something went wrong while loading appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [session]);

  // Real-time filtering + search
  useEffect(() => {
    let result = [...appointments];

    // Search by doctor name
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((appt) =>
        (appt.doctorName || "").toLowerCase().includes(term),
      );
    }

    // Filter by status
    if (sortStatus) {
      result = result.filter(
        (appt) => appt.status.toLowerCase() === sortStatus.toLowerCase(),
      );
    }

    setFilteredAppointments(result);
  }, [searchTerm, sortStatus, appointments]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Appointment cancelled successfully!");
        fetchAppointments();
      } else {
        alert(data.error || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong while cancelling.");
    }
  };

  const openModal = (appt) => {
    setSelectedAppointment(appt);
    document.getElementById("appointment_modal")?.showModal();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>
          </div>

          {/* Search + Status Filter */}
          <div className="mb-6 flex flex-col justify-between sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md text-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Status dropdown */}
            <div className="relative w-full sm:w-64 text-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowDownUp className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              {sortStatus && (
                <button
                  onClick={() => setSortStatus("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* No results */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow border border-gray-200 py-16 text-center text-gray-500">
              No appointments found
              {searchTerm || sortStatus
                ? ". Try changing search or filter."
                : "."}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-700">
                        Doctor
                      </th>
                      <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-right text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-indigo-50/30">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(appt.doctorName || "—"),
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {appt.appointmentDate}
                        </td>
                        <td className="px-3 py-4 text-center hidden md:table-cell">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-opacity-30 uppercase tracking-wide
                              ${
                                appt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                                  : appt.status === "confirmed"
                                    ? "bg-green-100 text-green-800 border-green-400"
                                    : appt.status === "rejected"
                                      ? "bg-red-100 text-red-800 border-red-400"
                                      : appt.status === "cancelled"
                                        ? "bg-gray-200 text-gray-800 border-gray-400"
                                        : appt.status === "completed"
                                          ? "bg-blue-100 text-blue-800 border-blue-400"
                                          : "bg-gray-100 text-gray-600 border-gray-300"
                              }`}
                          >
                            {appt.status === "pending" && <Clock size={14} />}
                            {appt.status === "confirmed" && (
                              <CheckCircle size={14} />
                            )}
                            {appt.status === "rejected" && (
                              <XCircle size={14} />
                            )}
                            {appt.status === "cancelled" && <Ban size={14} />}
                            {appt.status === "completed" && (
                              <CheckSquare size={14} />
                            )}
                            {appt.status.charAt(0).toUpperCase() +
                              appt.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm space-x-4">
                          <button
                            onClick={() => openModal(appt)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View
                          </button>

                          {appt.status === "pending" &&
                            !appt.isAppointmentConfirmed && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appt._id)
                                }
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Cancel
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredAppointments.length > 0 && (
            <div className="mt-6">
              <Pagination
                data={filteredAppointments}
                itemsPerPage={itemsPerPage}
                onPageDataChange={setPaginatedAppointments}
              />
            </div>
          )}
        </div>

        {/* ────────────────────────────────
             MODAL - FULLY INCLUDED
        ──────────────────────────────── */}
        <dialog id="appointment_modal" className="modal">
          <div className="modal-box max-w-2xl w-11/12">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="font-bold text-xl md:text-2xl">
                Appointment Details
              </h3>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            {selectedAppointment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Doctor</div>
                    <div className="font-medium text-lg">
                      {selectedAppointment.doctorName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedAppointment.doctorEmail}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date</div>
                    <div className="font-medium text-lg">
                      {selectedAppointment.appointmentDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Patient</div>
                    <div className="font-medium text-lg">
                      {selectedAppointment.patientName} •{" "}
                      {selectedAppointment.patientAge} yrs •{" "}
                      {selectedAppointment.patientGender}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div
                      className={`badge badge-lg ${
                        selectedAppointment.status === "pending"
                          ? "badge-warning"
                          : selectedAppointment.status === "confirmed"
                            ? "badge-success"
                            : selectedAppointment.status === "cancelled"
                              ? "badge-error"
                              : "badge-neutral"
                      }`}
                    >
                      {selectedAppointment.status.charAt(0).toUpperCase() +
                        selectedAppointment.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Disease / Reason
                    </div>
                    <p className="whitespace-pre-line">
                      {selectedAppointment.diseaseDetails || "Not specified"}
                    </p>
                  </div>

                  {selectedAppointment.doctorNotes && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Doctor Notes
                      </div>
                      <p className="whitespace-pre-line italic opacity-90">
                        {selectedAppointment.doctorNotes}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.adminNotes && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Admin Notes
                      </div>
                      <p className="whitespace-pre-line">
                        {selectedAppointment.adminNotes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Consultation Fee
                      </div>
                      <div className="text-xl font-semibold">
                        {selectedAppointment.currency}
                        {selectedAppointment.consultationFee}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Payment Method
                      </div>
                      <div className="text-base">
                        {selectedAppointment.cashOnAppointmentDay
                          ? "Cash on appointment day"
                          : "Already paid"}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 pt-2">
                    Applied:{" "}
                    {new Date(selectedAppointment.appliedAt).toLocaleString(
                      "en-US",
                      { dateStyle: "medium", timeStyle: "short" },
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="modal-action mt-8">
              <form method="dialog">
                <button className="btn btn-outline">Close</button>
              </form>

              {selectedAppointment?.status === "pending" &&
                !selectedAppointment?.isAppointmentConfirmed && (
                  <button
                    className="btn btn-error"
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment._id);
                      document.getElementById("appointment_modal")?.close();
                    }}
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
