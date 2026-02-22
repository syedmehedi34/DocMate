"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import useUserById from "@/hooks/useUserById";

const DoctorPage = () => {
  const itemsPerPage = 6;
  const [doctors, setDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { user, isLoading, error } = useUserById();
  console.log(user?._id);

  // fetch all doctors data
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

  // book appointment handler

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
                        onClick={() =>
                          document.getElementById("my_modal_1").showModal()
                        }
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
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            {/* modal content */}
            <div>
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </RoleGuard>
  );
};

export default DoctorPage;
