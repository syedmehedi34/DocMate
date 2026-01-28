import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const Bookings = ({ doctor }) => {
  // 🔥 future dates + formatted date (one function only)
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
                className="px-4 py-2 rounded-md text-sm font-semibold text-[#003367 bg-gray-200 hover:bg-[#7CAB33] hover:text-white transition-all duration-300"
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
      <div>
        <h3 className="text-xl font-bold text-[#003367] mb-4">
          Appointment Form
        </h3>
      </div>
    </div>
  );
};

export default Bookings;
