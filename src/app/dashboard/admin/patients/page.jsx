"use client";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";

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

  // Simple search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(term) ||
        (p.email || "").toLowerCase().includes(term),
    );

    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  if (loading) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-3 text-teal-600">
            <RefreshCw className="animate-spin" size={20} />
            <span>Loading patients...</span>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchData} className="btn btn-outline btn-error">
              Retry
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">
                {filteredPatients.length} patient
                {filteredPatients.length !== 1 && "s"}
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

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-xl shadow border p-12 text-center text-gray-500">
              No patients found matching your search.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="w-12">#</th>
                      <th>Patient</th>
                      <th>Contact</th>
                      <th>Appointments</th>
                      <th className="w-32 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPatients.map((patient, idx) => {
                      const apptCount = patient.appointments?.length || 0;

                      return (
                        <tr key={patient._id} className="hover">
                          <td>{idx + 1}</td>

                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-10 rounded-full">
                                  <img
                                    src={
                                      patient.image ||
                                      "https://i.ibb.co/33gs5fP/user.png"
                                    }
                                    alt={patient.name || "Patient"}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {patient.name || "—"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {patient._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-500" />
                                {patient.email || "—"}
                              </div>
                              {patient.appointmentNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} className="text-gray-500" />
                                  {patient.appointmentNumber}
                                </div>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="badge badge-outline badge-info gap-1">
                              <Calendar size={14} />
                              {apptCount}
                            </div>
                          </td>

                          <td className="text-right">
                            <Link
                              href={`/dashboard/admin/patients/${patient._id}`}
                              className="btn btn-sm btn-outline btn-primary"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t bg-base-200/30">
                <Pagination
                  data={filteredPatients}
                  itemsPerPage={itemsPerPage}
                  onPageDataChange={setPaginatedPatients}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserPage;
