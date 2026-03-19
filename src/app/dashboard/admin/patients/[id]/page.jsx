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
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle,
  Ban,
  CircleDashed,
  BadgeCheck,
  Hash,
} from "lucide-react";

/* ── status config ── */
const statusConfig = {
  confirmed: {
    cls: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 size={11} />,
  },
  pending: {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <CircleDashed size={11} />,
  },
  cancelled: {
    cls: "bg-gray-100 text-gray-500  border-gray-200",
    icon: <Ban size={11} />,
  },
  rejected: {
    cls: "bg-red-50   text-red-600   border-red-200",
    icon: <XCircle size={11} />,
  },
  completed: {
    cls: "bg-blue-50  text-blue-700  border-blue-200",
    icon: <BadgeCheck size={11} />,
  },
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase() || "pending";
  const cfg = statusConfig[key] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.cls}`}
    >
      {cfg.icon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-[#f8faf9] border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 shrink-0">
        <Icon size={14} className="text-green-700" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 wrap-break-word">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ── avatar initials ── */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
const avatarColor = (name = "") => {
  const colors = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

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
      const all = await res.json();
      const found = all.find((p) => p._id === id);
      if (!found) throw new Error("Patient not found");
      setPatient(found);
    } catch (err) {
      setError(err.message || "Could not load patient details.");
    } finally {
      setLoading(false);
    }
  };

  /* ── guards ── */
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading patient profile...</p>
      </div>
    );

  if (error || !patient)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-700">
            Unable to load profile
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {error || "Patient record not found."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600
                     bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <button
            onClick={fetchPatient}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white
                     bg-green-700 rounded-xl hover:bg-green-800"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );

  const apptCount = patient.appointments?.length || 0;

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-200
                       text-gray-500 hover:bg-[#f8faf9] hover:border-green-200 transition-all duration-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>
            <h1 className="text-xl font-black text-gray-900 leading-none mt-0.5">
              Patient Profile
            </h1>
          </div>
        </div>
        <button
          onClick={fetchPatient}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                     bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#f8faf9]
                     hover:border-green-200 transition-all duration-200"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ══════════ PROFILE CARD ══════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
        {/* Banner */}
        <div
          className="relative h-36 rounded-t-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0d2b1f 0%, #14532d 55%, #166534 100%)",
          }}
        >
          <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/4" />
          <div className="absolute right-16 bottom-0 w-28 h-28 rounded-full bg-green-400/10 translate-y-1/2" />
        </div>

        <div className="px-6 sm:px-8 pb-7">
          {/* Avatar row */}
          <div className="flex items-end gap-5 -translate-y-10 mb-0">
            <div className="relative shrink-0">
              {patient.image ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center
                                justify-center text-2xl font-black ${avatarColor(patient.name || "")}`}
                >
                  {initials(patient.name || "")}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-[3px] border-white" />
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-2xl font-black text-gray-900 truncate mb-1.5">
                {patient.name || "Unknown Patient"}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold
                                 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full"
                >
                  <User size={10} /> Patient
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold
                                 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full"
                >
                  <CalendarDays size={10} /> {apptCount} Appointment
                  {apptCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 -mt-4">
            <InfoCard icon={Mail} label="Email" value={patient.email} />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={patient.appointmentNumber}
            />
            <InfoCard icon={User} label="Gender" value={patient.gender} />
            <InfoCard icon={MapPin} label="Location" value={patient.location} />
            <InfoCard
              icon={Calendar}
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
            <div className="flex items-start gap-3 bg-[#f8faf9] border border-gray-100 rounded-xl px-4 py-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 shrink-0">
                <Hash size={14} className="text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                  Patient ID
                </p>
                <p className="text-[0.65rem] font-mono text-gray-500 break-all">
                  {patient._id}
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          {patient.about && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
                  <FileText size={13} className="text-green-700" />
                </div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  About
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {patient.about}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ APPOINTMENTS ══════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8faf9]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
              <CalendarDays size={13} className="text-green-700" />
            </div>
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
              Appointment History
            </h2>
          </div>
          <span
            className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full border
            ${apptCount > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}
          >
            {apptCount} {apptCount === 1 ? "appointment" : "appointments"}
          </span>
        </div>

        {/* Body */}
        <div className="p-6">
          {apptCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                              flex items-center justify-center mb-3"
              >
                <CalendarDays size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No appointments recorded yet.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Future appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.appointments.map((appt, index) => (
                <div
                  key={appt._id}
                  className="border border-gray-100 rounded-2xl overflow-hidden hover:border-green-100
                             hover:shadow-sm transition-all duration-200"
                >
                  {/* Appointment header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-[#f8faf9] border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-xl bg-green-100
                                       text-green-700 text-xs font-black shrink-0"
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Dr. {appt.doctorName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <Clock size={11} /> {appt.appointmentDate}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>

                  {/* Appointment body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                    {/* Patient details */}
                    <div>
                      <p className="text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                        Patient Details
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { label: "Name", value: appt.patientName },
                          {
                            label: "Age",
                            value: appt.patientAge
                              ? `${appt.patientAge} years`
                              : null,
                          },
                          { label: "Gender", value: appt.patientGender },
                          { label: "Phone", value: appt.patientPhone },
                          { label: "Email", value: appt.patientEmail },
                        ]
                          .filter((r) => r.value)
                          .map(({ label, value }) => (
                            <div
                              key={label}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span className="text-gray-400 min-w-12 shrink-0">
                                {label}
                              </span>
                              <span className="font-semibold text-gray-700">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Consultation */}
                    <div>
                      <p className="text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                        Consultation
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={13} className="text-green-600" />
                          <span className="text-sm font-black text-green-700">
                            {appt.consultationFee} {appt.currency}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="text-gray-400">Cash on Day: </span>
                          <span className="font-semibold text-gray-700">
                            {appt.cashOnAppointmentDay ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="text-gray-400">Applied: </span>
                          <span className="font-semibold text-gray-700">
                            {new Date(appt.appliedAt).toLocaleDateString(
                              "en-US",
                              { dateStyle: "medium" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disease details */}
                  {appt.diseaseDetails && (
                    <div className="px-5 pb-5">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-2">
                          Reason / Disease Details
                        </p>
                        <div
                          className="bg-[#f8faf9] border border-gray-100 rounded-xl px-4 py-3
                                        text-sm text-gray-600 leading-relaxed whitespace-pre-line"
                        >
                          {appt.diseaseDetails}
                        </div>
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
