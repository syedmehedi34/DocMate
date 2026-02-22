"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";

const AllAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // ← added
  const [error, setError] = useState(null); // optional but recommended
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
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

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

  const openDetails = (appt) => setSelectedAppointment(appt);
  const closeDetails = () => setSelectedAppointment(null);

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
                    <td className="px-4 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => openDetails(appt)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>

                      {appt.status === "pending" &&
                        !appt.isAppointmentConfirmed && (
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            className="text-red-600 hover:text-red-800 font-medium ml-3"
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
        )}

        {/* Modal - remains unchanged */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Appointment Details</h2>
                  <button
                    onClick={closeDetails}
                    className="text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* ... rest of modal content same as before ... */}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={closeDetails}
                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default AllAppointmentsPage;
