"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  CalendarDays,
  Clock,
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
        // Add only fields you actually want to allow editing
        // Most patient profiles have very limited editable personal info
        phone: user.phone || "",
        location: user.location || "",
        about: user.about || "",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Could not load profile data.</p>
          <p className="text-sm mt-2">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    // TODO: call your update API here
    console.log("Saving profile:", profile);
    alert("Profile changes would be saved here (implement API call)");
    setEditMode(false);
  };

  const displayValue = (value) => (value ? value : "—");

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Hero / Header Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden mb-10">
          <div className="px-6 py-8 sm:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10">
              {/* Avatar */}
              <div className="relative shrink-0">
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

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full mb-1"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {profile.name}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-3 text-lg font-medium text-teal-700">
                  <User size={20} />
                  Patient
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-500" />
                    {editMode ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1 min-w-0"
                      />
                    ) : (
                      <span className="truncate">{profile.email}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-500" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1 min-w-0"
                        placeholder="City / Area"
                      />
                    ) : (
                      displayValue(profile.location)
                    )}
                  </div>

                  {/* Phone – not in your data, but keeping editable slot */}
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-500"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {editMode ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500 flex-1 min-w-0"
                        placeholder="Phone number"
                      />
                    ) : (
                      displayValue(profile.phone)
                    )}
                  </div>
                </div>
              </div>

              {/* Edit controls */}
              <div className="flex items-center gap-4 mt-6 sm:mt-0">
                {editMode ? (
                  <>
                    <button
                      onClick={saveChanges}
                      className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                    >
                      <Save size={18} /> Save
                    </button>
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                      <X size={18} /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left – Main column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">About</h2>
              </div>
              <div className="p-6">
                {editMode ? (
                  <textarea
                    value={profile.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    rows={5}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Tell something about yourself, your health preferences, or notes for doctors..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.about || "No personal information added yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Appointments summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <CalendarDays size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">Appointments</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Upcoming</h3>
                  <p className="text-gray-600">
                    No upcoming appointments scheduled.
                  </p>
                  {/* → You can fetch real upcoming appointments here */}
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Past</h3>
                  <p className="text-gray-600">
                    No past appointments recorded yet.
                  </p>
                  {/* → Integrate your appointments list or count here */}
                </div>
              </div>
            </div>
          </div>

          {/* Right – Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Account Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  Account Information
                </h2>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium text-gray-800">
                    {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {profile.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-xs text-gray-500 truncate max-w-[180px]">
                    {profile._id}
                  </span>
                </div>
              </div>
            </div>

            {/* Placeholder for future extensions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">Health Summary</h2>
              </div>
              <div className="p-6 text-center text-gray-500 text-sm py-10">
                Health information (allergies, medications, etc.)
                <br />
                will appear here once added.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileDashboard;
