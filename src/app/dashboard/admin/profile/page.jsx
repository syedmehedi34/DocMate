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
} from "lucide-react";
import useUserById from "@/hooks/useUserById";
import toast from "react-hot-toast";

const AdminProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setAdmin({ ...user });
    }
  }, [user]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (field, value) => {
    setAdmin((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setAdmin((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value || "" },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setAdmin((prev) => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addNewItem = (field, template = "") => {
    setAdmin((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));
  };

  const removeItem = (field, index) => {
    setAdmin((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const saveChanges = () => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Save Changes?
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              This will update your admin profile information.
            </p>
          </div>

          <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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
                    const errData = await res.json();
                    throw new Error(errData.error || "Update failed");
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
                  console.error("Profile update error:", err);
                }
              }}
              className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
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

  const displayValue = (value) => value ?? "—";

  if (isLoading || !admin) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading profile</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow">
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
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input
                    type="text"
                    value={admin.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {admin.name || "—"}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-3 text-lg font-medium text-teal-700">
                  <Shield size={20} />
                  {editMode ? (
                    <input
                      type="text"
                      value={admin.role || ""}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    admin.role?.charAt(0).toUpperCase() +
                      admin.role?.slice(1) || "—"
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {editMode ? (
                      <input
                        type="email"
                        value={admin.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                      />
                    ) : (
                      <span className="truncate">{admin.email || "—"}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {editMode ? (
                      <input
                        type="tel"
                        value={admin.userNumber || admin.userNumber || ""}
                        onChange={(e) =>
                          handleChange("userNumber", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                      />
                    ) : (
                      displayValue(admin.userNumber || admin.userNumber)
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {editMode ? (
                      <input
                        type="text"
                        value={admin.fullAddress || ""}
                        onChange={(e) =>
                          handleChange("fullAddress", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                        placeholder="Full address"
                      />
                    ) : (
                      displayValue(admin.fullAddress)
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {editMode ? (
                      <input
                        type="date"
                        value={
                          admin.dob
                            ? new Date(admin.dob).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => handleChange("dob", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      <span>
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

                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    {editMode ? (
                      <select
                        value={admin.bloodGroup || "-"}
                        onChange={(e) =>
                          handleChange("bloodGroup", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                      >
                        <option value="-">—</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                      </select>
                    ) : (
                      displayValue(admin.bloodGroup)
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={saveChanges}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save size={18} /> Save
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left – Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <ProfileSection title="About" icon={<User size={18} />}>
              {editMode ? (
                <textarea
                  value={admin.about || ""}
                  onChange={(e) => handleChange("about", e.target.value)}
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Write something about your role or responsibilities..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {admin.about || "No description added yet."}
                </p>
              )}
            </ProfileSection>

            {/* Emergency Contact */}
            <ProfileSection
              title="Emergency Contact"
              icon={<Phone size={18} />}
            >
              {editMode ? (
                <div className="space-y-3">
                  <input
                    value={admin.emergencyContact?.name || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "name",
                        e.target.value,
                      )
                    }
                    placeholder="Contact person's full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    value={admin.emergencyContact?.relationship || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "relationship",
                        e.target.value,
                      )
                    }
                    placeholder="Relationship (e.g., Spouse, Family)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="tel"
                    value={admin.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "phone",
                        e.target.value,
                      )
                    }
                    placeholder="Emergency phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ) : (
                <div className="text-gray-700 space-y-1">
                  {admin.emergencyContact?.name ||
                  admin.emergencyContact?.phone ? (
                    <>
                      {admin.emergencyContact.name && (
                        <p className="font-medium">
                          {admin.emergencyContact.name}
                        </p>
                      )}
                      {admin.emergencyContact.relationship && (
                        <p className="text-sm">
                          {admin.emergencyContact.relationship}
                        </p>
                      )}
                      {admin.emergencyContact.phone && (
                        <p className="font-medium">
                          {admin.emergencyContact.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              )}
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Permissions – if exists */}
            {Array.isArray(admin.permissions) &&
              admin.permissions.length > 0 && (
                <ProfileSection title="Permissions" icon={<Shield size={18} />}>
                  {editMode && (
                    <button
                      className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                      onClick={() => addNewItem("permissions", "")}
                    >
                      <Plus size={16} /> Add Permission
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions.map((perm, i) => (
                      <div
                        key={i}
                        className={`relative group ${editMode ? "pr-8" : ""}`}
                      >
                        {editMode ? (
                          <>
                            <input
                              value={perm || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  "permissions",
                                  i,
                                  e.target.value,
                                )
                              }
                              className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
                              placeholder="Permission"
                            />
                            <button
                              onClick={() => removeItem("permissions", i)}
                              className="absolute right-0 top-0.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Remove permission"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-full text-sm font-medium border border-teal-100">
                            {perm}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ProfileSection>
              )}

            {/* Personal & Medical */}
            <ProfileSection
              title="Personal & Medical"
              icon={<Heart size={18} />}
            >
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Gender</span>
                  {editMode ? (
                    <select
                      value={admin.gender || "Not Mentioned"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="Not Mentioned">Not Mentioned</option>
                    </select>
                  ) : (
                    <span className="font-medium">{admin.gender || "—"}</span>
                  )}
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Blood Group</span>
                  {editMode ? (
                    <select
                      value={admin.bloodGroup || "-"}
                      onChange={(e) =>
                        handleChange("bloodGroup", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="-">—</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  ) : (
                    <span className="font-medium">
                      {admin.bloodGroup || "—"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Date of Birth</span>
                  {editMode ? (
                    <input
                      type="date"
                      value={
                        admin.dob
                          ? new Date(admin.dob).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => handleChange("dob", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <span className="font-medium">
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
            </ProfileSection>

            {/* Account Details */}
            <ProfileSection
              title="Account Details"
              icon={<Settings size={18} />}
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {admin.updatedAt
                      ? new Date(admin.updatedAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-xs text-gray-500 break-all">
                    {admin._id || "—"}
                  </span>
                </div>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─ Reusable Components ─ */
const ProfileSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
      {icon && <div className="text-gray-500">{icon}</div>}
      <h2 className="font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default AdminProfileDashboard;
