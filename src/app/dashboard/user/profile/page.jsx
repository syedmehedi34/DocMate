"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Activity,
  CalendarDays,
  Clock,
  AlertCircle,
  Plus,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "next-auth/react";
// import useUserById from "@/hooks/useUserById";  // ← if you want to use same hook as doctor

const PatientProfileDashboard = () => {
  const { data: session } = useSession();
  // If you have a similar hook like doctor → const { user, isLoading, error } = useUserById();
  // For now using session as fallback
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // You can enrich session.user with more fields from your backend
      setPatient({
        ...session.user,
        // Example default structure – replace with real data fetch
        bloodGroup: "A+",
        height: "5'8\"",
        weight: "68 kg",
        allergies: ["Penicillin", "Pollen"],
        currentMedications: ["Amlodipine 5mg", "Vitamin D"],
        emergencyContact: { name: "", relation: "", phone: "" },
        upcomingAppointments: [
          // { date: "2026-02-25", time: "10:30 AM", doctor: "Dr. Rahman", reason: "Follow-up" }
        ],
        pastAppointments: [],
      });
    }
  }, [session]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, subField, value) => {
    setPatient((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [subField]: value },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setPatient((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addNewItem = (field, template) => {
    setPatient((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));
  };

  const saveChanges = () => {
    console.log("Saving patient data:", patient);
    alert("Changes saved (demo mode)");
    setEditMode(false);
  };

  if (!patient) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header – same style as doctor */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow">
                  <img
                    src={patient.image || "/default-user.jpg"}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Optional status dot – patients usually don't have "available" */}
              </div>

              {/* Basic Info */}
              <div>
                {editMode ? (
                  <input
                    type="text"
                    value={patient.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {patient.name}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-3 text-lg font-medium text-teal-700">
                  <User size={20} />
                  Patient
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {editMode ? (
                      <input
                        type="email"
                        value={patient.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      patient.email
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {editMode ? (
                      <input
                        type="tel"
                        value={patient.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                        placeholder="Phone number"
                      />
                    ) : (
                      patient.phone || "Not provided"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {editMode ? (
                      <input
                        type="text"
                        value={patient.location || ""}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                        placeholder="City / Area"
                      />
                    ) : (
                      patient.location || "Not provided"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Buttons */}
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

        {/* Main content + Sidebar – same grid as doctor */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About / Personal Note */}
            <ProfileSection title="About Me" icon={<User size={18} />}>
              {editMode ? (
                <textarea
                  value={patient.about || ""}
                  onChange={(e) => handleChange("about", e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Write something about yourself, medical concerns, preferences..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {patient.about || "No personal note added yet."}
                </p>
              )}
            </ProfileSection>

            {/* Upcoming Appointments */}
            <ProfileSection
              title="Upcoming Appointments"
              icon={<CalendarDays size={18} />}
            >
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() =>
                    addNewItem("upcomingAppointments", {
                      date: "",
                      time: "",
                      doctor: "",
                      reason: "",
                    })
                  }
                >
                  <Plus size={16} /> Add Appointment (demo)
                </button>
              )}
              <div className="space-y-4">
                {patient.upcomingAppointments?.length > 0 ? (
                  patient.upcomingAppointments.map((appt, idx) => (
                    <div key={idx} className="border-l-4 border-teal-100 pl-5">
                      {editMode ? (
                        <div className="space-y-2">
                          <input
                            value={appt.date}
                            onChange={(e) =>
                              handleNestedChange(
                                "upcomingAppointments",
                                idx,
                                "date",
                                e.target.value,
                              )
                            }
                            className="font-medium border-b border-gray-300 w-full focus:outline-none focus:border-teal-500"
                            placeholder="YYYY-MM-DD"
                          />
                          <input
                            value={appt.time}
                            onChange={(e) =>
                              handleNestedChange(
                                "upcomingAppointments",
                                idx,
                                "time",
                                e.target.value,
                              )
                            }
                            className="text-gray-600 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500"
                            placeholder="Time"
                          />
                          <input
                            value={appt.doctor}
                            onChange={(e) =>
                              handleNestedChange(
                                "upcomingAppointments",
                                idx,
                                "doctor",
                                e.target.value,
                              )
                            }
                            className="text-gray-600 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500"
                            placeholder="Doctor name"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-gray-900">
                            {appt.date} • {appt.time}
                          </p>
                          <p className="text-gray-600">{appt.doctor}</p>
                          <p className="text-sm text-gray-500">{appt.reason}</p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No upcoming appointments.</p>
                )}
              </div>
            </ProfileSection>

            {/* Past Appointments – optional summary */}
            <ProfileSection
              title="Past Appointments"
              icon={<Clock size={18} />}
            >
              <p className="text-gray-600">
                {patient.pastAppointments?.length || 0} previous visits
              </p>
              {/* You can expand this similarly if needed */}
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Health Info */}
            <ProfileSection title="Health Overview">
              <div className="space-y-4">
                <InfoRow
                  icon={<Heart size={17} />}
                  label="Blood Group"
                  value={
                    editMode ? (
                      <input
                        value={patient.bloodGroup || ""}
                        onChange={(e) =>
                          handleChange("bloodGroup", e.target.value)
                        }
                        className="w-20 border-b border-gray-300 focus:outline-none focus:border-teal-500 text-right"
                      />
                    ) : (
                      patient.bloodGroup || "—"
                    )
                  }
                />
                <InfoRow
                  icon={<Activity size={17} />}
                  label="Height / Weight"
                  value={
                    editMode ? (
                      <div className="flex gap-2">
                        <input
                          value={patient.height || ""}
                          onChange={(e) =>
                            handleChange("height", e.target.value)
                          }
                          className="w-20 border-b border-gray-300 focus:outline-none focus:border-teal-500"
                          placeholder="Height"
                        />
                        <input
                          value={patient.weight || ""}
                          onChange={(e) =>
                            handleChange("weight", e.target.value)
                          }
                          className="w-20 border-b border-gray-300 focus:outline-none focus:border-teal-500"
                          placeholder="Weight"
                        />
                      </div>
                    ) : (
                      `${patient.height || "—"} / ${patient.weight || "—"}`
                    )
                  }
                />
              </div>
            </ProfileSection>

            {/* Allergies */}
            <ProfileSection title="Allergies" icon={<AlertCircle size={18} />}>
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() => addNewItem("allergies", "")}
                >
                  <Plus size={16} /> Add Allergy
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                {patient.allergies?.map((allergy, i) =>
                  editMode ? (
                    <input
                      key={i}
                      value={allergy}
                      onChange={(e) =>
                        handleArrayChange("allergies", i, e.target.value)
                      }
                      className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-50 text-red-800 rounded-full text-sm font-medium border border-red-100"
                    >
                      {allergy}
                    </span>
                  ),
                )}
                {(!patient.allergies || patient.allergies.length === 0) && (
                  <p className="text-gray-500 text-sm">No known allergies</p>
                )}
              </div>
            </ProfileSection>

            {/* Current Medications */}
            <ProfileSection
              title="Medications"
              icon={<CheckCircle2 size={18} />}
            >
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() => addNewItem("currentMedications", "")}
                >
                  <Plus size={16} /> Add Medication
                </button>
              )}
              <div className="space-y-2">
                {patient.currentMedications?.map((med, i) =>
                  editMode ? (
                    <input
                      key={i}
                      value={med}
                      onChange={(e) =>
                        handleArrayChange(
                          "currentMedications",
                          i,
                          e.target.value,
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    <p key={i} className="text-gray-800">
                      {med}
                    </p>
                  ),
                )}
                {(!patient.currentMedications ||
                  patient.currentMedications.length === 0) && (
                  <p className="text-gray-500 text-sm">
                    No current medications listed
                  </p>
                )}
              </div>
            </ProfileSection>

            {/* Emergency Contact */}
            <ProfileSection title="Emergency Contact">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    value={patient.emergencyContact?.name || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "name",
                        e.target.value,
                      )
                    }
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    placeholder="Name"
                  />
                  <input
                    value={patient.emergencyContact?.relation || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "relation",
                        e.target.value,
                      )
                    }
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    placeholder="Relation"
                  />
                  <input
                    value={patient.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "emergencyContact",
                        "phone",
                        e.target.value,
                      )
                    }
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    placeholder="Phone number"
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  {patient.emergencyContact?.name ? (
                    <>
                      <p className="font-medium">
                        {patient.emergencyContact.name}
                      </p>
                      <p>{patient.emergencyContact.relation}</p>
                      <p>{patient.emergencyContact.phone}</p>
                    </>
                  ) : (
                    <p>Not provided</p>
                  )}
                </div>
              )}
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
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

export default PatientProfileDashboard;
