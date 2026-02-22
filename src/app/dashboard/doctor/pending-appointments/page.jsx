"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleGuard from "@/app/components/RoleGuard";
import { Search, X, RefreshCw, Calendar } from "lucide-react";

const DoctorAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState(""); // selected date for sorting
  const [uniqueDates, setUniqueDates] = useState([]); // dropdown-এর জন্য dates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingAppointments();
    }
  }, [session]);

  // Real-time filter & sort
  useEffect(() => {
    let result = [...appointments];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((appt) => {
        const name = (appt.patientName || "").toLowerCase();
        const email = (
          appt.applicantEmail ||
          appt.patientEmail ||
          ""
        ).toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    // Date sort filter
    if (sortDate) {
      result = result.filter((appt) => appt.appointmentDate === sortDate);
    }

    setFilteredAppointments(result);
  }, [searchTerm, sortDate, appointments]);

  // Unique dates extract করা (dropdown-এর জন্য)
  useEffect(() => {
    if (appointments.length > 0) {
      const dates = [
        ...new Set(appointments.map((appt) => appt.appointmentDate)),
      ];
      setUniqueDates(dates.filter(Boolean).sort()); // sort করে রাখা
    }
  }, [appointments]);

  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorId = session?.user?.id;
      if (!doctorId) throw new Error("Doctor ID not found in session");

      const res = await fetch(
        `/api/appointments/pending-appointments?doctorId=${doctorId}`,
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load pending appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (appointmentId, approved) => {
    try {
      const status = approved ? "confirmed" : "rejected";

      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(
          `Appointment ${approved ? "approved" : "rejected"} successfully.`,
        );
        fetchPendingAppointments();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Decision error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearSort = () => {
    setSortDate("");
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">
          Loading appointments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
        <button
          onClick={fetchPendingAppointments}
          className="ml-4 btn btn-sm btn-outline btn-error"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["doctor"]}>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Pending Appointment Requests
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredAppointments.length} pending
            </span>

            <button
              onClick={fetchPendingAppointments}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search + Sort Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
            />

            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Sort by Date Dropdown */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
            >
              <option value="">Sort by Date (All)</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>

            {sortDate && (
              <button
                onClick={clearSort}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm || sortDate
                ? "No appointments match your search/sort criteria."
                : "No pending appointment requests at the moment."}
            </p>
            {(searchTerm || sortDate) && (
              <p className="mt-2 text-sm">
                Try adjusting your search or{" "}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortDate("");
                  }}
                  className="text-blue-600 hover:underline"
                >
                  clear filters
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm ring-1 ring-black/5 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAppointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-blue-50/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-5 sm:px-6">
                      <div className="font-medium text-gray-900">
                        {appt.patientName || "—"}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {appt.patientGender || "—"} ({appt.patientAge || "?"}{" "}
                        Yrs)
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 py-5 sm:px-6">
                      <div className="text-sm text-gray-900">
                        {appt.applicantEmail || appt.patientEmail || "—"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appt.patientPhone || "—"}
                      </div>
                    </td>

                    <td className="hidden lg:table-cell px-4 py-5 sm:px-6 whitespace-nowrap text-sm text-gray-700">
                      {appt.appointmentDate || "—"}
                    </td>

                    <td className="px-4 py-5 sm:px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>

                    <td className="px-4 py-5 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDecision(appt._id, true)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleDecision(appt._id, false)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorAppointmentsPage;
