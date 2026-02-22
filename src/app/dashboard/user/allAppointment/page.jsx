"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";

const AllAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/cancel`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Appointment cancelled successfully!");
        fetchAppointments();
      } else {
        alert(data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong while cancelling.");
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [session]);

  const openModal = (appt) => {
    setSelectedAppointment(appt);
    // DaisyUI modal open
    document.getElementById("appointment_modal")?.showModal();
  };

  const closeAndCancel = () => {
    if (
      selectedAppointment?.status === "pending" &&
      !selectedAppointment?.isAppointmentConfirmed
    ) {
      handleCancelAppointment(selectedAppointment._id);
    }
    // Modal will close automatically via form method="dialog"
  };

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          My Appointments
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            You don't have any appointments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">
                    Patient
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{appt.doctorName}</td>
                    <td className="px-4 py-4 text-sm">
                      {appt.appointmentDate}
                    </td>
                    <td className="px-3 py-4 text-sm hidden md:table-cell">
                      {appt.patientName} ({appt.patientAge},{" "}
                      {appt.patientGender})
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                          appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appt.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm space-x-3">
                      <button
                        onClick={() => openModal(appt)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>

                      {/* {appt.status === "pending" &&
                        !appt.isAppointmentConfirmed && (
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel
                          </button>
                        )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ────────────────────────────────────────────────
            Modal Section
        ──────────────────────────────────────────────── */}
        <dialog id="appointment_modal" className="modal">
          <div className="modal-box max-w-2xl w-11/12">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="font-bold text-xl md:text-2xl">
                Appointment Details
              </h3>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            {/* Content */}
            {selectedAppointment && (
              <div className="space-y-6">
                {/* Main info grid */}
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

                {/* Details */}
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
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
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

          {/* Click outside closes modal */}
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </RoleGuard>
  );
};

export default AllAppointmentsPage;
