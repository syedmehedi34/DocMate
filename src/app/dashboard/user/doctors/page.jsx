"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const { data: session } = useSession();

  const itemsPerPage = 6;

  const handleAppointmentClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleAppointmentSubmit = async () => {
    if (
      !selectedDoctor ||
      !appointmentDate ||
      !appointmentTime ||
      !patientName ||
      !phone ||
      !reason
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor._id,
      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      patientName,
      phone,
      reason,
      date: appointmentDate,
      time: appointmentTime,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const result = await res.json();

      if (res.ok) {
        const userUpdateData = { isPatient: true };
        const userRes = await fetch(`/api/users/${session?.user?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userUpdateData),
        });

        if (userRes.ok) {
          alert("Appointment booked successfully!");
        } else {
          alert("Failed to update user status.");
        }
        setShowModal(false);
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setDoctors(data.filter((user) => user.role === "doctor"));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Our Specialists
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Book consultations with experienced doctors across various
              specialties
            </p>
          </div>

          {/* Doctors List */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-300">
              {paginatedDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="p-5 sm:p-6 hover:bg-indigo-50/30 transition-colors duration-150"
                >
                  <div className="flex flex-col gap-5">
                    {/* Doctor info - vertical stack on mobile */}
                    <div className="flex items-start gap-4">
                      <img
                        className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
                        src={
                          doctor.doctorImageUrl ||
                          "https://i.ibb.co/33gs5fP/user.png"
                        }
                        alt={doctor.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900">
                          Dr. {doctor.name}
                        </div>
                        <div className="text-sm text-indigo-600 font-medium mt-0.5">
                          {doctor.doctorCategory || "General Medicine"}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          {doctor.experienceYear && (
                            <span>
                              {doctor.experienceYear} years experience -{" "}
                            </span>
                          )}
                          {doctor.location && <span>{doctor.location}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Extra info row (fee + booking number) - visible on mobile */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 sm:hidden">
                      <div>
                        Fee:{" "}
                        <span className="font-medium text-gray-900">
                          ৳{doctor.consultationFee?.toLocaleString() || "—"}
                        </span>
                      </div>
                      {doctor.appointmentNumber && (
                        <div>
                          Booking:{" "}
                          <span className="font-medium">
                            {doctor.appointmentNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Book button - full width on mobile */}
                    <div>
                      <button
                        onClick={() => handleAppointmentClick(doctor)}
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>

                  {/* Desktop-only extra info */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                    <div className="flex gap-6">
                      <div>
                        Fee:{" "}
                        <span className="font-medium text-gray-900">
                          ৳{doctor.consultationFee?.toLocaleString() || "—"}
                        </span>
                      </div>
                      {doctor.appointmentNumber && (
                        <div>
                          Booking No:{" "}
                          <span className="font-medium">
                            {doctor.appointmentNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {doctor.chamberDays?.length > 0 &&
                        doctor.chamberDays.join(" • ")}
                    </div>
                  </div>
                </div>
              ))}

              {doctors.length === 0 && (
                <div className="py-16 text-center text-gray-500">
                  No doctors available at the moment.
                </div>
              )}
            </div>
          </div>

          {/* Pagination Component */}
          <Pagination
            data={doctors}
            itemsPerPage={itemsPerPage}
            onPageDataChange={setPaginatedDoctors}
          />
        </div>

        {/* Modal */}
        {showModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-white">
                <h3 className="text-xl font-semibold text-gray-900">
                  Appointment with Dr. {selectedDoctor.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedDoctor.doctorCategory} • ৳
                  {selectedDoctor.consultationFee?.toLocaleString() || "—"}
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Time
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Reason for Visit
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    placeholder="Describe your symptoms or purpose of visit..."
                  />
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAppointmentSubmit}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorPage;
