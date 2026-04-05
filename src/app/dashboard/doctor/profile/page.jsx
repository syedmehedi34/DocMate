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
  Activity,
} from "lucide-react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

/* ── input styles ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl " +
  "outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 " +
  "transition-all duration-200 text-slate-800 placeholder-slate-300";

const inlineCls =
  "border-b border-slate-200 focus:border-teal-400 focus:outline-none " +
  "bg-transparent text-sm text-slate-800 placeholder-slate-300 py-0.5 w-full";

/* ── Section card ── */
const Section = ({ icon: Icon, title, accent = "teal", action, children }) => {
  const iconColors = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-500 border-rose-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border ${iconColors[accent]}`}
          >
            <Icon size={14} />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

/* ── Divider ── */
const Divider = () => <div className="h-px bg-slate-100 my-4" />;

/* ── Timeline item ── */
const TimelineItem = ({ children, editMode, onRemove }) => (
  <div className="relative pl-5 group">
    <span className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-teal-400 bg-teal-50" />
    {editMode && (
      <button
        onClick={onRemove}
        className="absolute -right-1 -top-1 w-5 h-5 bg-rose-500 text-white rounded-full
                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
      >
        <X size={10} />
      </button>
    )}
    {children}
  </div>
);

/* ── Add button ── */
const AddBtn = ({ onClick, label = "Add" }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-xs font-bold text-teal-700
               bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-colors"
  >
    <Plus size={12} /> {label}
  </button>
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const DoctorProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [datesEditMode, setDatesEditMode] = useState(false);
  const [tempDates, setTempDates] = useState([]);

  useEffect(() => {
    if (user) {
      setDoctor(user);
      setTempDates(user.openAppointmentsDates?.map((d) => new Date(d)) || []);
    }
  }, [user]);

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

  /* save profile */
  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-75 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Save changes?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Your doctor profile will be updated.
            </p>
          </div>
          <div className="px-6 pb-5 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const id = toast.loading("Saving…");
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
                  toast.success("Profile updated!", { id });
                  setEditMode(false);
                  setDoctor(updated);
                } catch (err) {
                  toast.error(err.message, { id });
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: { padding: 0, background: "transparent", boxShadow: "none" },
      },
    );
  };

  /* save dates */
  const saveDates = () => {
    toast(
      (t) => (
        <div className="min-w-75 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Update availability?
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Your appointment calendar will be updated.
            </p>
          </div>
          <div className="px-6 pb-5 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const id = toast.loading("Saving dates…");
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
                  toast.success("Availability updated!", { id });
                  setDoctor(updated);
                  setDatesEditMode(false);
                  setTempDates(
                    updated.openAppointmentsDates?.map((d) => new Date(d)) ||
                      [],
                  );
                } catch (err) {
                  toast.error(err.message, { id });
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: { padding: 0, background: "transparent", boxShadow: "none" },
      },
    );
  };

  /* loading / error */
  if (isLoading || !doctor)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-teal-100" />
          <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
          Loading profile…
        </p>
      </div>
    );
  if (error)
    return <p className="p-6 text-sm text-rose-400">Error loading profile.</p>;

  const statusStyle = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    busy: "bg-amber-50 text-amber-700 border-amber-200",
    "on-leave": "bg-slate-100 text-slate-500 border-slate-200",
  };
  const statusDot = {
    available: "bg-emerald-500",
    busy: "bg-amber-400",
    "on-leave": "bg-slate-400",
  };
  const status = doctor.currentStatus || "available";

  /* ── RENDER ── */
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* ═══ HERO CARD ═══ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div
          className="h-36 w-full relative overflow-hidden"
          style={{
            background:
              "linear-gradient(120deg, #0f4c3a 0%, #127a5c 50%, #0e9f72 100%)",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 w-64 h-32 rounded-full bg-emerald-200/20 blur-2xl" />

          {/* Edit controls */}
          <div className="absolute top-4 right-5 flex gap-2 z-10">
            {editMode ? (
              <>
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white
                             bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 transition-all"
                >
                  <Save size={12} /> Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white/80
                             bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all"
                >
                  <X size={12} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white
                           bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl border border-white/25 transition-all"
              >
                <Edit2 size={12} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Avatar — peeks out of banner */}
        <div className="px-7">
          <div className="flex items-end gap-5" style={{ marginTop: "-3rem" }}>
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-slate-100">
                <img
                  src={doctor.doctorImageUrl || "/default-doctor.jpg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {status === "available" && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow" />
              )}
            </div>
            <div className="flex-1" />
          </div>
        </div>

        {/* Name + badges + contact */}
        <div className="px-7 pt-3 pb-6">
          {/* Name */}
          <div className="mb-3">
            {editMode ? (
              <input
                type="text"
                value={doctor.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-2xl font-extrabold text-slate-900 bg-transparent
                           border-b-2 border-teal-400 outline-none w-full mb-2"
              />
            ) : (
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                {doctor.name || "—"}
              </h1>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Category */}
              {editMode ? (
                <input
                  type="text"
                  value={doctor.doctorCategory || ""}
                  onChange={(e) =>
                    handleChange("doctorCategory", e.target.value)
                  }
                  placeholder="Specialty"
                  className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200
                             rounded-full px-3 py-1 outline-none focus:border-teal-400 w-40"
                />
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                                 bg-teal-50 text-teal-700 border border-teal-200 rounded-full"
                >
                  <Stethoscope size={10} /> {doctor.doctorCategory || "Doctor"}
                </span>
              )}

              {/* Status */}
              {editMode ? (
                <select
                  value={status}
                  onChange={(e) =>
                    handleChange("currentStatus", e.target.value)
                  }
                  className="text-xs font-bold border border-slate-200 rounded-full px-3 py-1
                             outline-none focus:border-teal-400 bg-white text-slate-700"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="on-leave">On Leave</option>
                </select>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                                  border rounded-full capitalize ${statusStyle[status] || statusStyle.available}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusDot[status] || statusDot.available}`}
                  />
                  {status}
                </span>
              )}

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                               bg-slate-100 text-slate-600 border border-slate-200 rounded-full"
              >
                <Activity size={10} /> Verified
              </span>
            </div>
          </div>

          {/* Contact pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Mail,
                label: "Email",
                field: "appointmentEmail",
                fallback: "email",
                type: "email",
              },
              {
                icon: Phone,
                label: "Phone",
                field: "appointmentNumber",
                type: "tel",
              },
              {
                icon: MapPin,
                label: "Location",
                field: "location",
                type: "text",
              },
            ].map(({ icon: Icon, label, field, fallback, type }) => (
              <div
                key={field}
                className="flex items-center gap-3 bg-slate-50 border border-slate-100
                           rounded-2xl px-4 py-3 hover:shadow-sm transition-shadow"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 shrink-0">
                  <Icon size={14} className="text-teal-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">
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
                      placeholder={label}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="text-sm font-medium text-slate-800 bg-transparent w-full
                                 outline-none border-b border-teal-300 placeholder-slate-300"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {doctor[field] || (fallback && doctor[fallback]) || (
                        <span className="text-slate-300 font-normal text-xs italic">
                          Not set
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ AVAILABILITY DATES ═══ */}
      <Section
        icon={CalendarDays}
        title="Upcoming Available Dates"
        accent="teal"
        action={
          datesEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={saveDates}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white
                           bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600
                           bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setDatesEditMode(true);
                setTempDates(
                  doctor?.openAppointmentsDates?.map((d) => new Date(d)) || [],
                );
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700
                         bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors"
            >
              <Edit2 size={12} /> Edit Dates
            </button>
          )
        }
      >
        {datesEditMode ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 -mt-2 mb-3">
              Add dates when you'll be physically available. Patients can only
              book on these dates.
            </p>
            <div className="space-y-2.5">
              {tempDates.map((date, index) => (
                <div key={index} className="flex items-center gap-3">
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
                    className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
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
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 mt-1"
              >
                <Plus size={15} /> Add New Date
              </button>
            </div>
          </div>
        ) : doctor?.openAppointmentsDates?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 -mt-2">
            {[...doctor.openAppointmentsDates]
              .map((d) => new Date(d))
              .sort((a, b) => a - b)
              .map((date, i) => (
                <div
                  key={i}
                  className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 text-center
                               hover:border-teal-300 hover:bg-teal-100/60 transition-colors cursor-default"
                >
                  <p className="text-sm font-bold text-teal-800">
                    {date.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-teal-500 mt-0.5">
                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center -mt-2">
            <div
              className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100
                              flex items-center justify-center mb-3"
            >
              <CalendarDays size={20} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No upcoming dates added yet
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Patients can't book until you add available dates.
            </p>
          </div>
        )}
      </Section>

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <Section icon={FileText} title="About" accent="teal">
            {editMode ? (
              <textarea
                rows={5}
                value={doctor.about || ""}
                placeholder="Write a professional summary…"
                onChange={(e) => handleChange("about", e.target.value)}
                className={`${inputCls} resize-none -mt-2`}
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed -mt-2">
                {doctor.about || (
                  <span className="text-slate-300 italic text-xs">
                    No summary added yet.
                  </span>
                )}
              </p>
            )}
          </Section>

          {/* Experience */}
          <Section
            icon={Briefcase}
            title="Professional Experience"
            accent="indigo"
            action={
              editMode && (
                <AddBtn
                  onClick={() =>
                    addNewItem("worksAndExperiences", {
                      position: "",
                      workedAt: "",
                      duration: "",
                    })
                  }
                />
              )
            }
          >
            {doctor.worksAndExperiences?.length > 0 ? (
              <div className="space-y-5 border-l-2 border-slate-100 pl-4 -mt-2">
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
                        <p className="text-sm font-bold text-slate-900">
                          {exp.position || "—"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {exp.workedAt || "—"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {exp.duration || "—"}
                        </p>
                      </div>
                    )}
                  </TimelineItem>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300 italic -mt-2">
                No experience added yet.
              </p>
            )}
          </Section>

          {/* Education */}
          <Section
            icon={GraduationCap}
            title="Education"
            accent="sky"
            action={
              editMode && (
                <AddBtn
                  onClick={() =>
                    addNewItem("educations", {
                      degree: "",
                      institution: "",
                      year: "",
                    })
                  }
                />
              )
            }
          >
            {doctor.educations?.length > 0 ? (
              <div className="space-y-5 border-l-2 border-slate-100 pl-4 -mt-2">
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
                        <p className="text-sm font-bold text-slate-900">
                          {edu.degree || "—"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {edu.institution || "—"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {edu.year || "—"}
                        </p>
                      </div>
                    )}
                  </TimelineItem>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300 italic -mt-2">
                No education added yet.
              </p>
            )}
          </Section>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-5">
          {/* Practice Details */}
          <Section icon={Stethoscope} title="Practice Details" accent="teal">
            {/* Fee */}
            <div
              className="flex items-center justify-between bg-teal-50 border border-teal-100
                            rounded-2xl px-4 py-3 -mt-2 mb-4"
            >
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-teal-700" />
                <span className="text-xs font-bold text-slate-600">
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
                  className="w-24 text-right text-sm font-bold text-teal-700 bg-transparent
                             border-b border-teal-400 outline-none"
                />
              ) : (
                <span className="text-base font-black text-teal-700">
                  ৳ {doctor.consultationFee || "—"}
                </span>
              )}
            </div>

            <Divider />

            {/* Chamber Hours */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-teal-600" />
                  <span className="text-xs font-bold text-slate-500">
                    Chamber Hours
                  </span>
                </div>
                {editMode && (
                  <button
                    onClick={() => addNewItem("chamberTime", "")}
                    className="text-xs font-bold text-teal-700 flex items-center gap-0.5 hover:underline"
                  >
                    <Plus size={11} /> Add
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-2">
                  {doctor.chamberTime?.map((time, i) => (
                    <div key={i} className="flex items-center gap-2">
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
                        className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-700">
                  {doctor.chamberTime?.length ? (
                    doctor.chamberTime.join(" • ")
                  ) : (
                    <span className="text-slate-300 text-xs italic">
                      Not specified
                    </span>
                  )}
                </p>
              )}
            </div>

            <Divider />

            {/* Chamber Days */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-teal-600" />
                  <span className="text-xs font-bold text-slate-500">
                    Chamber Days
                  </span>
                </div>
                {editMode && (
                  <button
                    onClick={() => addNewItem("chamberDays", "")}
                    className="text-xs font-bold text-teal-700 flex items-center gap-0.5 hover:underline"
                  >
                    <Plus size={11} /> Add
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-2">
                  {doctor.chamberDays?.map((day, i) => (
                    <div key={i} className="flex items-center gap-2">
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
                        className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
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
                        className="text-xs font-semibold bg-slate-50 border border-slate-200
                                                  text-slate-700 px-2.5 py-1 rounded-xl"
                      >
                        {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-300 text-xs italic">
                      Not specified
                    </span>
                  )}
                </div>
              )}
            </div>
          </Section>

          {/* Specializations */}
          <Section
            icon={Award}
            title="Specializations"
            accent="amber"
            action={
              editMode && (
                <AddBtn onClick={() => addNewItem("specializations", "")} />
              )
            }
          >
            {doctor.specializations?.length > 0 ? (
              <div className="flex flex-wrap gap-2 -mt-2">
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
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs
                                     outline-none focus:border-teal-400 text-slate-800 pr-7"
                        />
                        <button
                          onClick={() => removeItem("specializations", i)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 text-white
                                     rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={9} />
                        </button>
                      </>
                    ) : (
                      <span
                        className="text-xs font-bold bg-indigo-50 border border-indigo-100
                                       text-indigo-700 px-3 py-1.5 rounded-xl inline-block"
                      >
                        {spec}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300 italic -mt-2">
                No specializations added yet.
              </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDashboard;
