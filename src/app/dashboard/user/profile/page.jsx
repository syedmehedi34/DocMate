"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Heart,
  Edit2,
  Save,
  X,
  ShieldAlert,
  FileText,
  Hash,
  Activity,
  Stethoscope,
  Clock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

/* ─── tiny helpers ─────────────────────────────────────── */
const Field = ({
  label,
  value,
  editMode,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div className="group">
    <label className="block text-[0.6rem] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1.5">
      {label}
    </label>
    {editMode ? (
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder || label}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/60 border border-slate-200 rounded-xl px-3.5 py-2.5
                   text-sm text-slate-800 placeholder-slate-300 outline-none
                   focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
      />
    ) : (
      <p className="text-sm font-semibold text-slate-800 truncate">
        {value || (
          <span className="text-slate-300 font-normal italic text-xs">
            Not provided
          </span>
        )}
      </p>
    )}
  </div>
);

/* ─── section card ─────────────────────────────────────── */
const Section = ({
  icon: Icon,
  title,
  accent = "teal",
  children,
  className = "",
}) => {
  const accents = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border ${accents[accent]}`}
        >
          <Icon size={14} />
        </span>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
          {title}
        </h2>
      </div>
      <div className={`p-6 ${className}`}>{children}</div>
    </div>
  );
};

/* ─── divider ──────────────────────────────────────────── */
const Divider = () => <div className="h-px bg-slate-100 my-4" />;

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const PatientProfileDashboard = () => {
  const { data: session } = useSession();
  const { user, isLoading, error } = useUserById();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        ...user,
        userNumber: user.userNumber || "",
        fullAddress: user.fullAddress || "",
        bloodGroup: user.bloodGroup || "",
        dateOfBirth: user.dateOfBirth || "",
        about: user.about || "",
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          relationship: user.emergencyContact?.relationship || "",
          phone: user.emergencyContact?.phone || "",
        },
      });
    }
  }, [user]);

  /* loading */
  if (isLoading)
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

  if (error || !profile)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-rose-400">
          {error || "Unable to load profile."}
        </p>
      </div>
    );

  /* handlers */
  const handleChange = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));
  const handleNested = (parent, field, value) =>
    setProfile((p) => ({ ...p, [parent]: { ...p[parent], [field]: value } }));

  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-75 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Save changes?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Your profile information will be updated.
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
                  if (!profile?._id) throw new Error("User ID missing");
                  const res = await fetch(`/api/users/${profile._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profile),
                  });
                  if (!res.ok) {
                    const e = await res.json();
                    throw new Error(e.error || "Update failed");
                  }
                  const updated = await res.json();
                  toast.success("Profile updated!", { id });
                  setEditMode(false);
                  setProfile(updated);
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

  const bloodBadgeColor = profile.bloodGroup
    ? "bg-rose-50 text-rose-600 border border-rose-200"
    : "bg-slate-100 text-slate-400";

  /* ── RENDER ── */
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 font-[system-ui]">
      {/* ═══ HERO CARD ═══ */}
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* top banner */}
        <div
          className="h-36 w-full relative overflow-hidden"
          style={{
            background:
              "linear-gradient(120deg, #0f4c3a 0%, #127a5c 50%, #0e9f72 100%)",
          }}
        >
          {/* subtle pattern */}
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
          {/* glow blobs */}
          <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 w-64 h-32 rounded-full bg-emerald-200/20 blur-2xl" />

          {/* edit controls */}
          <div className="absolute top-4 right-5 flex gap-2 z-10">
            {editMode ? (
              <>
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold
                             text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm
                             rounded-xl border border-white/30 transition-all"
                >
                  <Save size={12} /> Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold
                             text-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                             rounded-xl border border-white/20 transition-all"
                >
                  <X size={12} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold
                           text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm
                           rounded-xl border border-white/25 transition-all"
              >
                <Edit2 size={12} /> Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* avatar strip — half inside banner, half below */}
        <div className="px-7">
          <div className="flex items-end gap-5" style={{ marginTop: "-3rem" }}>
            {/* avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-slate-100">
                <img
                  src={
                    profile.image ||
                    profile.doctorImageUrl ||
                    "https://img.icons8.com/?size=100&id=23264&format=png&color=000000"
                  }
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow" />
            </div>

            {/* spacer so edit button doesn't overlap name */}
            <div className="flex-1" />
          </div>
        </div>
        {/* name + badges */}
        <div className="px-7 pt-3 pb-5">
          <div className="mb-3">
            {editMode ? (
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-2xl font-extrabold text-slate-900 bg-transparent
                           border-b-2 border-teal-400 outline-none w-full mb-2"
              />
            ) : (
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                {profile.name || "—"}
              </h1>
            )}
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                               bg-teal-50 text-teal-700 border border-teal-200 rounded-full"
              >
                <User size={10} /> Patient
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${bloodBadgeColor}`}
              >
                <Heart size={10} />
                {profile.bloodGroup || "Blood Group"}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                               bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full"
              >
                <Activity size={10} /> Active
              </span>
              {/* quick info row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Mail, label: "Email", field: "email", type: "email" },
                  {
                    icon: Phone,
                    label: "Phone",
                    field: "userNumber",
                    type: "tel",
                  },
                  { icon: MapPin, label: "Address", field: "fullAddress" },
                ].map(({ icon: Icon, label, field, type }) => (
                  <div
                    key={field}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100
                           rounded-2xl px-4 py-3 transition-shadow hover:shadow-sm"
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
                          type={type || "text"}
                          value={profile[field] || ""}
                          placeholder={label}
                          onChange={(e) => handleChange(field, e.target.value)}
                          className="text-sm font-medium text-slate-800 bg-transparent w-full
                                 outline-none border-b border-teal-300 placeholder-slate-300"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {profile[field] || (
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

          {/* ═══ BODY GRID ═══ */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* ── LEFT COL ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* About */}
              <Section icon={FileText} title="About Me" accent="teal">
                {editMode ? (
                  <textarea
                    rows={5}
                    value={profile.about || ""}
                    placeholder="Share a brief health note or personal bio…"
                    onChange={(e) => handleChange("about", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3
                           text-sm text-slate-700 placeholder-slate-300 outline-none resize-none
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {profile.about || (
                      <span className="text-slate-300 italic text-xs">
                        No information added yet.
                      </span>
                    )}
                  </p>
                )}
              </Section>

              {/* Appointments placeholder */}
              <Section icon={Calendar} title="Appointments" accent="indigo">
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100
                              flex items-center justify-center"
                  >
                    <Stethoscope size={22} className="text-slate-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      No appointments yet
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Your upcoming and past appointments will appear here once
                      booked.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            {/* ── RIGHT COL ── */}
            <div className="space-y-5">
              {/* Medical Info */}
              <Section icon={Heart} title="Medical Info" accent="rose">
                {/* Blood Group */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Heart size={13} className="text-rose-400" />
                    <span className="text-xs font-semibold text-slate-500">
                      Blood Group
                    </span>
                  </div>
                  {editMode ? (
                    <select
                      value={profile.bloodGroup || ""}
                      onChange={(e) =>
                        handleChange("bloodGroup", e.target.value)
                      }
                      className="text-xs border border-slate-200 rounded-xl px-3 py-2
                             outline-none focus:border-teal-400 bg-white font-semibold text-slate-700"
                    >
                      <option value="">Select</option>
                      {[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                        "Unknown",
                      ].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl
                  ${
                    profile.bloodGroup
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "text-slate-300"
                  }`}
                    >
                      {profile.bloodGroup || "—"}
                    </span>
                  )}
                </div>

                <Divider />

                {/* Date of Birth */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-teal-500" />
                    <span className="text-xs font-semibold text-slate-500">
                      Date of Birth
                    </span>
                  </div>
                  {editMode ? (
                    <input
                      type="date"
                      value={profile.dateOfBirth || ""}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                      className="text-xs border border-slate-200 rounded-xl px-3 py-2
                             outline-none focus:border-teal-400 bg-white text-slate-700"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-700">
                      {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  )}
                </div>
              </Section>

              {/* Contact Info */}
              <Section icon={Phone} title="Contact Info" accent="teal">
                <Field
                  label="Personal Phone"
                  value={profile.userNumber}
                  editMode={editMode}
                  onChange={(v) => handleChange("userNumber", v)}
                  type="tel"
                  placeholder="+880 1X XXX XXXXX"
                />

                <Divider />

                {/* Emergency */}
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={13} className="text-rose-400" />
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Emergency Contact
                  </p>
                </div>

                {editMode ? (
                  <div className="space-y-3">
                    {[
                      { field: "name", placeholder: "Contact name" },
                      {
                        field: "relationship",
                        placeholder: "Relationship (e.g. Spouse, Parent)",
                      },
                      { field: "phone", placeholder: "Emergency phone number" },
                    ].map(({ field, placeholder }) => (
                      <input
                        key={field}
                        value={profile.emergencyContact?.[field] || ""}
                        placeholder={placeholder}
                        onChange={(e) =>
                          handleNested(
                            "emergencyContact",
                            field,
                            e.target.value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5
                               text-xs text-slate-700 placeholder-slate-300 outline-none
                               focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                    ))}
                  </div>
                ) : profile.emergencyContact?.name ||
                  profile.emergencyContact?.phone ? (
                  <div className="space-y-1.5">
                    {profile.emergencyContact.name && (
                      <p className="text-sm font-bold text-slate-900">
                        {profile.emergencyContact.name}
                      </p>
                    )}
                    {profile.emergencyContact.relationship && (
                      <p className="text-xs text-slate-400">
                        {profile.emergencyContact.relationship}
                      </p>
                    )}
                    {profile.emergencyContact.phone && (
                      <p className="text-sm font-semibold text-teal-600">
                        {profile.emergencyContact.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 italic">Not provided</p>
                )}
              </Section>

              {/* Account Details */}
              <Section icon={Hash} title="Account Details" accent="amber">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-amber-500" />
                      <span className="text-xs font-semibold text-slate-500">
                        Member since
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <Divider />

                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">
                      User ID
                    </p>
                    <code
                      className="block text-[0.6rem] text-slate-400 break-all bg-slate-50
                               border border-slate-100 rounded-xl px-3 py-2.5 leading-relaxed"
                    >
                      {profile._id}
                    </code>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileDashboard;
