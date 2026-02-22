"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";

const DoctorAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // all pending appointments
  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorId = session?.user?.id;
      if (!doctorId) throw new Error("Doctor ID not found in session");

      const res = await fetch(`/api/pending-appointments?doctorId=${doctorId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load pending appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingAppointments();
    }
  }, [session]);

  // handle approve or reject
  const handleDecision = async (appointmentId, approved) => {
    try {
      const res = await fetch("/api/appointments/decision", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, approved }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          `Appointment ${approved ? "approved" : "rejected"} successfully.`,
        );
        fetchPendingAppointments();
      } else {
        alert(result.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Decision error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">
          Loading appointments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Pending Appointment Requests
          </h2>
          <span className="text-sm text-gray-500">
            {appointments.length} pending
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              No pending appointment requests at the moment.
            </p>
            <p className="mt-2 text-sm">
              New requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm ring-1 ring-black/5 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Contact
                  </th>

                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Date
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-blue-50/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-5 sm:px-6">
                      <div className="font-medium text-gray-900">
                        {appt.patientName || "—"}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {/* Age {appt.patientAge || "?"} •{" "} */}
                        {appt.patientGender || "—"} ({appt.patientAge || "?"}{" "}
                        Yrs)
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 py-5 sm:px-6">
                      <div className="text-sm text-gray-900">
                        {appt.applicantEmail || appt.patientEmail || "—"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appt.patientPhone || "—"}
                      </div>
                    </td>

                    <td className="hidden lg:table-cell px-4 py-5 sm:px-6 whitespace-nowrap text-sm text-gray-700">
                      {appt.appointmentDate || "—"}
                    </td>

                    <td className="px-4 py-5 sm:px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>

                    <td className="px-4 py-5 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDecision(appt._id, true)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleDecision(appt._id, false)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorAppointmentsPage;
