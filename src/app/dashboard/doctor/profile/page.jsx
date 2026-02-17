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
} from "lucide-react";
import useUserById from "@/hooks/useUserById";

const DoctorProfileDashboard = () => {
  const { user, isLoading, error } = useUserById();
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) setDoctor(user);
  }, [user]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (field, value) => {
    setDoctor((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setDoctor((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleNestedChange = (parent, index, subField, value) => {
    setDoctor((prev) => {
      const newArray = [...prev[parent]];
      newArray[index] = { ...newArray[index], [subField]: value };
      return { ...prev, [parent]: newArray };
    });
  };

  const addNewItem = (field, template) => {
    setDoctor((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));
  };

  const saveChanges = () => {
    console.log("Saving doctor data:", doctor);
    alert("Changes saved (demo)");
    setEditMode(false);
  };

  if (isLoading || !doctor) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading data</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow">
                  <img
                    src={doctor.doctorImageUrl || "/default-doctor.jpg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {doctor.currentStatus === "available" && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
                )}
              </div>

              {/* Info */}
              <div>
                {editMode ? (
                  <input
                    type="text"
                    value={doctor.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-teal-500 w-full"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {doctor.name}
                  </h1>
                )}

                <div className="mt-2 flex items-center gap-3 text-lg font-medium text-teal-700">
                  <Stethoscope size={20} />
                  {editMode ? (
                    <input
                      type="text"
                      value={doctor.doctorCategory}
                      onChange={(e) =>
                        handleChange("doctorCategory", e.target.value)
                      }
                      className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                  ) : (
                    doctor.doctorCategory.charAt(0).toUpperCase() +
                    doctor.doctorCategory.slice(1)
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {editMode ? (
                      <input
                        type="email"
                        value={doctor.appointmentEmail || doctor.email}
                        onChange={(e) =>
                          handleChange("appointmentEmail", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      doctor.appointmentEmail || doctor.email
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {editMode ? (
                      <input
                        type="tel"
                        value={doctor.appointmentNumber}
                        onChange={(e) =>
                          handleChange("appointmentNumber", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      doctor.appointmentNumber
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {editMode ? (
                      <input
                        type="text"
                        value={doctor.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        className="border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      doctor.location
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

        {/* Main & Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <ProfileSection title="About" icon={<User size={18} />}>
              {editMode ? (
                <textarea
                  value={doctor.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {doctor.about || "No professional summary added yet."}
                </p>
              )}
            </ProfileSection>

            {/* Professional Experience */}
            <ProfileSection
              title="Professional Experience"
              icon={<Briefcase size={18} />}
            >
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() =>
                    addNewItem("worksAndExperiences", {
                      position: "",
                      workedAt: "",
                      duration: "",
                    })
                  }
                >
                  <Plus size={16} /> Add Experience
                </button>
              )}
              <div className="space-y-5">
                {doctor.worksAndExperiences?.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-teal-100 pl-5">
                    {editMode ? (
                      <>
                        <input
                          value={exp.position}
                          onChange={(e) =>
                            handleNestedChange(
                              "worksAndExperiences",
                              idx,
                              "position",
                              e.target.value,
                            )
                          }
                          className="font-medium text-gray-900 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500"
                          placeholder="Position"
                        />
                        <input
                          value={exp.workedAt}
                          onChange={(e) =>
                            handleNestedChange(
                              "worksAndExperiences",
                              idx,
                              "workedAt",
                              e.target.value,
                            )
                          }
                          className="text-gray-600 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500 mt-1"
                          placeholder="Worked At"
                        />
                        <input
                          value={exp.duration}
                          onChange={(e) =>
                            handleNestedChange(
                              "worksAndExperiences",
                              idx,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="text-sm text-gray-500 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500 mt-1"
                          placeholder="Duration"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-900">
                          {exp.position}
                        </p>
                        <p className="text-gray-600">{exp.workedAt}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>

            {/* Education */}
            <ProfileSection
              title="Education"
              icon={<GraduationCap size={18} />}
            >
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() =>
                    addNewItem("educations", {
                      degree: "",
                      institution: "",
                      year: "",
                    })
                  }
                >
                  <Plus size={16} /> Add Education
                </button>
              )}
              <div className="relative">
                <div className="absolute left-3 top-0 h-full border-l-2 border-teal-200 mt-1"></div>
                <div className="space-y-4 pl-8">
                  {doctor.educations?.map((edu, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute left-[-27.1px] top-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white shadow"></div>
                      {editMode ? (
                        <div className="space-y-1">
                          <input
                            value={edu.degree}
                            onChange={(e) =>
                              handleNestedChange(
                                "educations",
                                idx,
                                "degree",
                                e.target.value,
                              )
                            }
                            className="font-medium text-gray-900 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500"
                            placeholder="Degree"
                          />
                          <input
                            value={edu.institution}
                            onChange={(e) =>
                              handleNestedChange(
                                "educations",
                                idx,
                                "institution",
                                e.target.value,
                              )
                            }
                            className="text-gray-600 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500 mt-1"
                            placeholder="Institution"
                          />
                          <input
                            value={edu.year}
                            onChange={(e) =>
                              handleNestedChange(
                                "educations",
                                idx,
                                "year",
                                e.target.value,
                              )
                            }
                            className="text-sm text-gray-500 border-b border-gray-300 w-full focus:outline-none focus:border-teal-500 mt-1"
                            placeholder="Year"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">
                            {edu.degree}
                          </p>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileSection title="Practice Details">
              {/* Consultation Fee */}
              <div className="border rounded mb-5 bg-[#F0FDFA] border-teal-200 font-bold">
                <InfoRow
                  icon={<DollarSign size={17} />}
                  label="Consultation Fee"
                  value={
                    editMode ? (
                      <input
                        type="number"
                        value={doctor.consultationFee}
                        onChange={(e) =>
                          handleChange(
                            "consultationFee",
                            Number(e.target.value),
                          )
                        }
                        className="w-24 text-right border-b border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    ) : (
                      `৳ ${doctor.consultationFee}`
                    )
                  }
                />
              </div>

              {/* Chamber Hours */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={17} />
                    <span>Chamber Hours</span>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => addNewItem("chamberTime", "")}
                      className="text-teal-600 flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-1">
                    {doctor.chamberTime?.map((time, i) => (
                      <input
                        key={i}
                        value={time}
                        onChange={(e) =>
                          handleArrayChange("chamberTime", i, e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                        placeholder="HH:MM - HH:MM"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-800">
                    {doctor.chamberTime?.join(" • ")}
                  </p>
                )}
              </div>

              {/* Chamber Days */}
              <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarDays size={17} />
                    <span>Chamber Days</span>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => addNewItem("chamberDays", "")}
                      className="text-teal-600 flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-1">
                    {doctor.chamberDays?.map((day, i) => (
                      <input
                        key={i}
                        value={day}
                        onChange={(e) =>
                          handleArrayChange("chamberDays", i, e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500"
                        placeholder="Day"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-800">
                    {doctor.chamberDays?.join(", ")}
                  </p>
                )}
              </div>

              {/* Availability */}
              <InfoRow
                icon={<CheckCircle2 size={17} />}
                label="Availability"
                value={
                  editMode ? (
                    <select
                      value={doctor.currentStatus}
                      onChange={(e) =>
                        handleChange("currentStatus", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-teal-500"
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="on leave">On Leave</option>
                    </select>
                  ) : (
                    <span className="text-teal-700 font-medium capitalize">
                      {doctor.currentStatus}
                    </span>
                  )
                }
              />
            </ProfileSection>

            {/* Specializations */}
            <ProfileSection title="Specializations" icon={<Award size={18} />}>
              {editMode && (
                <button
                  className="flex items-center gap-1 mb-3 text-teal-600 font-medium"
                  onClick={() => addNewItem("specializations", "")}
                >
                  <Plus size={16} /> Add Specialization
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                {doctor.specializations?.map((spec, i) =>
                  editMode ? (
                    <input
                      key={i}
                      value={spec}
                      onChange={(e) =>
                        handleArrayChange("specializations", i, e.target.value)
                      }
                      className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
                      placeholder="Specialization"
                    />
                  ) : (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-full text-sm font-medium border border-teal-100"
                    >
                      {spec}
                    </span>
                  ),
                )}
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

const InfoRow = ({ icon, label, value }) => (
  <div className="px-6 py-4 flex items-center justify-between text-sm">
    <div className="flex items-center gap-3 text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <div className="font-medium text-gray-800">{value}</div>
  </div>
);

export default DoctorProfileDashboard;
