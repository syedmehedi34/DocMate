// src/app/dashboard/admin/patients/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-users-and-appointment");
      if (!res.ok) throw new Error("Failed to load data");

      const allPatients = await res.json();
      const found = allPatients.find((p) => p._id === id);

      if (!found) throw new Error("Patient not found");
      setPatient(found);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load patient details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-teal-600">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Patient not found"}</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.back()} className="btn btn-outline">
              Go Back
            </button>
            <button onClick={fetchPatient} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const apptCount = patient.appointments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-circle btn-outline btn-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Patient Details
            </h1>
          </div>

          <button
            onClick={fetchPatient}
            className="btn btn-outline btn-sm gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Patient Profile */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-40 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-4 ring-white shadow-xl">
                  <img
                    src={patient.image || "https://i.ibb.co/33gs5fP/user.png"}
                    alt={patient.name}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {patient.name || "Unknown Patient"}
            </h2>
            <p className="text-gray-600 mb-6">ID: {patient._id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 py-2">
                <div className="text-teal-600 mt-0.5">
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-800 break-all">
                    {patient.email || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="text-teal-600 mt-0.5">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-800">
                    {patient.appointmentNumber || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="text-teal-600 mt-0.5">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium text-gray-800">
                    {patient.gender || "Not Mentioned"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="text-teal-600 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium text-gray-800">
                    {patient.location || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="text-teal-600 mt-0.5">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div className="font-medium text-gray-800">
                    {new Date(patient.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {patient.about && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-teal-700">
                  <Stethoscope size={20} />
                  About Patient
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {patient.about}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar size={24} className="text-teal-600" />
              Appointment History
            </h2>
            <span className="badge badge-lg badge-outline badge-info">
              {apptCount} Total
            </span>
          </div>

          {apptCount > 0 ? (
            <div className="space-y-6">
              {patient.appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-gray-50 p-6 rounded-xl border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Dr. {appt.doctorName}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {appt.appointmentDate}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        appt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : appt.status === "rejected"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appt.status.charAt(0).toUpperCase() +
                        appt.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="font-medium block mb-2 text-gray-800">
                        Patient Info
                      </span>
                      <div>Name: {appt.patientName}</div>
                      <div>Age: {appt.patientAge} years</div>
                      <div>Gender: {appt.patientGender}</div>
                      {appt.patientPhone && (
                        <div>Phone: {appt.patientPhone}</div>
                      )}
                      {appt.patientEmail && (
                        <div>Email: {appt.patientEmail}</div>
                      )}
                    </div>

                    <div>
                      <span className="font-medium block mb-2 text-gray-800">
                        Consultation
                      </span>
                      <div className="font-medium text-teal-700 mb-1">
                        {appt.consultationFee} {appt.currency}
                      </div>
                      <div>
                        Cash on Day: {appt.cashOnAppointmentDay ? "Yes" : "No"}
                      </div>
                      <div>
                        Applied: {new Date(appt.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {appt.diseaseDetails && (
                    <div className="mt-6 pt-5 border-t">
                      <span className="font-medium block mb-2 text-gray-800">
                        Reason / Disease Details
                      </span>
                      <p className="bg-white p-4 rounded-lg border text-gray-700 whitespace-pre-line">
                        {appt.diseaseDetails}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 italic bg-gray-50 rounded-xl">
              This patient has no appointments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
