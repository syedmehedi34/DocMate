"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Heart,
  Users,
  IdCard,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import useUserById from "@/hooks/useUserById";

const PatientProfileDashboard = () => {
  const { data: session } = useSession();
  const { user, isLoading, error } = useUserById();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        ...user,
        // Editable / extendable fields
        phone: user.phone || "",
        fullAddress: user.fullAddress || "",
        bloodGroup: user.bloodGroup || "",
        dateOfBirth: user.dateOfBirth || "",
        maritalStatus: user.maritalStatus || "",
        nationalId: user.nationalId || "",
        about: user.about || "",
        emergencyContact: user.emergencyContact || {
          name: "",
          relationship: "",
          phone: "",
        },
        secondaryContact: user.secondaryContact || {
          name: "",
          relationship: "",
          phone: "",
        },
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center text-red-600 max-w-md">
          <p className="text-xl font-semibold mb-2">Unable to load profile</p>
          <p className="text-sm">{error || "An unexpected error occurred."}</p>
        </div>
      </div>
    );
  }

  const toggleEditMode = () => setEditMode((prev) => !prev);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const saveChanges = () => {
    // TODO: Implement actual API call to update profile
    console.log("Saving updated profile:", profile);
    alert("Profile update simulation – implement your API call here");
    setEditMode(false);
  };

  const displayValue = (value) => (value ? value : "—");

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden mb-10">
          <div className="px-6 py-8 sm:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start lg:items-center gap-8">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={
                      profile.image ||
                      profile.doctorImageUrl ||
                      "/default-avatar.jpg"
                    }
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 truncate">
                    {profile.name}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-4 text-lg font-medium text-teal-700">
                  <User size={22} />
                  Patient
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-500" />
                    {editMode ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                      />
                    ) : (
                      <span className="truncate">{profile.email}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-500" />
                    {editMode ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                        placeholder="Phone number"
                      />
                    ) : (
                      displayValue(profile.phone)
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-500" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.fullAddress}
                        onChange={(e) =>
                          handleChange("fullAddress", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1"
                        placeholder="Full address"
                      />
                    ) : (
                      displayValue(profile.fullAddress)
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="flex items-center gap-4 mt-6 sm:mt-0">
                {editMode ? (
                  <>
                    <button
                      onClick={saveChanges}
                      className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow transition-colors"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                      <X size={18} /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow transition-colors"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column – main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">About Me</h2>
              </div>
              <div className="p-6">
                {editMode ? (
                  <textarea
                    value={profile.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    rows={5}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Personal note, preferences, or important information for healthcare providers..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.about || "No personal note has been added yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Appointments Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <Calendar size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">Appointments</h2>
              </div>
              <div className="p-8 text-center text-gray-600">
                <p>No upcoming or past appointments are currently displayed.</p>
                <p className="text-sm mt-2">
                  Integrate your appointments API to show real data here.
                </p>
              </div>
            </div>
          </div>

          {/* Right column – sidebar */}
          <div className="space-y-8">
            {/* Personal & Medical Basics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  Personal & Medical Information
                </h2>
              </div>
              <div className="p-6 space-y-5 text-sm">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Heart size={18} className="text-red-500" />
                    <span>Blood Group</span>
                  </div>
                  {editMode ? (
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) =>
                        handleChange("bloodGroup", e.target.value)
                      }
                      className="border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>Unknown</option>
                    </select>
                  ) : (
                    <span className="font-medium">
                      {profile.bloodGroup || "—"}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-gray-500" />
                    <span>Date of Birth</span>
                  </div>
                  {editMode ? (
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                      className="border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <span className="font-medium">
                      {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <Phone size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">
                  Emergency Contacts
                </h2>
              </div>
              <div className="p-6 space-y-8">
                {/* Primary Emergency Contact */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-4">
                    Primary Emergency Contact
                  </h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <input
                        value={profile.emergencyContact?.name || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergencyContact",
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Full name"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        value={profile.emergencyContact?.relationship || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergencyContact",
                            "relationship",
                            e.target.value,
                          )
                        }
                        placeholder="Relationship (Spouse, Parent, etc.)"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        value={profile.emergencyContact?.phone || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergencyContact",
                            "phone",
                            e.target.value,
                          )
                        }
                        placeholder="Phone number"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-700 space-y-1">
                      {profile.emergencyContact?.name ? (
                        <>
                          <p className="font-medium">
                            {profile.emergencyContact.name}
                          </p>
                          <p className="text-sm">
                            {profile.emergencyContact.relationship || "—"}
                          </p>
                          <p className="font-medium">
                            {profile.emergencyContact.phone || "—"}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Secondary Contact */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Secondary / Family Contact
                  </h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <input
                        value={profile.secondaryContact?.name || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "secondaryContact",
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Full name (optional)"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        value={profile.secondaryContact?.relationship || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "secondaryContact",
                            "relationship",
                            e.target.value,
                          )
                        }
                        placeholder="Relationship"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        value={profile.secondaryContact?.phone || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "secondaryContact",
                            "phone",
                            e.target.value,
                          )
                        }
                        placeholder="Phone number"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-700 space-y-1">
                      {profile.secondaryContact?.name ? (
                        <>
                          <p className="font-medium">
                            {profile.secondaryContact.name}
                          </p>
                          <p className="text-sm">
                            {profile.secondaryContact.relationship || "—"}
                          </p>
                          <p className="font-medium">
                            {profile.secondaryContact.phone || "—"}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">Account Details</h2>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-xs text-gray-500 break-all">
                    {profile._id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileDashboard;
