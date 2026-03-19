"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  Save,
  X,
  Plus,
  Heart,
  Calendar,
  ShieldAlert,
  Hash,
  FileText,
} from "lucide-react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

/* ── shared styles ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl " +
  "outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 " +
  "transition-all duration-200 text-gray-800 placeholder-gray-400";

const inlineCls =
  "border-b border-gray-200 focus:border-green-500 focus:outline-none " +
  "bg-transparent text-sm text-gray-800 placeholder-gray-400 py-0.5 w-full";

/* ── card wrapper ── */
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

/* ── AdminProfileDashboard ── */
const AdminProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) setAdmin({ ...user });
  }, [user]);

  const toggleEditMode = () => setEditMode(!editMode);

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
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Save Changes?</h3>
            <p className="mt-1 text-sm text-gray-500">
              This will update your admin profile.
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
                  toast.success("Profile updated successfully!", {
                    id: loadingId,
                  });
                  setEditMode(false);
                  setAdmin(updated);
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

  const displayValue = (v) => v ?? "—";

  if (isLoading || !admin)
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

          {/* Edit / Save / Cancel */}
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

        {/* Avatar + name */}
        <div className="px-6 sm:px-8 pb-7">
          <div className="flex items-end gap-5 -translate-y-10 mb-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
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
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-[3px] border-white" />
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0 pb-1">
              {editMode ? (
                <input
                  type="text"
                  value={admin.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-2xl font-black text-gray-900 border-b-2 border-green-400 focus:outline-none bg-transparent w-full mb-1.5"
                />
              ) : (
                <h1 className="text-2xl font-black text-gray-900 truncate mb-1.5">
                  {admin.name || "—"}
                </h1>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full"
                >
                  <Shield size={10} />
                  {editMode ? (
                    <input
                      value={admin.role || ""}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="bg-transparent outline-none text-purple-700 text-xs font-semibold w-16"
                    />
                  ) : (
                    admin.role?.charAt(0).toUpperCase() +
                      admin.role?.slice(1) || "Admin"
                  )}
                </span>
                {admin.bloodGroup && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold
                                   bg-red-50 border border-red-100 text-red-600 px-2.5 py-1 rounded-full"
                  >
                    <Heart size={10} /> {admin.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 -mt-4">
            {[
              {
                icon: Mail,
                field: "email",
                type: "email",
                label: "Email",
                placeholder: "Email address",
              },
              {
                icon: Phone,
                field: "userNumber",
                type: "tel",
                label: "Phone",
                placeholder: "Phone number",
              },
              {
                icon: MapPin,
                field: "fullAddress",
                type: "text",
                label: "Address",
                placeholder: "Full address",
              },
            ].map(({ icon: Icon, field, type, label, placeholder }) => (
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
                      value={admin[field] || ""}
                      placeholder={placeholder}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-transparent w-full outline-none
                                 border-b border-green-300 placeholder-gray-300"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {admin[field] || (
                        <span className="text-gray-300 text-xs">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                  value={admin.about || ""}
                  rows={5}
                  placeholder="Write about your role or responsibilities..."
                  onChange={(e) => handleChange("about", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {admin.about || (
                    <span className="text-gray-300 italic">
                      No description added yet.
                    </span>
                  )}
                </p>
              )}
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader icon={ShieldAlert} title="Emergency Contact" />
            <div className="p-6">
              {editMode ? (
                <div className="space-y-3">
                  {[
                    {
                      field: "name",
                      placeholder: "Contact person's full name",
                    },
                    {
                      field: "relationship",
                      placeholder: "Relationship (e.g., Spouse, Family)",
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
                <div className="space-y-2">
                  {admin.emergencyContact?.name ||
                  admin.emergencyContact?.phone ? (
                    <>
                      {admin.emergencyContact.name && (
                        <p className="text-sm font-bold text-gray-900">
                          {admin.emergencyContact.name}
                        </p>
                      )}
                      {admin.emergencyContact.relationship && (
                        <p className="text-xs text-gray-400">
                          {admin.emergencyContact.relationship}
                        </p>
                      )}
                      {admin.emergencyContact.phone && (
                        <p className="text-sm font-semibold text-green-700">
                          {admin.emergencyContact.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-300 italic">Not provided</p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-6">
          {/* Permissions */}
          {((Array.isArray(admin.permissions) &&
            admin.permissions.length > 0) ||
            editMode) && (
            <Card>
              <CardHeader
                icon={Shield}
                title="Permissions"
                action={
                  editMode && (
                    <button
                      onClick={() => addNewItem("permissions", "")}
                      className="flex items-center gap-1 text-xs font-semibold text-green-700
                               bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-xl"
                    >
                      <Plus size={12} /> Add
                    </button>
                  )
                }
              />
              <div className="p-5">
                {admin.permissions?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
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
                              className="px-3 py-1.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs
                                         outline-none focus:border-green-400 text-gray-800 pr-7"
                            />
                            <button
                              onClick={() => removeItem("permissions", i)}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 text-white
                                         rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <span
                            className="text-xs font-semibold bg-purple-50 border border-purple-100
                                           text-purple-700 px-3 py-1.5 rounded-xl"
                          >
                            {perm}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 italic">
                    No permissions listed.
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Personal & Medical */}
          <Card>
            <CardHeader icon={Heart} title="Personal & Medical" />
            <div className="p-5 space-y-1">
              {/* Gender */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-green-600" />
                  <span className="text-xs text-gray-500 font-medium">
                    Gender
                  </span>
                </div>
                {editMode ? (
                  <select
                    value={admin.gender || "Not Mentioned"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="Not Mentioned">Not Mentioned</option>
                  </select>
                ) : (
                  <span className="text-sm font-semibold text-gray-800 capitalize">
                    {admin.gender || "—"}
                  </span>
                )}
              </div>

              {/* Blood Group */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart size={13} className="text-red-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    Blood Group
                  </span>
                </div>
                {editMode ? (
                  <select
                    value={admin.bloodGroup || "-"}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
                  >
                    <option value="-">—</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (b) => (
                        <option key={b}>{b}</option>
                      ),
                    )}
                  </select>
                ) : (
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-lg
                    ${admin.bloodGroup ? "bg-red-50 text-red-600 border border-red-100" : "text-gray-400"}`}
                  >
                    {admin.bloodGroup || "—"}
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-green-600" />
                  <span className="text-xs text-gray-500 font-medium">
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
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800">
                    {admin.dob
                      ? new Date(admin.dob).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader icon={Hash} title="Account Details" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Joined</span>
                <span className="text-xs font-semibold text-gray-700">
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Last Updated</span>
                <span className="text-xs font-semibold text-gray-700">
                  {admin.updatedAt
                    ? new Date(admin.updatedAt).toLocaleString()
                    : "—"}
                </span>
              </div>
              <div>
                <p className="text-[0.62rem] text-gray-400 uppercase tracking-widest font-semibold mb-1.5">
                  User ID
                </p>
                <p
                  className="font-mono text-[0.62rem] text-gray-400 break-all bg-[#f8faf9]
                               border border-gray-100 rounded-xl px-3 py-2.5"
                >
                  {admin._id || "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDashboard;
