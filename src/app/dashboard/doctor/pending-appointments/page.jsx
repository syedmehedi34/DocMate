"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, X, RefreshCw, Calendar, ArrowDownUp } from "lucide-react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";

const DoctorAppointmentsPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState("");
  const [uniqueDates, setUniqueDates] = useState([]);
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

    // Date filter
    if (sortDate) {
      result = result.filter((appt) => appt.appointmentDate === sortDate);
    }

    setFilteredAppointments(result);
  }, [searchTerm, sortDate, appointments]);

  // Unique dates for dropdown
  useEffect(() => {
    if (appointments.length > 0) {
      const dates = [
        ...new Set(appointments.map((appt) => appt.appointmentDate)),
      ];
      setUniqueDates(dates.filter(Boolean).sort());
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
      setFilteredAppointments(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load pending appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // approve or reject handler
  const handleDecision = (appointmentId, approved) => {
    const actionText = approved ? "Approve" : "Reject";
    const successText = approved ? "approved" : "rejected";

    toast(
      (t) => (
        <div className="min-w-90 max-w-105 rounded-xl bg-white shadow-xl border border-gray-200/80 overflow-hidden">
          {/* Header / Message area */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {actionText} Appointment
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              Are you sure you want to {actionText.toLowerCase()} this
              appointment? This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50/40">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const loadingId = toast.loading(
                  `${actionText}ing appointment…`,
                  { style: { borderRadius: "10px" } },
                );

                try {
                  const status = approved ? "confirmed" : "rejected";

                  const res = await fetch(
                    `/api/appointments/${appointmentId}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status }),
                    },
                  );

                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "Failed to update status");
                  }

                  toast.success(`Appointment ${successText} successfully`, {
                    id: loadingId,
                    duration: 2500,
                  });

                  // UI update
                  fetchPendingAppointments();
                } catch (err) {
                  console.error("Decision failed:", err);
                  toast.error(err.message || "Failed to update appointment", {
                    id: loadingId,
                    duration: 5000,
                  });
                }
              }}
              className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm ${
                approved
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-400"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-400"
              }`}
            >
              {actionText} Appointment
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        },
      },
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearSort = () => {
    setSortDate("");
  };

  // Highlight function
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
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
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
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort by Date Dropdown */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowDownUp className="h-4 w-4 text-gray-400" />
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
                      {/* Highlight Patient Name */}
                      <div
                        className="font-medium text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(appt.patientName || "—"),
                        }}
                      />
                      <div className="text-sm text-gray-500 mt-0.5">
                        {appt.patientGender || "—"} ({appt.patientAge || "?"}{" "}
                        Yrs)
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 py-5 sm:px-6">
                      <div className="text-sm text-gray-900">
                        {/* Highlight Email */}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightText(
                              appt.applicantEmail || appt.patientEmail || "—",
                            ),
                          }}
                        />
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
