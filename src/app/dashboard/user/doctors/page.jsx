"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import useUserById from "@/hooks/useUserById";
import {
  ArrowDownUp,
  Calendar,
  CircleCheckBig,
  RotateCcw,
  Search,
  X,
  MapPin,
  Clock,
  Stethoscope,
  ChevronDown,
  CalendarDays,
  ClipboardList,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RoleGuard from "@/components/RoleGuard";

/* ── shared input style ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl " +
  "outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 " +
  "transition-all duration-200 text-gray-800 placeholder-gray-400";

const DoctorPage = () => {
  const itemsPerPage = 6;
  const [doctors, setDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortSpeciality, setSortSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { user, isLoading: userLoading, error: userError } = useUserById();

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

  /* ── fetch doctors ── */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setDoctors(data.filter((u) => u.role === "doctor"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  /* ── filter / search ── */
  useEffect(() => {
    let result = [...doctors];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(term) ||
          (d.doctorCategory || "").toLowerCase().includes(term),
      );
    }
    if (sortSpeciality) {
      result = result.filter(
        (d) =>
          (d.doctorCategory || "").toLowerCase() ===
          sortSpeciality.toLowerCase(),
      );
    }
    setFilteredDoctors(result);
  }, [searchTerm, sortSpeciality, doctors]);

  /* ── highlight ── */
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

  /* ── future dates ── */
  const getFutureDates = (doctor) => {
    if (!doctor?.openAppointmentsDates) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return doctor.openAppointmentsDates
      .filter((ds) => {
        const d = new Date(ds);
        d.setHours(0, 0, 0, 0);
        return d > today;
      })
      .map((ds) =>
        new Date(ds).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      );
  };

  const handleSelectDate = (date) => setSelectedDate(date);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      if (!response.ok)
        throw new Error(result.message || "Failed to book appointment");
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

  /* ── guards ── */
  if (userLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  if (userError || !user)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400 font-medium">
          Please log in to book an appointment.
        </p>
      </div>
    );

  /* ────────────────── RENDER ────────────────── */
  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Our Specialists
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Find a Doctor</h1>
            <p className="text-sm text-gray-400 mt-1">
              Browse and book from {doctors.length} certified specialists.
            </p>
          </div>
        </div>

        {/* ── Search + filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200
                         rounded-xl outline-none focus:border-green-400 focus:ring-2
                         focus:ring-green-100 transition-all text-gray-800 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative sm:w-56">
            <ArrowDownUp
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={sortSpeciality}
              onChange={(e) => setSortSpeciality(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200
                         rounded-xl outline-none focus:border-green-400 focus:ring-2
                         focus:ring-green-100 transition-all text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">All Specialities</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
            {sortSpeciality && (
              <button
                onClick={() => setSortSpeciality("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Result count ── */}
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-bold text-gray-700">
            {filteredDoctors.length}
          </span>{" "}
          doctor{filteredDoctors.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span>
              {" "}
              matching "
              <span className="text-green-700 font-semibold">{searchTerm}</span>
              "
            </span>
          )}
        </p>

        {/* ── Doctor list ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {paginatedDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                              flex items-center justify-center mb-3"
              >
                <Stethoscope size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No doctors found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5
                             hover:bg-[#f8faf9] transition-colors duration-200"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        doctor.doctorImageUrl ||
                        "https://i.ibb.co/33gs5fP/user.png"
                      }
                      alt={doctor.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100"
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                                     bg-green-400 rounded-full border-2 border-white"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3
                        className="text-sm font-bold text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(`${doctor.name}`),
                        }}
                      />
                      <span
                        className="text-[0.62rem] font-semibold capitalize
                                       bg-green-50 border border-green-200 text-green-700
                                       px-2 py-0.5 rounded-full"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(
                            doctor.doctorCategory || "General",
                          ),
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                      {doctor.experienceYear && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {doctor.experienceYear} yrs
                          experience
                        </span>
                      )}
                      {doctor.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {doctor.location}
                        </span>
                      )}
                      {doctor.chamberDays?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />{" "}
                          {doctor.chamberDays.join(" • ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fee + CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider">
                        Fee
                      </p>
                      <p className="text-base font-black text-gray-900 leading-none mt-0.5">
                        ৳{doctor.consultationFee?.toLocaleString() || "—"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        resetForm();
                        document.getElementById("booking_modal").showModal();
                      }}
                      className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800
                                 text-white text-xs font-bold px-4 py-2.5 rounded-xl
                                 transition-colors duration-200 shadow-sm whitespace-nowrap"
                    >
                      <Calendar size={13} />
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          data={filteredDoctors}
          itemsPerPage={itemsPerPage}
          onPageDataChange={setPaginatedDoctors}
        />
      </div>

      {/* ════════════════════════════════════
          BOOKING MODAL
      ════════════════════════════════════ */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl w-11/12 p-0 rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                <CalendarDays size={16} className="text-green-700" />
              </div>
              <div>
                <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold">
                  New Appointment
                </p>
                <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">
                  Dr. {selectedDoctor?.name}
                </p>
              </div>
            </div>
            <form method="dialog">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg
                                 bg-[#f8faf9] border border-gray-200 text-gray-400
                                 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X size={15} />
              </button>
            </form>
          </div>

          {/* Modal body */}
          <div className="p-6 max-h-[72vh] overflow-y-auto bg-[#f8faf9]">
            {selectedDoctor && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* LEFT — Form */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
                      <ClipboardList size={13} className="text-green-700" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Patient Information
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Name + Age */}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={form.name}
                        onChange={handleChange}
                        className={inputCls}
                        required
                      />
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        min="0"
                        value={form.age}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>

                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email (optional)"
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls}
                    />

                    {/* Phone + Gender */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <PhoneInput
                          country="bd"
                          value={form.phone}
                          onChange={(phone) =>
                            setForm((p) => ({ ...p, phone }))
                          }
                          inputStyle={{
                            width: "100%",
                            height: "42px",
                            fontSize: "14px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#f8faf9",
                          }}
                          buttonStyle={{
                            borderRadius: "12px 0 0 12px",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#f8faf9",
                          }}
                          containerStyle={{ width: "100%" }}
                          enableSearch
                        />
                      </div>
                      <div className="relative w-[40%]">
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className={`${inputCls} appearance-none pr-8`}
                          required
                        >
                          <option value="">Gender *</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute top-3.5 right-3 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Disease */}
                    <textarea
                      name="disease"
                      rows={3}
                      placeholder="Symptoms / Reason for visit"
                      value={form.disease}
                      onChange={handleChange}
                      className={`${inputCls} resize-none`}
                    />

                    {/* Checkbox */}
                    <label
                      htmlFor="cash-agree"
                      className="flex items-start gap-3 cursor-pointer pt-1"
                    >
                      <input
                        type="checkbox"
                        id="cash-agree"
                        checked={agreeCashPayment}
                        onChange={(e) => setAgreeCashPayment(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-green-600 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        <strong className="text-gray-700">I agree:</strong>{" "}
                        Consultation fee will be paid in
                        <strong className="text-gray-700"> cash</strong> on the
                        appointment day.
                      </span>
                    </label>
                  </div>
                </div>

                {/* RIGHT — Summary + Dates */}
                <div className="flex flex-col gap-4">
                  {/* Available dates */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
                        <CalendarDays size={13} className="text-green-700" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                        Available Dates
                      </h4>
                    </div>
                    {getFutureDates(selectedDoctor).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {getFutureDates(selectedDoctor).map((date) => (
                          <button
                            key={date}
                            type="button"
                            onClick={() => handleSelectDate(date)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
                              ${
                                selectedDate === date
                                  ? "bg-green-700 text-white border-green-700 shadow-sm"
                                  : "bg-[#f8faf9] text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50"
                              }`}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        No upcoming slots available.
                      </p>
                    )}
                  </div>

                  {/* Booking summary */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
                        <BadgeCheck size={13} className="text-green-700" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                        Booking Summary
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {[
                        {
                          label: "Doctor",
                          value: `Dr. ${selectedDoctor.name}`,
                        },
                        {
                          label: "Date",
                          value: selectedDate || "Select a date",
                        },
                        {
                          label: "Fee",
                          value: `৳${selectedDoctor.consultationFee?.toLocaleString() || "—"}`,
                        },
                        {
                          label: "Payment",
                          value: agreeCashPayment
                            ? "Cash on day"
                            : "Not confirmed",
                        },
                        { label: "Patient", value: form.name || "—" },
                        { label: "Phone", value: form.phone || "—" },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-gray-400">{label}</span>
                          <span
                            className={`font-semibold text-right max-w-[55%] truncate
                            ${
                              value === "Select a date" ||
                              value === "Not confirmed" ||
                              value === "—"
                                ? "text-gray-300"
                                : "text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5 mt-5 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold
                                   border border-red-200 bg-red-50 hover:bg-red-100 text-red-500
                                   py-2.5 rounded-xl transition-colors duration-200 disabled:opacity-50"
                      >
                        <RotateCcw size={13} /> Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold
                                    py-2.5 rounded-xl transition-colors duration-200
                                    ${
                                      isFormValid
                                        ? "bg-green-700 hover:bg-green-800 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                            Booking...
                          </>
                        ) : (
                          <>
                            <CircleCheckBig size={13} /> Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </RoleGuard>
  );
};

export default DoctorPage;
