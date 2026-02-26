"use client";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowUpDown,
  ArrowDownRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination"; // adjust path if needed
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [paginatedDoctors, setPaginatedDoctors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // "" = all
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const doctorData = data.filter((user) => user.role === "doctor");
      setDoctors(doctorData);
      setFilteredDoctors(doctorData);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setError(err.message || "Could not load doctors list.");
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract & sort unique categories
  useEffect(() => {
    if (doctors.length > 0) {
      const categories = [
        ...new Set(doctors.map((d) => d.doctorCategory || "Uncategorized")),
      ];
      setUniqueCategories(categories.sort());
    }
  }, [doctors]);

  // Search + filter logic
  useEffect(() => {
    let result = [...doctors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((doc) => {
        const name = (doc.name || "").toLowerCase();
        const email = (doc.email || "").toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    if (selectedCategory) {
      result = result.filter(
        (doc) =>
          (doc.doctorCategory || "Uncategorized").toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }

    setFilteredDoctors(result);
  }, [doctors, searchTerm, selectedCategory]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedCategory("");

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

  const handleViewDetails = (doctor) => {
    console.log("Viewing details for doctor:", doctor);
    // Future: open modal, navigate to /doctors/[id], show full profile, etc.
    // toast.success(`Opening details for ${doctor.name}`);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
        <button
          onClick={fetchDoctors}
          className="ml-4 btn btn-sm btn-outline btn-error"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Doctors
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchDoctors}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
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

          {/* Filter by Category */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white appearance-none"
            >
              <option value="">Filter by Category (All)</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <button
                onClick={clearFilter}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Table / Empty state */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm || selectedCategory
                ? "No doctors match your search/filter criteria."
                : "No doctors found in the system."}
            </p>
            {(searchTerm || selectedCategory) && (
              <p className="mt-2 text-sm">
                Try adjusting your search or{" "}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                  className="text-blue-600 hover:underline"
                >
                  clear filters
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
                      Doctor Info
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Category
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
                  {paginatedDoctors.map((doctor, index) => (
                    <tr
                      key={doctor._id}
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
                              doctor.doctorImageUrl ||
                              "https://i.ibb.co/33gs5fP/user.png"
                            }
                            alt={doctor.name || "Doctor"}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div
                            className="font-medium text-gray-900"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(doctor.name || "—"),
                            }}
                          />
                          <div className="text-sm text-gray-600 mt-0.5">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(doctor.email || "—"),
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.doctorCategory
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {doctor.doctorCategory || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.currentStatus === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {doctor.currentStatus
                            ? doctor.currentStatus.charAt(0).toUpperCase() +
                              doctor.currentStatus.slice(1)
                            : "Unknown"}
                        </span>
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-right text-sm font-medium">
                        <Link href={`/dashboard/admin/doctors/${doctor._id}`}>
                          <button
                            onClick={() => handleViewDetails(doctor)}
                            className="btn btn-sm bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-all duration-150 shadow-sm hover:shadow"
                          >
                            Details
                            <ArrowDownRight size={17} className="-rotate-90" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              data={filteredDoctors}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedDoctors}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
};

export default DoctorPage;
