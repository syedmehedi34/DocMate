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

  const handleAppointmentClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  // * Handle appointment submission */
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

        const userUpdateResult = await userRes.json();

        if (userRes.ok) {
          alert("Appointment booked successfully, and user updated!");
        } else {
          alert(userUpdateResult.error || "Failed to update user.");
        }

        setShowModal(false);
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  // * ends here */

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const doctorData = data.filter((user) => user.role === "doctor");
      setDoctors(doctorData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Pagination calculations
  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / itemsPerPage);
  const currentDoctors = doctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination handlers with loading effect
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setIsLoadingDoctors(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsLoadingDoctors(false);
      }, 500);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setIsLoadingDoctors(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsLoadingDoctors(false);
      }, 500);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setIsLoadingDoctors(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsLoadingDoctors(false);
      }, 500);
    }
  };
  // ends pagination handlers

  return (
    <div className="max-w-screen-xl md:mx-auto mx-5">
      <h2 className="text-xl md:text-3xl text-center font-bold my-5">
        All Doctors
      </h2>

      {isLoadingDoctors ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {currentDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="card bg-base-100 shadow-sm relative"
            >
              <p className="z-50 badge absolute badge-md badge-warning font-bold text-md p-3 rounded-none">
                {doctor.doctorCategory || "N/A"}
              </p>
              <figure className="relative w-full h-52">
                <Image
                  src={doctor.doctorImageUrl}
                  alt="Doctor"
                  fill
                  className="object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{doctor.name}</h2>
                <p>{doctor.email}</p>
                <div className="justify-end card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAppointmentClick(doctor)}
                  >
                    Appointment Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* pagination starts */}
      <div className="flex flex-col md:flex-row justify-between items-center my-6 px-4">
        <p className="text-sm text-[#52a09a] font-semibold">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalDoctors)} of {totalDoctors}{" "}
          results
        </p>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button
            className={`px-3 py-1 border rounded cursor-pointer ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#66c0b8]"
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 border rounded cursor-pointer ${
                currentPage === index + 1
                  ? "bg-[#105852] text-white"
                  : "bg-white text-[#105852] hover:bg-[#dcf1ef]"
              }`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 border rounded cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#1d7b74]"
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {/* pagination ends */}

      {/* modal content */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Book Appointment with {selectedDoctor.name}
            </h3>

            <div className="mb-4">
              <label className="block font-semibold">Patient Name:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Phone:</label>
              <input
                type="tel"
                className="input input-bordered w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Reason:</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Date:</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Time:</label>
              <input
                type="time"
                className="input input-bordered w-full"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-error"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleAppointmentSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
