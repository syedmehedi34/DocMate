"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  X,
  Plus,
  Heart,
  Calendar,
  ShieldAlert,
  Hash,
  FileText,
  Clock,
} from "lucide-react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

/* ── input styles ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl " +
  "outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 " +
  "transition-all duration-200 text-slate-800 placeholder-slate-300";

/* ── Section card ── */
const Section = ({ icon: Icon, title, accent = "teal", action, children }) => {
  const iconColors = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    rose: "bg-rose-50 text-rose-500 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
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
const Divider = () => <div className="h-px bg-slate-100 my-3" />;

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const AdminProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) setAdmin({ ...user });
  }, [user]);

  const handleChange = (field, value) =>
    setAdmin((p) => ({ ...p, [field]: value }));
  const handleNestedChange = (parent, field, value) =>
    setAdmin((p) => ({
      ...p,
      [parent]: { ...p[parent], [field]: value || "" },
    }));
  const handleArrayChange = (field, index, value) =>
    setAdmin((p) => {
      const a = [...(p[field] || [])];
      a[index] = value;
      return { ...p, [field]: a };
    });
  const addNewItem = (field, template = "") =>
    setAdmin((p) => ({ ...p, [field]: [...(p[field] || []), template] }));
  const removeItem = (field, index) =>
    setAdmin((p) => ({
      ...p,
      [field]: (p[field] || []).filter((_, i) => i !== index),
    }));

  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-75 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Save changes?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Your admin profile will be updated.
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
                  if (!admin?._id) throw new Error("User ID missing");
                  const res = await fetch(`/api/users/${admin._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(admin),
                  });
                  if (!res.ok) {
                    const e = await res.json();
                    throw new Error(e.error || "Update failed");
                  }
                  const updated = await res.json();
                  toast.success("Profile updated!", { id });
                  setEditMode(false);
                  setAdmin(updated);
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

  /* loading / error */
  if (isLoading || !admin)
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
                  src={
                    admin.image ||
                    admin.doctorImageUrl ||
                    "https://img.icons8.com/?size=100&id=uWOKQW4wPHn6&format=png&color=000000"
                  }
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow" />
            </div>
            <div className="flex-1" />
          </div>
        </div>

        {/* Name + badges + contact */}
        <div className="px-7 pt-3 pb-6">
          <div className="mb-3">
            {editMode ? (
              <input
                type="text"
                value={admin.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-2xl font-extrabold text-slate-900 bg-transparent
                           border-b-2 border-teal-400 outline-none w-full mb-2"
              />
            ) : (
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                {admin.name || "—"}
              </h1>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                               bg-purple-50 text-purple-700 border border-purple-200 rounded-full"
              >
                <Shield size={10} />
                {editMode ? (
                  <input
                    value={admin.role || ""}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="bg-transparent outline-none text-purple-700 text-xs font-bold w-14"
                  />
                ) : admin.role ? (
                  admin.role.charAt(0).toUpperCase() + admin.role.slice(1)
                ) : (
                  "Admin"
                )}
              </span>

              {admin.bloodGroup && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                                 bg-rose-50 text-rose-600 border border-rose-200 rounded-full"
                >
                  <Heart size={10} /> {admin.bloodGroup}
                </span>
              )}

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                               bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>

          {/* Contact pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Mail, label: "Email", field: "email", type: "email" },
              { icon: Phone, label: "Phone", field: "userNumber", type: "tel" },
              {
                icon: MapPin,
                label: "Address",
                field: "fullAddress",
                type: "text",
              },
            ].map(({ icon: Icon, label, field, type }) => (
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
                      value={admin[field] || ""}
                      placeholder={label}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="text-sm font-medium text-slate-800 bg-transparent w-full
                                 outline-none border-b border-teal-300 placeholder-slate-300"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {admin[field] || (
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

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <Section icon={FileText} title="About" accent="teal">
            {editMode ? (
              <textarea
                rows={5}
                value={admin.about || ""}
                placeholder="Write about your role or responsibilities…"
                onChange={(e) => handleChange("about", e.target.value)}
                className={`${inputCls} resize-none -mt-2`}
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line -mt-2">
                {admin.about || (
                  <span className="text-slate-300 italic text-xs">
                    No description added yet.
                  </span>
                )}
              </p>
            )}
          </Section>

          {/* Emergency Contact */}
          <Section icon={ShieldAlert} title="Emergency Contact" accent="rose">
            {editMode ? (
              <div className="space-y-3 -mt-2">
                {[
                  { field: "name", placeholder: "Contact person's full name" },
                  {
                    field: "relationship",
                    placeholder: "Relationship (e.g. Spouse, Family)",
                  },
                  { field: "phone", placeholder: "Emergency phone number" },
                ].map(({ field, placeholder }) => (
                  <input
                    key={field}
                    value={admin.emergencyContact?.[field] || ""}
                    placeholder={placeholder}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        field,
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5 -mt-2">
                {admin.emergencyContact?.name ||
                admin.emergencyContact?.phone ? (
                  <>
                    {admin.emergencyContact.name && (
                      <p className="text-sm font-bold text-slate-900">
                        {admin.emergencyContact.name}
                      </p>
                    )}
                    {admin.emergencyContact.relationship && (
                      <p className="text-xs text-slate-400">
                        {admin.emergencyContact.relationship}
                      </p>
                    )}
                    {admin.emergencyContact.phone && (
                      <p className="text-sm font-semibold text-teal-600">
                        {admin.emergencyContact.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-300 italic">Not provided</p>
                )}
              </div>
            )}
          </Section>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-5">
          {/* Permissions */}
          {((Array.isArray(admin.permissions) &&
            admin.permissions.length > 0) ||
            editMode) && (
            <Section
              icon={Shield}
              title="Permissions"
              accent="purple"
              action={
                editMode && (
                  <button
                    onClick={() => addNewItem("permissions", "")}
                    className="flex items-center gap-1 text-xs font-bold text-teal-700
                               bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Plus size={12} /> Add
                  </button>
                )
              }
            >
              {admin.permissions?.length > 0 ? (
                <div className="flex flex-wrap gap-2 -mt-2">
                  {admin.permissions.map((perm, i) => (
                    <div key={i} className="relative group">
                      {editMode ? (
                        <>
                          <input
                            value={perm || ""}
                            placeholder="Permission"
                            onChange={(e) =>
                              handleArrayChange(
                                "permissions",
                                i,
                                e.target.value,
                              )
                            }
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs
                                       outline-none focus:border-teal-400 text-slate-800 pr-7"
                          />
                          <button
                            onClick={() => removeItem("permissions", i)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 text-white
                                       rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={9} />
                          </button>
                        </>
                      ) : (
                        <span
                          className="text-xs font-bold bg-purple-50 border border-purple-100
                                         text-purple-700 px-3 py-1.5 rounded-xl inline-block"
                        >
                          {perm}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300 italic -mt-2">
                  No permissions listed.
                </p>
              )}
            </Section>
          )}

          {/* Personal & Medical */}
          <Section icon={Heart} title="Personal & Medical" accent="rose">
            {/* Gender */}
            <div className="flex items-center justify-between py-2 -mt-2">
              <div className="flex items-center gap-2">
                <User size={13} className="text-teal-600" />
                <span className="text-xs font-semibold text-slate-500">
                  Gender
                </span>
              </div>
              {editMode ? (
                <select
                  value={admin.gender || "Not Mentioned"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none
                             focus:border-teal-400 bg-white font-semibold text-slate-700"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Not Mentioned">Not Mentioned</option>
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-700 capitalize">
                  {admin.gender || "—"}
                </span>
              )}
            </div>

            <Divider />

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
                  value={admin.bloodGroup || ""}
                  onChange={(e) => handleChange("bloodGroup", e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none
                             focus:border-teal-400 bg-white font-semibold text-slate-700"
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (b) => (
                      <option key={b}>{b}</option>
                    ),
                  )}
                </select>
              ) : (
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl
                  ${admin.bloodGroup ? "bg-rose-50 text-rose-600 border border-rose-200" : "text-slate-300"}`}
                >
                  {admin.bloodGroup || "—"}
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
                  value={
                    admin.dob
                      ? new Date(admin.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none
                             focus:border-teal-400 bg-white text-slate-700"
                />
              ) : (
                <span className="text-xs font-bold text-slate-700">
                  {admin.dob
                    ? new Date(admin.dob).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              )}
            </div>
          </Section>

          {/* Account Details */}
          <Section icon={Hash} title="Account Details" accent="slate">
            <div className="space-y-3 -mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Joined</span>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Last Updated</span>
                <span className="text-xs font-bold text-slate-700">
                  {admin.updatedAt
                    ? new Date(admin.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
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
                  {admin._id || "—"}
                </code>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDashboard;
