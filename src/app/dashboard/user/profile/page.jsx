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
} from "lucide-react";
import { useSession } from "next-auth/react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl " +
  "outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 " +
  "transition-all duration-200 text-gray-800 placeholder-gray-400";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-[#f8faf9]">
    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
      <Icon size={13} className="text-green-700" />
    </div>
    <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
      {title}
    </h2>
  </div>
);

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
        dob: user.dob || "",
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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );

  if (error || !profile)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400">
          {error || "Unable to load profile."}
        </p>
      </div>
    );

  const toggleEditMode = () => setEditMode((p) => !p);
  const handleChange = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));
  const handleNestedChange = (parent, field, value) =>
    setProfile((p) => ({
      ...p,
      [parent]: { ...p[parent], [field]: value || "" },
    }));

  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Save Changes?</h3>
            <p className="mt-1 text-sm text-gray-500">
              This will update your profile information.
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
                  if (!profile?._id) throw new Error("User ID missing");
                  const res = await fetch(`/api/users/${profile._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profile),
                  });
                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Update failed");
                  }
                  const updated = await res.json();
                  toast.success("Profile updated successfully!", {
                    id: loadingId,
                  });
                  setEditMode(false);
                  setProfile(updated);
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

  /* ──────────────── RENDER ──────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ═══ PROFILE HEADER ═══ */}
      <Card className="overflow-visible!">
        {/* Banner */}
        <div
          className="relative h-40 rounded-t-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0d2b1f 0%, #14532d 55%, #166534 100%)",
          }}
        >
          {/* decorative */}
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

        {/* Avatar + info — sits below banner, avatar peeks up */}
        <div className="px-6 sm:px-8 pt-0 pb-7">
          {/* Avatar row */}
          <div className="flex items-end gap-5 -translate-y-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
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
              <span
                className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400
                               rounded-full border-2 border-white"
              />
            </div>

            {/* Name + badges — aligned to bottom of avatar */}
            <div className="pb-1 flex-1 min-w-0">
              {editMode ? (
                <input
                  type="text"
                  value={profile.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-2xl font-black text-gray-900 border-b-2 border-green-400
                             focus:outline-none bg-transparent w-full mb-1.5"
                />
              ) : (
                <h1 className="text-2xl font-black text-gray-900 truncate mb-1.5">
                  {profile.name || "—"}
                </h1>
              )}
              <div className="flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold
                                 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full"
                >
                  <User size={10} /> Patient
                </span>
                {profile.bloodGroup && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold
                                   bg-red-50 border border-red-100 text-red-600 px-2.5 py-1 rounded-full"
                  >
                    <Heart size={10} /> {profile.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact pills — -translate-y-6 to close gap left by avatar row */}
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
                className="flex items-center gap-3 bg-[#f8faf9] border border-gray-100
                                          rounded-xl px-4 py-3"
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
                      value={profile[field] || ""}
                      placeholder={placeholder}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-transparent w-full
                                 outline-none border-b border-green-300 placeholder-gray-300"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {profile[field] || (
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

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader icon={FileText} title="About Me" />
            <div className="p-6">
              {editMode ? (
                <textarea
                  value={profile.about || ""}
                  rows={5}
                  placeholder="Add a personal note or health information..."
                  onChange={(e) => handleChange("about", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.about || (
                    <span className="text-gray-300 italic">
                      No note added yet.
                    </span>
                  )}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader icon={Calendar} title="Appointments" />
            <div className="p-12 flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                              flex items-center justify-center mb-3"
              >
                <Calendar size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No appointments yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Your upcoming and past appointments will appear here.
              </p>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <Card>
            <CardHeader icon={Heart} title="Medical Info" />
            <div className="p-5 space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart size={13} className="text-red-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    Blood Group
                  </span>
                </div>
                {editMode ? (
                  <select
                    value={profile.bloodGroup || ""}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
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
                    className={`text-sm font-bold px-3 py-1 rounded-lg
                    ${profile.bloodGroup ? "bg-red-50 text-red-600 border border-red-100" : "text-gray-400"}`}
                  >
                    {profile.bloodGroup || "—"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-green-600" />
                  <span className="text-xs text-gray-500 font-medium">
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
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                               focus:border-green-400 bg-white"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800">
                    {profile.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "—"}
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader icon={Phone} title="Contact Info" />
            <div className="p-5 space-y-5">
              <div>
                <p className="text-[0.62rem] text-gray-400 uppercase tracking-widest font-semibold mb-2">
                  Personal Phone
                </p>
                {editMode ? (
                  <input
                    type="tel"
                    value={profile.userNumber || ""}
                    placeholder="Your phone number"
                    onChange={(e) => handleChange("userNumber", e.target.value)}
                    className={inputCls}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800">
                    {profile.userNumber || (
                      <span className="text-gray-300 text-xs italic">
                        Not provided
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <ShieldAlert size={13} className="text-red-400" />
                  <p className="text-[0.62rem] text-gray-400 uppercase tracking-widest font-semibold">
                    Emergency Contact
                  </p>
                </div>
                {editMode ? (
                  <div className="space-y-2.5">
                    {[
                      { field: "name", placeholder: "Contact person's name" },
                      {
                        field: "relationship",
                        placeholder: "Relationship (Spouse, Parent…)",
                      },
                      { field: "phone", placeholder: "Emergency phone number" },
                    ].map(({ field, placeholder }) => (
                      <input
                        key={field}
                        value={profile.emergencyContact?.[field] || ""}
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
                  <div className="space-y-1.5">
                    {profile.emergencyContact?.name ||
                    profile.emergencyContact?.phone ? (
                      <>
                        {profile.emergencyContact.name && (
                          <p className="text-sm font-bold text-gray-900">
                            {profile.emergencyContact.name}
                          </p>
                        )}
                        {profile.emergencyContact.relationship && (
                          <p className="text-xs text-gray-400">
                            {profile.emergencyContact.relationship}
                          </p>
                        )}
                        {profile.emergencyContact.phone && (
                          <p className="text-sm font-semibold text-green-700">
                            {profile.emergencyContact.phone}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-300 italic">
                        Not provided
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader icon={Hash} title="Account Details" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Joined</span>
                <span className="text-xs font-semibold text-gray-700">
                  {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
                  {profile._id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileDashboard;
