"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  DollarSign,
  CheckCircle2,
  CalendarDays,
  Save,
  X,
  Plus,
  FileText,
} from "lucide-react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

/* ── shared input style ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl " +
  "outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 " +
  "transition-all duration-200 text-gray-800 placeholder-gray-400";

const inlineCls =
  "border-b border-gray-200 focus:border-green-500 focus:outline-none " +
  "bg-transparent text-sm text-gray-800 placeholder-gray-400 py-0.5 w-full";

/* ── reusable section card ── */
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8faf9]">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
        <Icon size={13} className="text-green-700" />
      </div>
      <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
        {title}
      </h2>
    </div>
    {action}
  </div>
);

/* ── timeline item ── */
const TimelineItem = ({ children, editMode, onRemove }) => (
  <div className="relative pl-5 group">
    <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-green-500 bg-green-50" />
    {editMode && (
      <button
        onClick={onRemove}
        className="absolute -right-2 -top-1 w-5 h-5 bg-red-500 text-white rounded-full
                   flex items-center justify-center opacity-0 group-hover:opacity-100
                   transition-opacity shadow-sm"
      >
        <X size={11} />
      </button>
    )}
    {children}
  </div>
);

/* ── DoctorProfileDashboard ── */
const DoctorProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [datesEditMode, setDatesEditMode] = useState(false);
  const [tempDates, setTempDates] = useState([]);

  useEffect(() => {
    if (user) {
      setDoctor(user);
      setTempDates(user.openAppointmentsDates || []);
    }
  }, [user]);

  const toggleEditMode = () => setEditMode(!editMode);
  const handleChange = (field, value) =>
    setDoctor((p) => ({ ...p, [field]: value }));
  const handleArrayChange = (field, index, value) =>
    setDoctor((p) => {
      const a = [...(p[field] || [])];
      a[index] = value;
      return { ...p, [field]: a };
    });
  const handleNestedChange = (parent, index, subField, value) =>
    setDoctor((p) => {
      const a = [...(p[parent] || [])];
      a[index] = { ...a[index], [subField]: value };
      return { ...p, [parent]: a };
    });
  const addNewItem = (field, template) =>
    setDoctor((p) => ({ ...p, [field]: [...(p[field] || []), template] }));
  const removeItem = (field, index) =>
    setDoctor((p) => ({
      ...p,
      [field]: (p[field] || []).filter((_, i) => i !== index),
    }));

  /* ── save profile ── */
  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Save Changes?</h3>
            <p className="mt-1 text-sm text-gray-500">
              This will update your doctor profile.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3 bg-[#f8faf9]">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading("Updating profile...");
                try {
                  if (!doctor?._id) throw new Error("Doctor ID missing");
                  const res = await fetch(`/api/users/${doctor._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(doctor),
                  });
                  if (!res.ok) {
                    const e = await res.json();
                    throw new Error(e.error || "Update failed");
                  }
                  const updated = await res.json();
                  toast.success("Profile updated successfully!", {
                    id: loadingId,
                  });
                  setEditMode(false);
                  setDoctor(updated);
                } catch (err) {
                  toast.error(err.message || "Failed to update profile", {
                    id: loadingId,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        },
      },
    );
  };

  /* ── save dates ── */
  const saveDates = () => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              Update Available Dates?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This will update your availability calendar.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3 bg-[#f8faf9]">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading("Saving dates...");
                try {
                  if (!doctor?._id) throw new Error("Doctor ID missing");
                  const datesToSend = tempDates
                    .filter((d) => d instanceof Date && !isNaN(d.getTime()))
                    .map((d) => d.toISOString());
                  const res = await fetch(`/api/users/${doctor._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      openAppointmentsDates: datesToSend,
                    }),
                  });
                  if (!res.ok) {
                    const e = await res.json();
                    throw new Error(e.error || "Update failed");
                  }
                  const updated = await res.json();
                  toast.success("Availability dates updated!", {
                    id: loadingId,
                  });
                  setDoctor(updated);
                  setDatesEditMode(false);
                  setTempDates(
                    updated.openAppointmentsDates?.map((d) => new Date(d)) ||
                      [],
                  );
                } catch (err) {
                  toast.error(err.message || "Failed to save dates", {
                    id: loadingId,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        },
      },
    );
  };

  if (isLoading || !doctor)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );
  if (error)
    return <p className="p-6 text-sm text-red-400">Error loading profile.</p>;

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ══════════ HEADER CARD ══════════ */}
      <Card className="overflow-visible">
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

          {/* Edit buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {editMode ? (
              <>
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white
                             bg-green-500/80 hover:bg-green-400 rounded-xl border border-green-400/30
                             backdrop-blur-sm transition-all"
                >
                  <Save size={13} /> Save
                </button>
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white
                             bg-white/10 hover:bg-white/20 rounded-xl border border-white/20
                             backdrop-blur-sm transition-all"
                >
                  <X size={13} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleEditMode}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white
                           bg-white/10 hover:bg-white/20 rounded-xl border border-white/20
                           backdrop-blur-sm transition-all"
              >
                <Edit2 size={13} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Avatar + info */}
        <div className="px-6 sm:px-8 pb-7">
          <div className="flex items-end gap-5 -translate-y-10 mb-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={doctor.doctorImageUrl || "/default-doctor.jpg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {doctor.currentStatus === "available" && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-[3px] border-white" />
              )}
            </div>

            {/* Name + category */}
            <div className="flex-1 min-w-0 pb-1">
              {editMode ? (
                <input
                  type="text"
                  value={doctor.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-2xl font-black text-gray-900 border-b-2 border-green-400
                             focus:outline-none bg-transparent w-full mb-1.5"
                />
              ) : (
                <h1 className="text-2xl font-black text-gray-900 truncate mb-1.5">
                  {doctor.name || "—"}
                </h1>
              )}
              <div className="flex items-center gap-2">
                {editMode ? (
                  <input
                    type="text"
                    value={doctor.doctorCategory || ""}
                    onChange={(e) =>
                      handleChange("doctorCategory", e.target.value)
                    }
                    className="text-sm font-semibold text-green-700 border-b border-green-300 focus:outline-none bg-transparent"
                  />
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold
                                   bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full"
                  >
                    <Stethoscope size={10} /> {doctor.doctorCategory || "—"}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize
                  ${
                    doctor.currentStatus === "available"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : doctor.currentStatus === "busy"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${doctor.currentStatus === "available" ? "bg-green-500" : "bg-amber-400"}`}
                  />
                  {doctor.currentStatus || "available"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 -mt-4">
            {[
              {
                icon: Mail,
                field: "appointmentEmail",
                fallback: "email",
                type: "email",
                label: "Email",
                placeholder: "Appointment email",
              },
              {
                icon: Phone,
                field: "appointmentNumber",
                type: "tel",
                label: "Phone",
                placeholder: "Phone number",
              },
              {
                icon: MapPin,
                field: "location",
                type: "text",
                label: "Location",
                placeholder: "Location",
              },
            ].map(
              ({ icon: Icon, field, fallback, type, label, placeholder }) => (
                <div
                  key={field}
                  className="flex items-center gap-3 bg-[#f8faf9] border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 shrink-0">
                    <Icon size={14} className="text-green-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                      {label}
                    </p>
                    {editMode ? (
                      <input
                        type={type}
                        value={
                          doctor[field] ||
                          (fallback ? doctor[fallback] : "") ||
                          ""
                        }
                        placeholder={placeholder}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="text-sm font-medium text-gray-800 bg-transparent w-full outline-none
                                 border-b border-green-300 placeholder-gray-300"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {doctor[field] || (fallback && doctor[fallback]) || (
                          <span className="text-gray-300 text-xs">Not set</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </Card>

      {/* ══════════ AVAILABILITY DATES ══════════ */}
      <Card>
        <CardHeader
          icon={CalendarDays}
          title="Upcoming Available Dates"
          action={
            datesEditMode ? (
              <div className="flex gap-2">
                <button
                  onClick={saveDates}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white
                             bg-green-700 hover:bg-green-800 rounded-xl transition-colors"
                >
                  <Save size={12} /> Save
                </button>
                <button
                  onClick={() => {
                    setDatesEditMode(false);
                    setTempDates(
                      doctor?.openAppointmentsDates?.map((d) => new Date(d)) ||
                        [],
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600
                             bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDatesEditMode(true);
                  setTempDates(
                    doctor?.openAppointmentsDates?.map((d) => new Date(d)) ||
                      [],
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700
                           bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
              >
                <Edit2 size={12} /> Edit Dates
              </button>
            )
          }
        />
        <div className="p-6">
          {datesEditMode ? (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 mb-4">
                Add dates when you will be physically available. Patients can
                only book on these dates.
              </p>
              <div className="space-y-2.5">
                {tempDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <input
                      type="date"
                      value={
                        date instanceof Date && !isNaN(date)
                          ? date.toISOString().split("T")[0]
                          : ""
                      }
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        const newDates = [...tempDates];
                        const selected = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        if (selected) {
                          newDates[index] = selected;
                          setTempDates(
                            newDates.filter(
                              (d) => d instanceof Date && !isNaN(d.getTime()),
                            ),
                          );
                        } else {
                          setTempDates(newDates.filter((_, i) => i !== index));
                        }
                      }}
                      className={inputCls}
                    />
                    <button
                      onClick={() =>
                        setTempDates(tempDates.filter((_, i) => i !== index))
                      }
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    setTempDates([...tempDates, t]);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 mt-2"
                >
                  <Plus size={15} /> Add New Date
                </button>
              </div>
            </div>
          ) : (
            <div>
              {doctor?.openAppointmentsDates?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[...doctor.openAppointmentsDates]
                    .map((d) => new Date(d))
                    .sort((a, b) => a - b)
                    .map((date, i) => (
                      <div
                        key={i}
                        className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center
                                              hover:border-green-300 hover:bg-green-100 transition-colors"
                      >
                        <p className="text-sm font-bold text-green-800">
                          {date.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          {date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#f8faf9] border border-gray-100
                                  flex items-center justify-center mb-3"
                  >
                    <CalendarDays size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">
                    No upcoming dates added yet.
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Patients can't book until you add available dates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ══════════ MAIN GRID ══════════ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader icon={FileText} title="About" />
            <div className="p-6">
              {editMode ? (
                <textarea
                  value={doctor.about || ""}
                  rows={5}
                  placeholder="Write a professional summary..."
                  onChange={(e) => handleChange("about", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {doctor.about || (
                    <span className="text-gray-300 italic">
                      No professional summary added yet.
                    </span>
                  )}
                </p>
              )}
            </div>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader
              icon={Briefcase}
              title="Professional Experience"
              action={
                editMode && (
                  <button
                    onClick={() =>
                      addNewItem("worksAndExperiences", {
                        position: "",
                        workedAt: "",
                        duration: "",
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50
                             hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-xl"
                  >
                    <Plus size={12} /> Add
                  </button>
                )
              }
            />
            <div className="p-6">
              {doctor.worksAndExperiences?.length > 0 ? (
                <div className="space-y-5 border-l-2 border-gray-100 pl-4">
                  {doctor.worksAndExperiences.map((exp, idx) => (
                    <TimelineItem
                      key={idx}
                      editMode={editMode}
                      onRemove={() => removeItem("worksAndExperiences", idx)}
                    >
                      {editMode ? (
                        <div className="space-y-1.5 ml-2">
                          {[
                            ["position", "Position"],
                            ["workedAt", "Worked At"],
                            ["duration", "Duration"],
                          ].map(([f, p]) => (
                            <input
                              key={f}
                              value={exp[f] || ""}
                              placeholder={p}
                              onChange={(e) =>
                                handleNestedChange(
                                  "worksAndExperiences",
                                  idx,
                                  f,
                                  e.target.value,
                                )
                              }
                              className={inlineCls}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="ml-2">
                          <p className="text-sm font-bold text-gray-900">
                            {exp.position || "—"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {exp.workedAt || "—"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {exp.duration || "—"}
                          </p>
                        </div>
                      )}
                    </TimelineItem>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 italic">
                  No experience added yet.
                </p>
              )}
            </div>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader
              icon={GraduationCap}
              title="Education"
              action={
                editMode && (
                  <button
                    onClick={() =>
                      addNewItem("educations", {
                        degree: "",
                        institution: "",
                        year: "",
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50
                             hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-xl"
                  >
                    <Plus size={12} /> Add
                  </button>
                )
              }
            />
            <div className="p-6">
              {doctor.educations?.length > 0 ? (
                <div className="space-y-5 border-l-2 border-gray-100 pl-4">
                  {doctor.educations.map((edu, idx) => (
                    <TimelineItem
                      key={idx}
                      editMode={editMode}
                      onRemove={() => removeItem("educations", idx)}
                    >
                      {editMode ? (
                        <div className="space-y-1.5 ml-2">
                          {[
                            ["degree", "Degree"],
                            ["institution", "Institution"],
                            ["year", "Year"],
                          ].map(([f, p]) => (
                            <input
                              key={f}
                              value={edu[f] || ""}
                              placeholder={p}
                              onChange={(e) =>
                                handleNestedChange(
                                  "educations",
                                  idx,
                                  f,
                                  e.target.value,
                                )
                              }
                              className={inlineCls}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="ml-2">
                          <p className="text-sm font-bold text-gray-900">
                            {edu.degree || "—"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {edu.institution || "—"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {edu.year || "—"}
                          </p>
                        </div>
                      )}
                    </TimelineItem>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 italic">
                  No education added yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-6">
          {/* Practice Details */}
          <Card>
            <CardHeader icon={Stethoscope} title="Practice Details" />
            <div className="p-5 space-y-4">
              {/* Fee */}
              <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-green-700" />
                  <span className="text-xs font-semibold text-gray-600">
                    Consultation Fee
                  </span>
                </div>
                {editMode ? (
                  <input
                    type="number"
                    value={doctor.consultationFee || ""}
                    onChange={(e) =>
                      handleChange("consultationFee", Number(e.target.value))
                    }
                    className="w-24 text-right text-sm font-bold text-green-700 bg-transparent
                               border-b border-green-400 outline-none"
                  />
                ) : (
                  <span className="text-base font-black text-green-700">
                    ৳ {doctor.consultationFee || "—"}
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <CheckCircle2 size={14} className="text-green-600" />{" "}
                  Availability
                </div>
                {editMode ? (
                  <select
                    value={doctor.currentStatus || "available"}
                    onChange={(e) =>
                      handleChange("currentStatus", e.target.value)
                    }
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                ) : (
                  <span className="text-sm font-semibold text-gray-800 capitalize">
                    {doctor.currentStatus || "—"}
                  </span>
                )}
              </div>

              {/* Chamber Hours */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Clock size={14} className="text-green-600" /> Chamber Hours
                  </div>
                  {editMode && (
                    <button
                      onClick={() => addNewItem("chamberTime", "")}
                      className="text-xs font-semibold text-green-700 flex items-center gap-0.5 hover:underline"
                    >
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-2">
                    {doctor.chamberTime?.map((time, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <input
                          value={time || ""}
                          placeholder="HH:MM - HH:MM"
                          onChange={(e) =>
                            handleArrayChange("chamberTime", i, e.target.value)
                          }
                          className={`${inputCls} py-2`}
                        />
                        <button
                          onClick={() => removeItem("chamberTime", i)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-700">
                    {doctor.chamberTime?.length ? (
                      doctor.chamberTime.join(" • ")
                    ) : (
                      <span className="text-gray-300 text-xs">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Chamber Days */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <CalendarDays size={14} className="text-green-600" />{" "}
                    Chamber Days
                  </div>
                  {editMode && (
                    <button
                      onClick={() => addNewItem("chamberDays", "")}
                      className="text-xs font-semibold text-green-700 flex items-center gap-0.5 hover:underline"
                    >
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-2">
                    {doctor.chamberDays?.map((day, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <input
                          value={day || ""}
                          placeholder="e.g., Saturday"
                          onChange={(e) =>
                            handleArrayChange("chamberDays", i, e.target.value)
                          }
                          className={`${inputCls} py-2`}
                        />
                        <button
                          onClick={() => removeItem("chamberDays", i)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.chamberDays?.length ? (
                      doctor.chamberDays.map((d, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold bg-[#f8faf9] border border-gray-200
                                                   text-gray-700 px-2.5 py-1 rounded-lg"
                        >
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300 text-xs">
                        Not specified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader
              icon={Award}
              title="Specializations"
              action={
                editMode && (
                  <button
                    onClick={() => addNewItem("specializations", "")}
                    className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50
                             hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-xl"
                  >
                    <Plus size={12} /> Add
                  </button>
                )
              }
            />
            <div className="p-5">
              {doctor.specializations?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.map((spec, i) => (
                    <div key={i} className="relative group">
                      {editMode ? (
                        <>
                          <input
                            value={spec || ""}
                            placeholder="Specialization"
                            onChange={(e) =>
                              handleArrayChange(
                                "specializations",
                                i,
                                e.target.value,
                              )
                            }
                            className="px-3 py-1.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-sm
                                       outline-none focus:border-green-400 text-gray-800 pr-7"
                          />
                          <button
                            onClick={() => removeItem("specializations", i)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 text-white
                                       rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-xl">
                          {spec}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 italic">
                  No specializations added yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDashboard;
