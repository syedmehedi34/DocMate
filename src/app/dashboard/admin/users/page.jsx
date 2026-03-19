"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  ArrowUpDown,
  Users,
  Edit2,
  Trash2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";
import Pagination from "@/components/Pagination";

/* ── shared input style ── */
const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl " +
  "outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 " +
  "transition-all duration-200 text-gray-800 placeholder-gray-400";

/* ── role badge ── */
const RoleBadge = ({ role }) => {
  const cfg = {
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    doctor: "bg-green-50  text-green-700  border-green-200",
    user: "bg-gray-100  text-gray-600   border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                      text-[0.65rem] font-bold border capitalize ${cfg[role] || cfg.user}`}
    >
      {role === "admin" && <ShieldCheck size={10} />}
      {role || "user"}
    </span>
  );
};

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

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isPatient: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      setError(err.message || "Could not load users list.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      const roles = [...new Set(users.map((u) => u.role || "user"))];
      const roleOrder = { admin: 1, doctor: 2, user: 3 };
      setUniqueRoles(
        roles.sort((a, b) => (roleOrder[a] ?? 999) - (roleOrder[b] ?? 999)),
      );
    }
  }, [users]);

  useEffect(() => {
    let result = [...users];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term),
      );
    }
    if (selectedRole)
      result = result.filter(
        (u) => (u.role || "user").toLowerCase() === selectedRole.toLowerCase(),
      );
    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedRole("");

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

  /* ── delete ── */
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="min-w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Delete User?</h3>
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
                const loadingId = toast.loading("Deleting user…");
                try {
                  const res = await fetch(`/api/users/${id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || "Delete failed");
                  }
                  setUsers((prev) => prev.filter((u) => u._id !== id));
                  toast.success("User deleted successfully", {
                    id: loadingId,
                    duration: 2000,
                  });
                } catch (err) {
                  toast.error(err.message || "Failed to delete user", {
                    id: loadingId,
                    duration: 5000,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700"
            >
              Delete User
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

  /* ── edit ── */
  const handleEdit = (user) => {
    document.getElementById("editing_modal").showModal();
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      isPatient: user.isPatient || false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e) => {
    document.getElementById("editing_modal").close();
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = { ...editingUser, ...formData };
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? updated : u)),
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  /* ── guards ── */
  if (loading)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading users...</p>
        </div>
      </RoleGuard>
    );

  if (error)
    return (
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchUsers}
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
            <h1 className="text-2xl font-black text-gray-900">All Users</h1>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              user{filteredUsers.length !== 1 ? "s" : ""} found
              {selectedRole && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-green-700 font-semibold capitalize">
                    {selectedRole}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchUsers}
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
          <div className="relative sm:w-52">
            <ArrowUpDown
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                         outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            {selectedRole && (
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
        {filteredUsers.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white
                          rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-[#f8faf9] border border-gray-100
                            flex items-center justify-center mb-3"
            >
              <Users size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {searchTerm || selectedRole
                ? "No users match your filters."
                : "No users found."}
            </p>
            {(searchTerm || selectedRole) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("");
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
                        { label: "User", cls: "" },
                        { label: "Email", cls: "hidden md:table-cell" },
                        { label: "Role", cls: "" },
                        { label: "Patient", cls: "hidden md:table-cell" },
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
                    {paginatedUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-[#f8faf9] transition-colors duration-150"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-semibold text-gray-400">
                          {index + 1}
                        </td>

                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.doctorImageUrl ? (
                              <img
                                src={user.doctorImageUrl}
                                alt={user.name}
                                className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0"
                              />
                            ) : (
                              <div
                                className={`flex items-center justify-center w-9 h-9 rounded-xl
                                              text-xs font-bold shrink-0 ${avatarColor(user.name || "")}`}
                              >
                                {initials(user.name || "")}
                              </div>
                            )}
                            <div>
                              <p
                                className="text-sm font-bold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(user.name || "—"),
                                }}
                              />
                              <p className="text-xs text-gray-400 md:hidden mt-0.5">
                                {user.email || "—"}
                              </p>
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
                                __html: highlightText(user.email || "—"),
                              }}
                            />
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* Patient */}
                        <td className="hidden md:table-cell px-5 py-4">
                          {user.isPatient ? (
                            <span
                              className="inline-flex items-center gap-1 text-[0.65rem] font-bold
                                             bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full"
                            >
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="flex items-center gap-1.5 text-xs font-bold text-white
                                         bg-green-700 hover:bg-green-800 px-3 py-2 rounded-xl
                                         transition-colors duration-200 shadow-sm"
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-red-600
                                         bg-red-50 hover:bg-red-100 border border-red-200
                                         px-3 py-2 rounded-xl transition-colors duration-200"
                            >
                              <Trash2 size={12} /> Delete
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
              data={filteredUsers}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedUsers}
            />
          </>
        )}

        {/* ════════════════════════════════════
            EDIT MODAL
        ════════════════════════════════════ */}
        <dialog
          id="editing_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box max-w-md w-11/12 p-0 rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-100">
                  <Edit2 size={16} className="text-green-700" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold">
                    Admin
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">
                    Edit User
                  </p>
                </div>
              </div>
              <form method="dialog">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg
                                   bg-[#f8faf9] border border-gray-200 text-gray-400
                                   hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X size={15} />
                </button>
              </form>
            </div>

            {/* Modal body */}
            <div className="p-6 bg-[#f8faf9]">
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className={inputCls}
                  />
                </div>

                {/* Email (disabled) */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className={`${inputCls} opacity-50 cursor-not-allowed`}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    <option value="user">User / Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Is Patient checkbox */}
                <label
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl
                                   px-4 py-3 cursor-pointer hover:border-green-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    name="isPatient"
                    checked={formData.isPatient}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Mark as Patient
                    </p>
                    <p className="text-xs text-gray-400">
                      This user has a patient record
                    </p>
                  </div>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("editing_modal")?.close()
                    }
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white
                               border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-sm font-bold text-white bg-green-700
                               hover:bg-green-800 rounded-xl transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </RoleGuard>
  );
}
