"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Stethoscope,
  AlertCircle,
  Clock,
  DollarSign,
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
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="flex items-center gap-3 text-teal-600 text-lg">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading patient profile...</span>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-lg w-full border border-red-100">
          <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Unable to load profile
          </h2>
          <p className="text-gray-600 mb-8">
            {error || "Patient record not found"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-outline btn-lg normal-case"
            >
              ← Go Back
            </button>
            <button
              onClick={fetchPatient}
              className="btn btn-primary btn-lg normal-case"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const apptCount = patient.appointments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-circle btn-outline btn-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Patient Profile
            </h1>
          </div>

          <button
            onClick={fetchPatient}
            className="btn btn-outline btn-sm gap-2 normal-case"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 overflow-hidden mb-10">
          {/* Cover + Avatar */}
          <div className="relative h-48 bg-linear-to-r from-teal-600 to-teal-500">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="avatar">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white shadow-xl object-cover border border-gray-200">
                  <img
                    src={patient.image || "https://i.ibb.co/33gs5fP/user.png"}
                    alt={patient.name || "Patient"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 px-6 sm:px-8 pb-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {patient.name || "Unknown Patient"}
              </h2>
              <p className="text-gray-500 font-medium">
                Patient ID: <span className="text-gray-700">{patient._id}</span>
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value={patient.email || "—"}
              />
              <InfoItem
                icon={<Phone size={18} />}
                label="Phone"
                value={patient.appointmentNumber || "—"}
              />
              <InfoItem
                icon={<User size={18} />}
                label="Gender"
                value={patient.gender || "Not specified"}
              />
              <InfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value={patient.location || "—"}
              />
              <InfoItem
                icon={<Calendar size={18} />}
                label="Last Updated"
                value={
                  patient.updatedAt
                    ? new Date(patient.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"
                }
              />
            </div>

            {patient.about && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                  <Stethoscope size={20} className="text-teal-600" />
                  About the Patient
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {patient.about}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar size={24} className="text-teal-600" />
              Appointment History
            </h2>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-teal-50 text-teal-800 border border-teal-200">
              {apptCount} {apptCount === 1 ? "Appointment" : "Appointments"}
            </span>
          </div>

          {apptCount === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-50/70 rounded-xl border border-gray-200">
              <Calendar size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">
                No appointments recorded yet.
              </p>
              <p className="mt-2">Future appointments will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {patient.appointments.map((appt, index) => (
                <div
                  key={appt._id}
                  className="bg-gray-50/60 p-6 rounded-xl border border-gray-200 hover:border-teal-200 hover:shadow transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    {/* Numbering + Doctor Info */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Number badge */}
                      <div className="shrink-0 mt-1">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-semibold text-sm ring-1 ring-teal-200/70">
                          #{index + 1}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Dr. {appt.doctorName}
                        </h3>
                        <p className="text-gray-600 mt-1 flex items-center gap-1.5">
                          <Clock size={16} className="opacity-70" />
                          {appt.appointmentDate}
                        </p>
                      </div>
                    </div>

                    {/* Status badge on the right */}
                    <StatusBadge status={appt.status} />
                  </div>

                  {/* Patient Details & Consultation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2.5">
                        Patient Details
                      </h4>
                      <div className="space-y-1.5 text-gray-700">
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
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2.5">
                        Consultation
                      </h4>
                      <div className="space-y-1.5 text-gray-700">
                        <div className="flex items-center gap-1.5 font-medium text-teal-700">
                          <DollarSign size={16} />
                          {appt.consultationFee} {appt.currency}
                        </div>
                        <div>
                          Cash on Day:{" "}
                          {appt.cashOnAppointmentDay ? "Yes" : "No"}
                        </div>
                        <div>
                          Applied:{" "}
                          {new Date(appt.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disease / Reason Details */}
                  {appt.diseaseDetails && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Reason / Disease Details
                      </h4>
                      <div className="bg-white p-5 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-line leading-relaxed">
                        {appt.diseaseDetails}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable components
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3.5 py-1">
      <div className="text-teal-600 mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </div>
        <div className="font-medium text-gray-900 mt-0.5 wrap-break-word">
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    rejected: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const base = "px-4 py-1.5 rounded-full text-sm font-medium border";

  return (
    <span
      className={`${base} ${styles[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}
