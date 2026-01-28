import { ChevronDown, CircleCheckBig, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Bookings = ({ doctor, currency }) => {
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
        .map((dateStr) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }) || []
    );
  };

  const futureDates = getFutureDates();

  // Form State
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

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!agreeCashPayment) return; // extra safety (button already disabled)

    const submissionData = {
      ...form,
      selectedDate,
      consultationFee: doctor?.consultationFee,
      currency,
      appliedAt: new Date().toISOString(),
      cashOnAppointment: true,
    };

    console.log("Appointment Submission Data:", submissionData);

    // send to backend
    // fetch('/api/book-appointment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submissionData),
    // });
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
    agreeCashPayment;

  return (
    <div className="mt-6 space-y-8">
      {/* Chamber days */}
      <div>
        <h3 className="text-xl font-bold text-[#003367] mb-3">
          Available Dates
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[#003367]">
          <FaLongArrowAltRight size={20} className="text-lime-600" />
          {doctor?.chamberDays?.map((day, i) => (
            <span key={i} className="text-sm font-medium">
              {day}
              {i !== doctor.chamberDays.length - 1 && ","}
            </span>
          ))}
        </div>
      </div>

      {/* Available dates */}
      <div className="border border-gray-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xl font-bold text-[#003367] mb-4">
          Available Consultation Dates
        </h3>
        {futureDates.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {futureDates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDate(date)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300
                  ${
                    selectedDate === date
                      ? "bg-[#7CAB33] text-white"
                      : "bg-gray-200 text-[#003367] hover:bg-[#7CAB33]/60 hover:text-white"
                  }`}
              >
                {date}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No upcoming consultation dates available.
          </p>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT - Form */}
        <div>
          <h3 className="text-2xl font-bold text-[#003367] mb-6">
            Appointment Form
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={form.name}
                onChange={handleChange}
                className="input focus:outline-none focus:border-2 focus:border-[#93C249]"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Enter Age"
                value={form.age}
                onChange={handleChange}
                className="input focus:outline-none focus:border-2 focus:border-[#93C249]"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Enter E-mail"
              value={form.email}
              onChange={handleChange}
              className="input w-full focus:outline-none focus:border-2 focus:border-[#93C249]"
            />

            <div className="flex items-center gap-4">
              <PhoneInput
                country="bd"
                value={form.phone}
                onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "14px",
                  borderRadius: "4px",
                }}
                buttonStyle={{ borderRadius: "4px 0 0 4px" }}
                containerStyle={{ width: "100%" }}
                enableSearch
                placeholder="Enter mobile number"
              />

              <div className="w-[40%] relative">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input focus:outline-none focus:border-2 focus:border-[#93C249] w-full"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown
                  className="absolute top-3 right-3 text-gray-500"
                  size={16}
                />
              </div>
            </div>

            <textarea
              name="disease"
              placeholder="Enter Disease Details"
              value={form.disease}
              onChange={handleChange}
              rows={4}
              className="textarea textarea-lg w-full placeholder:text-sm focus:outline-none focus:border-2 focus:border-[#93C249]"
            />

            {/* Required Checkbox */}
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="cash-agreement"
                checked={agreeCashPayment}
                onChange={(e) => setAgreeCashPayment(e.target.checked)}
                className="checkbox checkbox-sm mt-1"
                required
              />
              <label
                htmlFor="cash-agreement"
                className="text-sm text-gray-700 cursor-pointer"
              >
                <strong>I agree:</strong> The consultation fee will be paid in
                cash on the appointment day.
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT - Summary */}
        <div>
          <h3 className="text-2xl font-bold text-[#003367] mb-6">
            Confirm Your Booking
          </h3>

          <div className="space-y-2.5 text-lg">
            <p>
              <span className="text-lime-600 font-semibold">
                Patient Name :
              </span>{" "}
              {form.name || "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Age :</span>{" "}
              {form.age ? `${form.age} Years` : "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Gender :</span>{" "}
              {form.gender || "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Email :</span>{" "}
              {form.email || "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Phone :</span>{" "}
              {form.phone || "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Date :</span>{" "}
              {selectedDate || "Please select a date"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Fees :</span>{" "}
              {doctor?.consultationFee
                ? `${doctor.consultationFee} ${currency}`
                : "—"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Payment :</span>{" "}
              {agreeCashPayment ? "Cash on appointment day" : "Not confirmed"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">
                Disease Details :
              </span>{" "}
              {form.disease || "—"}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={resetForm}
                className="btn btn-error flex-1 text-white"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`btn flex-1 text-white ${
                  isFormValid
                    ? "bg-lime-600 border-lime-600 hover:bg-lime-700"
                    : "btn-disabled bg-gray-400 border-gray-400"
                }`}
              >
                <CircleCheckBig size={16} />
                Take Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
