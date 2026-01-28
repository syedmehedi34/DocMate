import { ChevronDown, CircleCheckBig, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Bookings = ({ doctor, currency }) => {
  // future dates + formatted date
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

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-6 space-y-8">
      {/* chamber days */}
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

      {/* appointment dates */}
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
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 cursor-pointer
                  ${
                    selectedDate === date
                      ? "bg-[#7CAB33] text-white"
                      : "bg-gray-200 text-[#003367] hover:bg-[#7CAB33]/60 hover:text-white"
                  }
                `}
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

      {/* Appointment Form */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
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

            {/* phone + gender */}
            <div className="flex  items-center gap-4">
              <PhoneInput
                country={"bd"}
                value={form.phone}
                onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "14px",
                  borderRadius: "4px",
                }}
                buttonStyle={{
                  borderRadius: "4px 0 0 4px",
                }}
                containerStyle={{
                  width: "100%",
                }}
                enableSearch
                placeholder="Enter mobile number"
              />

              <div className="w-[40%] relative">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input focus:outline-none focus:border-2 focus:border-[#93C249]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span className="absolute top-2 right-3">
                  <ChevronDown className="text-gray-500" />
                </span>
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

            <div className="flex gap-4 mt-6">
              {/* tick mark */}
              {/*  */}
              <input type="checkbox" className="checkbox checkbox-sm" />
              <p className="text-sm text-gray-600">
                The consultation fee will be paid in cash on the appointment
                day.
              </p>
              {/*  */}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-2xl font-bold text-[#003367] mb-6">
            Confirm Your Booking
          </h3>

          <div className="space-y-2.5 text-lg">
            <p>
              <span className="text-lime-600 font-semibold">
                Patient Name :
              </span>{" "}
              {form.name || ""}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Age :</span>{" "}
              {form.age ? `${form.age} Years` : ""}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Gender :</span>{" "}
              {form.gender || ""}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Email :</span>{" "}
              {form.email || ""}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">
                Phone Number :
              </span>{" "}
              {form.phone || ""}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Date :</span>{" "}
              {selectedDate || "Please select a date"}
            </p>
            <p>
              <span className="text-lime-600 font-semibold">Fees :</span>{" "}
              {doctor?.consultationFee} {currency}
            </p>

            <p>
              <span className="text-lime-600 font-semibold">
                Disease Details :
              </span>
              {" " + form.disease}
            </p>

            {/* buttons */}
            <div className="mt-6 flex gap-2 items-center">
              <button
                onClick={() => {
                  setForm({
                    name: "",
                    age: "",
                    email: "",
                    phone: "",
                    gender: "",
                    disease: "",
                  });
                  setSelectedDate("");
                }}
                className="btn btn-error flex-1 text-white"
              >
                <span>
                  <RotateCcw size={16} />
                </span>
                Reset
              </button>
              <button className="btn btn-primary border-lime-600 text-white rounded bg-lime-600 flex-1">
                <span>
                  <CircleCheckBig size={16} />
                </span>
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
