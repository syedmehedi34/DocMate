"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";

const DoctorPatientsPage = () => {
  const { data: session } = useSession();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDoctorPatients();
    }
  }, [session]);

  const fetchDoctorPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/patients");

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setPatients(data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
      setError(err.message || "Could not load patient list.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading patients...</div>;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
        <button
          onClick={fetchDoctorPatients}
          className="ml-4 btn btn-sm btn-outline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">My Patients</h2>

        {patients.length === 0 ? (
          <div className="alert alert-info">
            <span>No patients have booked appointments with you yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Disease / Reason</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient._id || index}>
                    <td>{index + 1}</td>
                    <td className="font-medium">
                      {patient.patientName || "—"}
                    </td>
                    <td>{patient.patientEmail || patient.email || "—"}</td>
                    <td>{patient.patientPhone || patient.phone || "N/A"}</td>
                    <td>
                      {patient.diseaseDetails ||
                        patient.reason ||
                        patient.disease ||
                        "—"}
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

export default DoctorPatientsPage;
