"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";

const DoctorAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorId = session?.user?.id;
      if (!doctorId) {
        throw new Error("Doctor ID not found in session");
      }

      const res = await fetch(`/api/pending-appointments?doctorId=${doctorId}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingAppointments();
    }
  }, [session]);

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
          "Appointment " +
            (approved ? "approved" : "rejected") +
            " successfully.",
        );
        fetchPendingAppointments(); // refresh list
      } else {
        alert(result.message || "Failed to update appointment status.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading appointments...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

        {appointments.length === 0 ? (
          <p>No pending appointment requests found.</p>
        ) : (
          <table className="table w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th>Patient Name</th>
                <th>Patient Email</th>
                <th>Phone</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.patientName}</td>
                  <td>{appt.patientEmail}</td>
                  <td>{appt.patientPhone}</td>
                  <td>{appt.diseaseDetails}</td>
                  <td>{appt.appointmentDate}</td>
                  <td>{appt.time || "—"}</td>
                  <td>Pending</td>
                  <td>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => handleDecision(appt._id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDecision(appt._id, false)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorAppointmentsPage;
