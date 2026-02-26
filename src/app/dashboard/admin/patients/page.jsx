"use client";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowDownRight,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";

const UserPage = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [paginatedPatients, setPaginatedPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-users-and-appointment");
      if (!res.ok) throw new Error("Failed to load patients");
      const data = await res.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      console.error(err);
      setError("Could not load patient list.");
    } finally {
      setLoading(false);
    }
  };

  // Search + highlight logic
  useEffect(() => {
    let result = [...patients];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        const phone = (p.appointmentNumber || "").toLowerCase();
        return (
          name.includes(term) || email.includes(term) || phone.includes(term)
        );
      });
    }

    setFilteredPatients(result);
  }, [patients, searchTerm]);

  // Highlight matching text
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

  const clearSearch = () => setSearchTerm("");

  if (loading) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="p-6 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">Loading patients...</div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
          <button
            onClick={fetchData}
            className="ml-4 btn btn-sm btn-outline btn-error"
          >
            Retry
          </button>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Patients
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchData}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar (no filter here) */}
        <div className="mb-6 text-sm">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
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
        </div>

        {/* Table / Empty state */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm
                ? "No patients match your search."
                : "No patients found in the system."}
            </p>
            {searchTerm && (
              <p className="mt-2 text-sm">
                Try adjusting your search or{" "}
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
          <>
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
                      Avatar
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Patient Info
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Appointments
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedPatients.map((patient, index) => {
                    const apptCount = patient.appointments?.length || 0;

                    return (
                      <tr
                        key={patient._id}
                        className="hover:bg-blue-50/40 transition-colors duration-150"
                      >
                        <td className="px-4 py-5 sm:px-6 text-gray-700">
                          {index + 1}
                        </td>

                        <td className="px-4 py-5 sm:px-6">
                          <div className="h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                              src={
                                patient.image ||
                                "https://i.ibb.co/33gs5fP/user.png"
                              }
                              alt={patient.name || "Patient"}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-5 sm:px-6">
                          <div className="flex flex-col">
                            <div
                              className="font-medium text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: highlightText(patient.name || "—"),
                              }}
                            />
                            <div className="text-sm text-gray-600 mt-0.5">
                              ID: {patient._id.slice(-8)}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5 sm:px-6 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-500" />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(patient.email || "—"),
                                }}
                              />
                            </div>
                            {patient.appointmentNumber && (
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-500" />
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(
                                      patient.appointmentNumber,
                                    ),
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-5 sm:px-6">
                          <div className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1 items-center">
                            <Calendar size={14} />
                            {apptCount}
                          </div>
                        </td>

                        <td className="px-4 py-5 sm:px-6 text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/admin/patients/${patient._id}`}
                          >
                            <button className="btn btn-sm bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-all duration-150 shadow-sm hover:shadow">
                              Details
                              <ArrowDownRight
                                size={17}
                                className="-rotate-90"
                              />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              data={filteredPatients}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedPatients}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
};

export default UserPage;
