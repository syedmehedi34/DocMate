"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, X, RefreshCw } from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

const DoctorPatientsPage = () => {
  const { data: session } = useSession();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id && session.user.role === "doctor") {
      fetchDoctorPatients();
    }
  }, [session]);

  // Real-time search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const filtered = patients.filter((patient) => {
      const name = (
        patient.patientName ||
        patient.applicantName ||
        patient.name ||
        ""
      ).toLowerCase();
      const email = (
        patient.applicantEmail ||
        patient.email ||
        ""
      ).toLowerCase();

      return name.includes(term) || email.includes(term);
    });

    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchDoctorPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/patients");

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setPatients(data || []);
      setFilteredPatients(data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
      setError(err.message || "Could not load patient list.");
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
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
        <div className="animate-pulse text-gray-500">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
        <button
          onClick={fetchDoctorPatients}
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
            My Patients
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={fetchDoctorPatients}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative max-w-md text-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
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

        {/* Content */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm
                ? "No patients match your search."
                : "No patients have confirmed or completed appointments with you yet."}
            </p>
            {searchTerm && (
              <p className="mt-2 text-sm">
                Try a different name or email, or{" "}
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:underline"
                >
                  clear search
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
                    #
                  </th>
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Age / Gender
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Reason / Disease
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Last Visit
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                  >
                    Visits
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-blue-50/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-5 sm:px-6 text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-4 py-5 sm:px-6">
                      {/* Highlight Patient Name */}
                      <div
                        className="font-medium text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(
                            patient.patientName || patient.applicantName || "—",
                          ),
                        }}
                      />
                      <div className="text-sm text-gray-500 mt-0.5">
                        ID: {patient.applicantUserId?.slice(-8) || "—"}
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 py-5 sm:px-6 text-sm text-gray-700">
                      {/* Highlight Email */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(
                            patient.applicantEmail || patient.email || "—",
                          ),
                        }}
                      />
                    </td>

                    <td className="hidden md:table-cell px-4 py-5 sm:px-6 text-sm text-gray-700">
                      {patient.patientPhone || "N/A"}
                    </td>

                    <td className="px-4 py-5 sm:px-6 text-sm text-gray-700">
                      {patient.patientAge ? `${patient.patientAge} yrs` : "—"} •{" "}
                      {patient.patientGender || "—"}
                    </td>

                    <td className="hidden lg:table-cell px-4 py-5 sm:px-6 text-sm text-gray-700 max-w-xs">
                      <div className="line-clamp-2">
                        {patient.diseaseDetails || "—"}
                      </div>
                    </td>

                    <td className="hidden lg:table-cell px-4 py-5 sm:px-6 whitespace-nowrap text-sm text-gray-700">
                      {patient.lastAppointmentDate || "—"}
                    </td>

                    <td className="px-4 py-5 sm:px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {patient.appointmentCount || 1}
                      </span>
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

export default DoctorPatientsPage;
