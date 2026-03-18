// src/app/(pages)/alldoctors/[id]/Bookings.jsx

import useUserById from "@/hooks/useUserById";
import {
  ChevronDown,
  CircleCheckBig,
  RotateCcw,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Bookings = ({ doctor, currency }) => {
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

  const getFutureDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      doctor?.openAppointmentsDates
        ?.filter((dateStr) => {
          const date = new Date(dateStr);
          date.setHours(0, 0, 0, 0);
          return date > today;
        })
        .map((dateStr) =>
          new Date(dateStr).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        ) || []
    );
  };
  const futureDates = getFutureDates();

  const handleSelectDate = (date) => setSelectedDate(date);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !agreeCashPayment ||
      !selectedDate ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.gender
    )
      return;
    setIsSubmitting(true);
    const submissionData = {
      patientName: form.name.trim(),
      patientAge: form.age ? Number(form.age) : undefined,
      patientGender: form.gender,
      patientEmail: form.email?.trim() || undefined,
      patientPhone: form.phone.trim(),
      appointmentDate: selectedDate,
      consultationFee: doctor?.consultationFee,
      currency: currency || "BDT",
      cashOnAppointmentDay: true,
      diseaseDetails: form.disease?.trim() || undefined,
      appliedAt: new Date().toISOString(),
      applicantUserId: user?._id,
      applicantUserName: user?.name?.trim(),
      applicantUserEmail: user?.email?.trim(),
      doctorId: doctor?._id,
      doctorName: doctor?.name?.trim(),
      doctorEmail: doctor?.email?.trim(),
      isAppointmentConfirmed: false,
    };
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      console.log(result);
      toast.success("Appointment booked successfully!");
      if (!response.ok)
        throw new Error(result.message || "Failed to book appointment");
      resetForm();
    } catch (err) {
      console.log(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
  };

  const isFormValid =
    selectedDate &&
    form.name.trim() &&
    form.phone.trim() &&
    form.gender &&
    agreeCashPayment &&
    !isSubmitting;

  if (userLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading user information...</p>
        </div>
      </div>
    );

  if (userError || !user)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-3">
          <CircleCheckBig size={24} className="text-red-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700">
          Please log in to book an appointment.
        </p>
      </div>
    );

  /* ── Input class helper ── */
  const inputCls =
    "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 text-gray-800 placeholder-gray-400";

  return (
    <div className="mt-6 space-y-6">
      {/* ── Chamber days ── */}
      <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
            <CalendarDays size={13} className="text-green-700" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Chamber Days
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {doctor?.chamberDays?.map((day, i) => (
            <span
              key={i}
              className="text-xs font-semibold bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-lg"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* ── Available dates ── */}
      <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
            <CalendarDays size={13} className="text-green-700" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Available Consultation Dates
          </h3>
        </div>
        {futureDates.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {futureDates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDate(date)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${
                    selectedDate === date
                      ? "bg-green-700 text-white border-green-700 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                  }`}
              >
                {date}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            No upcoming consultation dates available.
          </p>
        )}
      </div>

      {/* ── Form + Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Form */}
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
              <ClipboardList size={13} className="text-green-700" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Appointment Form
            </h3>
          </div>

          <div className="space-y-3.5">
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
                value={form.age}
                onChange={handleChange}
                className={inputCls}
                min="0"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email (Optional)"
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
                  onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
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
              <div className="relative w-[38%]">
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
                  className="absolute top-3 right-3 text-gray-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* Disease */}
            <textarea
              name="disease"
              placeholder="Disease details (optional)"
              value={form.disease}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-none`}
            />

            {/* Agree checkbox */}
            <label
              htmlFor="cash-agreement"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                id="cash-agreement"
                checked={agreeCashPayment}
                onChange={(e) => setAgreeCashPayment(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-600 cursor-pointer"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-800">I agree:</strong> The
                consultation fee will be paid in cash on the appointment day.
              </span>
            </label>
          </div>
        </div>

        {/* RIGHT — Summary */}
        <div className="bg-[#f8faf9] border border-gray-100 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
              <CircleCheckBig size={13} className="text-green-700" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Booking Summary
            </h3>
          </div>

          {/* Summary rows */}
          <div className="flex-1 space-y-3 text-sm">
            {[
              { label: "Patient Name", value: form.name || "—" },
              { label: "Age", value: form.age ? `${form.age} yrs` : "—" },
              { label: "Gender", value: form.gender || "—" },
              { label: "Email", value: form.email || "—" },
              { label: "Phone", value: form.phone || "—" },
              { label: "Date", value: selectedDate || "Select a date" },
              {
                label: "Fee",
                value: doctor?.consultationFee
                  ? `${currency} ${doctor.consultationFee}`
                  : "—",
              },
              {
                label: "Payment",
                value: agreeCashPayment
                  ? "Cash on appointment day"
                  : "Not confirmed",
              },
              { label: "Disease Details", value: form.disease || "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-400 text-xs shrink-0">{label}</span>
                <span
                  className={`text-xs font-semibold text-right break-all ${value === "—" || value === "Select a date" || value === "Not confirmed" ? "text-gray-400" : "text-gray-800"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={resetForm}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-1.5
                         border border-red-200 bg-red-50 hover:bg-red-100
                         text-red-500 text-sm font-semibold py-2.5 rounded-xl
                         transition-colors duration-200 disabled:opacity-50"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold
                          py-2.5 rounded-xl transition-colors duration-200
                          ${
                            isFormValid
                              ? "bg-green-700 hover:bg-green-800 text-white shadow-sm"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Booking...
                </>
              ) : (
                <>
                  <CircleCheckBig size={14} /> Take Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
