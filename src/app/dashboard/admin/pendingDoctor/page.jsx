"use client";

import { useEffect, useState } from "react";
import { Search, X, RefreshCw, ArrowUpDown, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import RoleGuard from "@/components/RoleGuard";

export default function DoctorApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [paginatedApplications, setPaginatedApplications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // "" = all
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor-applications");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setApplications(data.applications || []);
      setFilteredApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError(err.message || "Could not load doctor applications.");
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  useEffect(() => {
    if (applications.length > 0) {
      const categories = [
        ...new Set(
          applications.map((app) => app.doctorCategory || "Uncategorized"),
        ),
      ];
      setUniqueCategories(categories.sort());
    }
  }, [applications]);

  // Search + filter logic
  useEffect(() => {
    let result = [...applications];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((app) => {
        const name = (app.name || "").toLowerCase();
        const email = (app.email || "").toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    if (selectedCategory) {
      result = result.filter(
        (app) =>
          (app.doctorCategory || "Uncategorized").toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }

    setFilteredApplications(result);
  }, [applications, searchTerm, selectedCategory]);

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

  // approve or reject application
  const handleAction = (appId, action) => {
    const isApprove = action === "approve";
    const actionText = isApprove ? "Approve" : "Reject";
    const successText = isApprove ? "approved" : "rejected";
    const verbLower = actionText.toLowerCase();

    toast(
      (t) => (
        <div className="min-w-90 max-w-105 rounded-xl bg-white shadow-xl border border-gray-200/80 overflow-hidden">
          {/* Header / Message */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {actionText} Application
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              Are you sure you want to {verbLower} this doctor application? This
              action cannot be undone.
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
                  `${actionText}ing application…`,
                  { style: { borderRadius: "10px" } },
                );

                try {
                  const res = await fetch(`/api/doctor-applications/${appId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action }),
                  });

                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || `Failed to ${action}`);
                  }

                  toast.success(`Application ${successText} successfully`, {
                    id: loadingId,
                    duration: 2500,
                  });

                  fetchApplications();
                } catch (err) {
                  console.error("Action failed:", err);
                  toast.error(
                    err.message || `Failed to ${action} application`,
                    {
                      id: loadingId,
                      duration: 5000,
                    },
                  );
                }
              }}
              className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm ${
                isApprove
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-400"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-400"
              }`}
            >
              {actionText} Application
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

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">
          Loading applications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
        <button
          onClick={fetchApplications}
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
            Doctor Applications
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchApplications}
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
        {filteredApplications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm || selectedCategory
                ? "No applications match your search/filter criteria."
                : "No pending doctor applications at the moment."}
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
                      Applicant Info
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
                      CV
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedApplications.map((app, index) => (
                    <tr
                      key={app._id}
                      className="hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      <td className="px-4 py-5 sm:px-6 text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div
                            className="font-medium text-gray-900"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(app.name || "—"),
                            }}
                          />
                          <div className="text-sm text-gray-600 mt-0.5">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(app.email || "—"),
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.doctorCategory
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {app.doctorCategory || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-center">
                        {app.doctorCvUrl ? (
                          <a
                            href={app.doctorCvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                          >
                            <FileText size={16} />
                            View CV
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAction(app._id, "approve")}
                            className="btn btn-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(app._id, "reject")}
                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow"
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

            <Pagination
              data={filteredApplications}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedApplications}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
}
