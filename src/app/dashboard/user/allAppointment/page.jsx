"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import {
  Search,
  X,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  CheckSquare,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link"; // only if needed — not used here but kept for future

const AllAppointmentsPage = () => {
  const { data: session } = useSession();

  const itemsPerPage = 8;

  const [appointments, setAppointments] = useState([]);
  const [paginatedAppointments, setPaginatedAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // "" = All

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ───────────────────────────────────────────────
  // Highlight matching text
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

  const fetchAppointments = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/user/${session.user.id}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
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

  // Search + status filter (mirrors doctors page logic)
  useEffect(() => {
    let result = [...appointments];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((appt) =>
        (appt.doctorName || "").toLowerCase().includes(term),
      );
    }

    if (selectedStatus) {
      result = result.filter(
        (appt) => appt.status.toLowerCase() === selectedStatus.toLowerCase(),
      );
    }

    setFilteredAppointments(result);
  }, [appointments, searchTerm, selectedStatus]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedStatus("");

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (res.ok) {
        // toast.success("Appointment cancelled");  // ← add if you want
        fetchAppointments();
      } else {
        alert(data.error || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while cancelling.");
    }
  };

  const openModal = (appt) => {
    setSelectedAppointment(appt);
    document.getElementById("appointment_modal")?.showModal();
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={["user"]}>
        <div className="p-6 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">
            Loading appointments...
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["user"]}>
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
          <button
            onClick={fetchAppointments}
            className="ml-4 btn btn-sm btn-outline btn-error"
          >
            Retry
          </button>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header ─ same as doctors page */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Appointments
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchAppointments}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search + Filter ─ identical layout */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
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
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white appearance-none"
            >
              <option value="">Filter by Status (All)</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            {selectedStatus && (
              <button
                onClick={clearFilter}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Table / Empty state ─ matched style */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm || selectedStatus
                ? "No appointments match your search/filter criteria."
                : "You have no appointments yet."}
            </p>
            {(searchTerm || selectedStatus) && (
              <p className="mt-2 text-sm">
                Try adjusting your search or{" "}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("");
                  }}
                  className="text-blue-600 hover:underline"
                >
                  clear filters
                </button>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow-sm ring-1 ring-black/5 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedAppointments.map((appt, index) => (
                    <tr
                      key={appt._id}
                      className="hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      <td className="px-4 py-5 sm:px-6 text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <div
                          className="font-medium text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(appt.doctorName || "—"),
                          }}
                        />
                        <div className="text-sm text-gray-600 mt-0.5">
                          {appt.doctorEmail || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-gray-700 whitespace-nowrap">
                        {appt.appointmentDate || "—"}
                      </td>

                      <td className="hidden md:table-cell px-4 py-5 sm:px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appt.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appt.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : appt.status === "cancelled"
                                    ? "bg-gray-100 text-gray-800"
                                    : appt.status === "completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appt.status.charAt(0).toUpperCase() +
                            appt.status.slice(1)}
                        </span>
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => openModal(appt)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                          >
                            Details{" "}
                            <ArrowDownRight size={17} className="-rotate-90" />
                          </button>

                          {appt.status === "pending" &&
                            !appt.isAppointmentConfirmed && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appt._id)
                                }
                                className="text-red-600 hover:text-red-800"
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

            <Pagination
              data={filteredAppointments}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedAppointments}
            />
          </>
        )}

        {/* ───────────────────────────────────────────────
            Modal (cleaned up a bit, same tailwind classes)
        ─────────────────────────────────────────────── */}
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
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        selectedAppointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedAppointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : selectedAppointment.status === "cancelled"
                              ? "bg-gray-100 text-gray-800"
                              : selectedAppointment.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedAppointment.status.charAt(0).toUpperCase() +
                        selectedAppointment.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="divider my-6"></div>

                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Disease / Reason
                    </div>
                    <p className="whitespace-pre-line leading-relaxed">
                      {selectedAppointment.diseaseDetails || "Not specified"}
                    </p>
                  </div>

                  {selectedAppointment.doctorNotes && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Doctor Notes
                      </div>
                      <p className="whitespace-pre-line italic text-gray-700">
                        {selectedAppointment.doctorNotes}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.adminNotes && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Admin Notes
                      </div>
                      <p className="whitespace-pre-line text-gray-700">
                        {selectedAppointment.adminNotes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Consultation Fee
                      </div>
                      <div className="text-xl font-semibold text-teal-700">
                        {selectedAppointment.currency}
                        {selectedAppointment.consultationFee}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Payment Method
                      </div>
                      <div className="text-base font-medium">
                        {selectedAppointment.cashOnAppointmentDay
                          ? "Cash on appointment day"
                          : "Already paid"}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 pt-3">
                    Applied on:{" "}
                    {new Date(selectedAppointment.appliedAt).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
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
