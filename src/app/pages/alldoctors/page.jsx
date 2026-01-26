"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // open appointment modal
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
      alert("Please fill in all fields.");
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
          setShowModal(false);
          // Reset form
          setPatientName("");
          setPhone("");
          setReason("");
          setAppointmentDate("");
          setAppointmentTime("");
        } else {
          alert("Failed to update user status");
        }
      } else {
        alert(result.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setDoctors(data.filter((user) => user.role === "doctor"));
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / itemsPerPage);
  const currentDoctors = doctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-screen-xl md:mx-auto mx-5 pb-12">
      <div>
        <h2 className="text-xl md:text-3xl text-center font-bold my-8">
          Our Doctors
        </h2>
      </div>

      {isLoadingDoctors ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {currentDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card bg-base-100 shadow hover:shadow-md transition-shadow"
              >
                <div className="badge badge-warning absolute top-0 left-0 m-3 font-bold px-4 py-3 rounded-none z-10">
                  {doctor.doctorCategory || "General"}
                </div>
                <figure className="relative h-52">
                  <Image
                    src={doctor.doctorImageUrl || "/placeholder-doctor.jpg"}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{doctor.name}</h2>
                  <p className="text-sm opacity-70">{doctor.email}</p>
                  <div className="card-actions justify-end mt-3">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAppointmentClick(doctor)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 px-4 gap-4">
              <p className="text-sm opacity-70">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalDoctors)} of{" "}
                {totalDoctors}
              </p>

              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ────────────────────────────────────────────────
          MODAL – always mounted, visibility controlled by classes
      ──────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 ${
          showModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowModal(false)}
        />

        {/* Modal content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`
              relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto
              transition-all duration-300 ease-out transform
              ${
                showModal
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-12 pointer-events-none"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedDoctor && (
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  Book Appointment with {selectedDoctor.name}
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full min-h-24"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAppointmentSubmit}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
