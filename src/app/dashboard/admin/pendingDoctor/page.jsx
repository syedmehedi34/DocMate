"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowUpDown,
  FileText,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Mail,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import RoleGuard from "@/components/RoleGuard";

/* ── avatar initials ── */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
const avatarColor = (name = "") => {
  const colors = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

export default function DoctorApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [paginatedApplications, setPaginatedApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
        const e = await res.json();
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setApplications(data.applications || []);
      setFilteredApplications(data.applications || []);
    } catch (err) {
      setError(err.message || "Could not load doctor applications.");
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applications.length > 0) {
      const cats = [
        ...new Set(
          applications.map((a) => a.doctorCategory || "Uncategorized"),
        ),
      ];
      setUniqueCategories(cats.sort());
    }
  }, [applications]);

  useEffect(() => {
    let result = [...applications];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(term) ||
          (a.email || "").toLowerCase().includes(term),
      );
    }
    if (selectedCategory) {
      result = result.filter(
        (a) =>
          (a.doctorCategory || "Uncategorized").toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }
    setFilteredApplications(result);
  }, [applications, searchTerm, selectedCategory]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedCategory("");

  const highlightText = (text = "") => {
    if (!searchTerm.trim() || !text) return text;
    return text.replace(
      new RegExp(
        `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi",
      ),
      '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>',
    );
  };

  const handleAction = (appId, action) => {
    const isApprove = action === "approve";
    const actionText = isApprove ? "Approve" : "Reject";
    const successText = isApprove ? "approved" : "rejected";

    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              {actionText} Application?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3 bg-[#f8faf9]">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading(
                  `${actionText}ing application…`,
                );
                try {
                  const res = await fetch(`/api/doctor-applications/${appId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action }),
                  });
                  if (!res.ok) {
                    const e = await res.json().catch(() => ({}));
                    throw new Error(e.error || `Failed to ${action}`);
                  }
                  toast.success(`Application ${successText} successfully`, {
                    id: loadingId,
                    duration: 2500,
                  });
                  fetchApplications();
                } catch (err) {
                  toast.error(
                    err.message || `Failed to ${action} application`,
                    { id: loadingId, duration: 5000 },
                  );
                }
              }}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors
                ${isApprove ? "bg-green-700 hover:bg-green-800" : "bg-red-600 hover:bg-red-700"}`}
            >
              {actionText}
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

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading applications...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                     bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </RoleGuard>
    );

  /* ─────────────── RENDER ─────────────── */
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-green-600 rounded-full" />
              <p className="text-green-700 text-xs font-semibold tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Doctor Applications
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-700">
                {filteredApplications.length}
              </span>{" "}
              pending application{filteredApplications.length !== 1 ? "s" : ""}
              {selectedCategory && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-green-700 font-semibold">
                    {selectedCategory}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchApplications}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                       bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#f8faf9]
                       hover:border-green-200 transition-all duration-200"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Search + filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-800 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative sm:w-56">
            <ArrowUpDown
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <button
                onClick={clearFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Empty state ── */}
        {filteredApplications.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <Stethoscope size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm || selectedCategory
                ? "No applications match your filters."
                : "No pending applications right now."}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-3 text-xs text-green-700 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f8faf9]">
                      {[
                        { label: "#", cls: "w-12" },
                        { label: "Applicant", cls: "" },
                        { label: "Email", cls: "hidden md:table-cell" },
                        { label: "Category", cls: "" },
                        { label: "CV", cls: "hidden sm:table-cell" },
                        { label: "Actions", cls: "" },
                      ].map(({ label, cls }) => (
                        <th
                          key={label}
                          className={`px-5 py-3.5 text-left text-[0.62rem] font-bold
                                       text-gray-400 uppercase tracking-widest ${cls}`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedApplications.map((app, index) => (
                      <tr
                        key={app._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-semibold text-gray-400">
                          {index + 1}
                        </td>

                        {/* Applicant */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-xl
                                            text-xs font-bold shrink-0 ${avatarColor(app.name || "")}`}
                            >
                              {initials(app.name || "")}
                            </div>
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(app.name || "—"),
                                }}
                              />
                              {/* email shown on mobile below name */}
                              <div className="flex items-center gap-1 text-xs text-gray-400 md:hidden mt-0.5">
                                <Mail size={11} className="text-green-500" />
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(app.email || "—"),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="hidden md:table-cell px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Mail
                              size={12}
                              className="text-green-500 shrink-0"
                            />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(app.email || "—"),
                              }}
                            />
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span
                            className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full border capitalize
                            ${
                              app.doctorCategory
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-400 border-gray-200"
                            }`}
                          >
                            {app.doctorCategory || "Uncategorized"}
                          </span>
                        </td>

                        {/* CV */}
                        <td className="hidden sm:table-cell px-5 py-4">
                          {app.doctorCvUrl ? (
                            <a
                              href={app.doctorCvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold
                                         text-green-700 bg-green-50 hover:bg-green-100 border border-green-200
                                         px-3 py-1.5 rounded-xl transition-colors duration-200"
                            >
                              <FileText size={12} /> View CV{" "}
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-300">No CV</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAction(app._id, "approve")}
                              className="flex items-center gap-1.5 text-xs font-bold text-white
                                         bg-green-700 hover:bg-green-800 px-3 py-2 rounded-xl
                                         transition-colors duration-200 shadow-sm"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleAction(app._id, "reject")}
                              className="flex items-center gap-1.5 text-xs font-bold text-red-600
                                         bg-red-50 hover:bg-red-100 border border-red-200
                                         px-3 py-2 rounded-xl transition-colors duration-200"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
