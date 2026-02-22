"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import useUserById from "@/hooks/useUserById";
import {
  ArrowDownUp,
  Calendar,
  CircleCheckBig,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const DoctorPage = () => {
  const itemsPerPage = 6;
  const [doctors, setDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortSpeciality, setSortSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { user, isLoading: userLoading, error: userError } = useUserById();

  // Form & modal state
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: "",
    disease: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [agreeCashPayment, setAgreeCashPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setDoctors(data.filter((u) => u.role === "doctor"));
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Real-time search + sort filter
  useEffect(() => {
    let result = [...doctors];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((doctor) => {
        const name = (doctor.name || "").toLowerCase();
        const speciality = (doctor.doctorCategory || "").toLowerCase();
        return name.includes(term) || speciality.includes(term);
      });
    }

    // Sort by speciality
    if (sortSpeciality) {
      result = result.filter((doctor) => {
        return (
          (doctor.doctorCategory || "").toLowerCase() ===
          sortSpeciality.toLowerCase()
        );
      });
    }

    setFilteredDoctors(result);
  }, [searchTerm, sortSpeciality, doctors]);

  // Highlight function (এখানে define করা হলো — scope ঠিক)
  const highlightText = (text = "") => {
    if (!searchTerm.trim() || !text) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );

    return text.replace(
      regex,
      '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>',
    );
  };

  const getFutureDates = (doctor) => {
    if (!doctor?.openAppointmentsDates) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return doctor.openAppointmentsDates
      .filter((dateStr) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        return d > today;
      })
      .map((dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      age: "",
      email: "",
      phone: "",
      gender: "",
      disease: "",
    });
    setSelectedDate("");
    setAgreeCashPayment(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (
      !agreeCashPayment ||
      !selectedDate ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.gender
    ) {
      toast.error("Please fill all required fields and agree to cash payment.");
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      patientName: form.name.trim(),
      patientAge: form.age ? Number(form.age) : undefined,
      patientGender: form.gender,
      patientEmail: form.email?.trim() || undefined,
      patientPhone: form.phone.trim(),
      appointmentDate: selectedDate,
      consultationFee: selectedDoctor?.consultationFee,
      currency: "BDT",
      cashOnAppointmentDay: true,
      diseaseDetails: form.disease?.trim() || undefined,
      appliedAt: new Date().toISOString(),

      applicantUserId: user?._id,
      applicantUserName: user?.name?.trim(),
      applicantUserEmail: user?.email?.trim(),

      doctorId: selectedDoctor?._id,
      doctorName: selectedDoctor?.name?.trim(),
      doctorEmail: selectedDoctor?.email?.trim(),

      isAppointmentConfirmed: false,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book appointment");
      }

      toast.success("Appointment booked successfully!");
      resetForm();
      document.getElementById("booking_modal").close();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    selectedDate &&
    form.name.trim() &&
    form.phone.trim() &&
    form.gender &&
    agreeCashPayment &&
    !isSubmitting;

  if (userLoading) return <div className="text-center py-12">Loading...</div>;
  if (userError || !user) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        Please log in to book an appointment.
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Our Specialists
            </h1>
          </div>

          {/* Search + Sort Controls */}
          <div className="mb-6 flex flex-col justify-between sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md text-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search by doctor name, specialities, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sort by Speciality Dropdown */}
            <div className="relative w-full sm:w-64 text-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowDownUp className="h-4 w-4 text-gray-400" />
              </div>

              <select
                value={sortSpeciality}
                onChange={(e) => setSortSpeciality(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="">Sort by Speciality (All)</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>

              {sortSpeciality && (
                <button
                  onClick={() => setSortSpeciality("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Doctors List */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-300">
              {paginatedDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="p-5 sm:p-6 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="flex flex-col gap-5">
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
                          {/* Highlight Doctor Name */}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(`Dr. ${doctor.name}`),
                            }}
                          />
                        </div>
                        <div className="text-sm text-indigo-600 font-medium mt-0.5">
                          {/* Highlight Speciality */}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(
                                doctor.doctorCategory || "General Medicine",
                              ),
                            }}
                          />
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          {doctor.experienceYear && (
                            <span>
                              {doctor.experienceYear} years experience •{" "}
                            </span>
                          )}
                          {doctor.location && <span>{doctor.location}</span>}
                        </div>
                      </div>
                    </div>

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

                    <div>
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          resetForm();
                          document.getElementById("booking_modal").showModal();
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>

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

          <Pagination
            data={filteredDoctors}
            itemsPerPage={itemsPerPage}
            onPageDataChange={setPaginatedDoctors}
          />
        </div>

        {/* Booking Modal */}
        <dialog
          id="booking_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box max-w-4xl w-11/12 p-0 overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-6 py-4 sticky top-0 z-10">
              <h3 className="text-xl font-bold">
                Book Appointment with Dr. {selectedDoctor?.name}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100">
              {selectedDoctor && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* LEFT - Form */}
                  <div>
                    <h4 className="text-xl font-bold text-[#003367] mb-5">
                      Patient Information
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name *"
                          value={form.name}
                          onChange={handleChange}
                          className="input input-bordered w-full focus:border-indigo-500"
                          required
                        />
                        <input
                          type="number"
                          name="age"
                          placeholder="Age"
                          value={form.age}
                          onChange={handleChange}
                          className="input input-bordered w-full focus:border-indigo-500"
                          min="0"
                        />
                      </div>

                      <input
                        type="email"
                        name="email"
                        placeholder="Email (optional)"
                        value={form.email}
                        onChange={handleChange}
                        className="input input-bordered w-full focus:border-indigo-500"
                      />

                      {/* Mobile number & gender */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="w-full sm:flex-1">
                          <PhoneInput
                            country="bd"
                            value={form.phone}
                            onChange={(phone) =>
                              setForm((p) => ({ ...p, phone }))
                            }
                            inputProps={{
                              name: "phone",
                              required: true,
                              className:
                                "pl-12 input input-bordered w-full focus:border-indigo-500 !h-10 !text-base",
                            }}
                            containerClass="!w-full"
                            buttonClass="!rounded-l-lg !border-gray-300"
                            inputClass="!rounded-r-lg !border-gray-300"
                            enableSearch
                            placeholder="Mobile number *"
                          />
                        </div>

                        <div className="w-full sm:w-40">
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="pl-2 select select-bordered w-full focus:border-indigo-500"
                            required
                          >
                            <option value="">Gender *</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        name="disease"
                        placeholder="Disease / Symptoms / Reason for visit"
                        value={form.disease}
                        onChange={handleChange}
                        rows={4}
                        className="textarea textarea-bordered w-full focus:border-indigo-500"
                      />

                      {/* checkbox container */}
                      <div className="flex items-start gap-3 mt-5 ">
                        <input
                          type="checkbox"
                          id="cash-agree"
                          checked={agreeCashPayment}
                          onChange={(e) =>
                            setAgreeCashPayment(e.target.checked)
                          }
                          className="checkbox checkbox-primary mt-1"
                        />
                        <label
                          htmlFor="cash-agree"
                          className="text-sm cursor-pointer"
                        >
                          <strong>I agree:</strong> Consultation fee will be
                          paid in <strong>cash</strong> on the appointment day.
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT - Summary & Dates */}
                  <div>
                    <h4 className="text-xl font-bold text-[#003367] mb-5">
                      Confirm Booking
                    </h4>

                    <div className="space-y-3 text-base">
                      <p>
                        <span className="font-semibold text-indigo-700">
                          Doctor:
                        </span>{" "}
                        Dr. {selectedDoctor.name}
                      </p>
                      <p>
                        <span className="font-semibold text-indigo-700">
                          Date:
                        </span>{" "}
                        {selectedDate || "— Please select —"}
                      </p>
                      <p>
                        <span className="font-semibold text-indigo-700">
                          Fee:
                        </span>{" "}
                        ৳
                        {selectedDoctor.consultationFee?.toLocaleString() ||
                          "—"}
                      </p>
                      <p>
                        <span className="font-semibold text-indigo-700">
                          Payment:
                        </span>{" "}
                        {agreeCashPayment ? "Cash on day" : "Not confirmed"}
                      </p>

                      <div className="mt-6">
                        <h5 className="font-semibold mb-2">Available Dates</h5>
                        <div className="flex flex-wrap gap-2">
                          {getFutureDates(selectedDoctor).length > 0 ? (
                            getFutureDates(selectedDoctor).map((date) => (
                              <button
                                key={date}
                                type="button"
                                onClick={() => handleSelectDate(date)}
                                className={`btn btn-sm ${
                                  selectedDate === date
                                    ? "btn-primary text-white"
                                    : "btn-outline"
                                }`}
                              >
                                {date}
                              </button>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No upcoming slots available
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <button
                          type="button"
                          className="btn btn-error flex-1"
                          onClick={resetForm}
                          disabled={isSubmitting}
                        >
                          <RotateCcw size={16} />
                          Reset
                        </button>

                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!isFormValid}
                          className={`btn flex-1 text-white gap-2 ${
                            isFormValid
                              ? "btn-success"
                              : "btn-disabled bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="loading loading-spinner loading-sm"></span>
                              Booking...
                            </>
                          ) : (
                            <>
                              <CircleCheckBig size={16} />
                              Confirm Booking
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-action px-6 pb-6 pt-2 border-t bg-base-100 sticky bottom-0 z-10">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </RoleGuard>
  );
};

export default DoctorPage;
