"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  Shield,
  Activity,
  CalendarDays,
  Clock,
  Settings,
  Save,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
// import RoleGuard from "@/app/components/RoleGuard"; // Uncomment if needed

const AdminProfileDashboard = () => {
  const { data: session } = useSession();
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Extend with admin-specific fields (normally fetched from API)
      setAdmin({
        ...session.user,
        role: "Super Admin",
        permissions: [
          "Manage Users",
          "View Analytics",
          "Manage Appointments",
          "System Settings",
        ],
        lastLogin: "2026-02-17 10:45 PM",
        twoFactorEnabled: true,
        phone: "+880 17XX-XXXXXX",
        location: "Dhaka, Bangladesh",
        about:
          "System administrator managing the healthcare platform since 2024.",
        recentActions: [
          { action: "Updated doctor schedule", time: "Today, 11:20 PM" },
          {
            action: "Approved new patient registration",
            time: "Today, 09:15 PM",
          },
          { action: "Generated monthly report", time: "Yesterday, 04:30 PM" },
        ],
        stats: {
          totalDoctors: 42,
          totalPatients: 1856,
          appointmentsThisMonth: 1247,
          pendingApprovals: 8,
        },
      });
    }
  }, [session]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (field, value) => {
    setAdmin((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setAdmin((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addNewItem = (field, template) => {
    setAdmin((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));
  };

  const saveChanges = () => {
    console.log("Saving admin data:", admin);
    alert("Changes saved (demo mode)");
    setEditMode(false);
  };

  if (!admin) return <p className="p-6">Loading profile...</p>;

  return (
    // <RoleGuard allowedRoles={["admin"]}>  // Uncomment when ready
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header – consistent with doctor profile */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow">
                  <img
                    src={admin.image || "/default-admin.jpg"}
                    alt={admin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div>
                {editMode ? (
                  <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {admin.name}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-3 text-lg font-medium text-teal-700">
                  <Shield size={20} />
                  {editMode ? (
                    <input
                      type="text"
                      value={admin.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    admin.role
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {editMode ? (
                      <input
                        type="email"
                        value={admin.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      admin.email
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {editMode ? (
                      <input
                        type="tel"
                        value={admin.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      admin.phone
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    Last login: {admin.lastLogin}
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

        {/* Main + Sidebar grid – same as doctor */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <ProfileSection title="About" icon={<User size={18} />}>
              {editMode ? (
                <textarea
                  value={admin.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{admin.about}</p>
              )}
            </ProfileSection>

            {/* Recent System Actions */}
            <ProfileSection
              title="Recent Actions"
              icon={<Activity size={18} />}
            >
              <div className="space-y-4">
                {admin.recentActions?.map((action, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-800">{action.action}</span>
                    <span className="text-gray-500">{action.time}</span>
                  </div>
                ))}
                {admin.recentActions?.length === 0 && (
                  <p className="text-gray-500">No recent actions recorded.</p>
                )}
              </div>
            </ProfileSection>

            {/* Quick Stats Overview */}
            <ProfileSection
              title="Platform Overview"
              icon={<CalendarDays size={18} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    {admin.stats.totalDoctors}
                  </p>
                  <p className="text-sm text-gray-600">Doctors</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    {admin.stats.totalPatients}
                  </p>
                  <p className="text-sm text-gray-600">Patients</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    {admin.stats.appointmentsThisMonth}
                  </p>
                  <p className="text-sm text-gray-600">
                    Appointments (This Month)
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    {admin.stats.pendingApprovals}
                  </p>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Permissions */}
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
                {admin.permissions?.map((perm, i) =>
                  editMode ? (
                    <input
                      key={i}
                      value={perm}
                      onChange={(e) =>
                        handleArrayChange("permissions", i, e.target.value)
                      }
                      className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-full text-sm font-medium border border-teal-100"
                    >
                      {perm}
                    </span>
                  ),
                )}
              </div>
            </ProfileSection>

            {/* Security */}
            <ProfileSection title="Security" icon={<AlertCircle size={18} />}>
              <div className="space-y-3 text-sm">
                <InfoRow
                  icon={<Clock size={16} />}
                  label="Last Login"
                  value={admin.lastLogin}
                />
                <InfoRow
                  icon={<CheckCircle2 size={16} />}
                  label="2FA Status"
                  value={
                    admin.twoFactorEnabled ? (
                      <span className="text-green-600 font-medium">
                        Enabled
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Disabled</span>
                    )
                  }
                />
                {editMode && (
                  <div className="pt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={admin.twoFactorEnabled}
                        readOnly
                      />
                      <span>Enable Two-Factor Authentication</span>
                    </label>
                  </div>
                )}
              </div>
            </ProfileSection>

            {/* Preferences / Settings */}
            <ProfileSection title="Preferences" icon={<Settings size={18} />}>
              <p className="text-sm text-gray-600">
                Email notifications • Dark mode • Language • Timezone
                (Asia/Dhaka)
              </p>
              {/* Can be expanded with toggles in edit mode if needed */}
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
    // </RoleGuard>
  );
};

/* ─ Reusable Components (same as doctor version) ─ */
const ProfileSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
      {icon && <div className="text-gray-500">{icon}</div>}
      <h2 className="font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm py-2">
    <div className="flex items-center gap-3 text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <div className="font-medium text-gray-800">{value}</div>
  </div>
);

export default AdminProfileDashboard;
