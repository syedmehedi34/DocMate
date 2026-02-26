"use client";
import { useEffect, useState } from "react";
import { Search, X, RefreshCw, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";
import Pagination from "@/components/Pagination";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // "" for all, or "admin", "doctor", "user"
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

  // fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message || "Could not load users list.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // sorting by role [optional]
  useEffect(() => {
    if (users.length > 0) {
      const roles = [...new Set(users.map((u) => u.role || "user"))];
      // Optional: sort by custom order
      const roleOrder = { admin: 1, doctor: 2, user: 3 };
      const sortedRoles = roles.sort(
        (a, b) => (roleOrder[a] ?? 999) - (roleOrder[b] ?? 999),
      );
      setUniqueRoles(sortedRoles);
    }
  }, [users]);

  // filter and search
  useEffect(() => {
    let result = [...users];

    // A. Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((user) => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    // B. Role filter (like date filter in DoctorAppointmentsPage)
    if (selectedRole) {
      result = result.filter(
        (u) => (u.role || "user").toLowerCase() === selectedRole.toLowerCase(),
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole]);

  const clearSearch = () => setSearchTerm("");
  const clearFilter = () => setSelectedRole("");

  //  highlightText on search
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

  //  delete function with confirmation toast
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="min-w-90 max-w-105 rounded-xl bg-white shadow-xl border border-gray-200/80 overflow-hidden">
          {/* Header / Message area */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            <p className="mt-1.5 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
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

                const loadingId = toast.loading("Deleting user…", {
                  style: { borderRadius: "10px" },
                });

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
                  console.error("Delete failed:", err);
                  toast.error(err.message || "Failed to delete user", {
                    id: loadingId,
                    duration: 5000,
                  });
                }
              }}
              className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors shadow-sm"
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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
      // filteredUsers will auto-update via useEffect
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
        {error}
        <button
          onClick={fetchUsers}
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
            All Users
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={fetchUsers}
              className="btn btn-outline btn-sm gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search + Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
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
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter by Role Dropdown */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white appearance-none"
            >
              <option value="">Filter by Role (All)</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            {selectedRole && (
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
        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <p className="text-lg">
              {searchTerm || selectedRole
                ? "No users match your search/filter criteria."
                : "No users found in the system."}
            </p>
            {(searchTerm || selectedRole) && (
              <p className="mt-2 text-sm">
                Try adjusting your search or{" "}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRole("");
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6"
                    >
                      Patient
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
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={user._id}
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
                              // need to change doctorImageUrl name later
                              user.doctorImageUrl ||
                              "https://i.ibb.co/33gs5fP/user.png"
                            }
                            alt={user.name || "User"}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <div
                          className="font-medium text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(user.name || "—"),
                          }}
                        />
                      </td>

                      <td className="hidden md:table-cell px-4 py-5 sm:px-6 text-sm text-gray-700">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightText(user.email || "—"),
                          }}
                        />
                      </td>

                      <td className="px-4 py-5 sm:px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "doctor"
                                ? "bg-teal-100 text-teal-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      <td className="hidden md:table-cell px-4 py-5 sm:px-6 text-sm text-gray-700">
                        {user.isPatient ? (
                          <span className="text-green-600 font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>

                      <td className="px-4 py-5 sm:px-6 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-all duration-150 shadow-sm hover:shadow"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm  bg-red-700 hover:bg-red-800 rounded-lg text-white transition-all duration-150 shadow-sm hover:shadow"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Added Pagination */}
            <Pagination
              data={filteredUsers}
              itemsPerPage={itemsPerPage}
              onPageDataChange={setPaginatedUsers}
            />
          </>
        )}

        {/* MODAL */}
        <dialog
          id="editing_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box max-w-lg bg-base-100 shadow-xl rounded-xl border border-base-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-base-content">Edit User</h3>
              <form method="dialog">
                {/* This X button closes the modal */}
                <button className="btn btn-ghost btn-sm btn-circle">
                  <X size={20} />
                </button>
              </form>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Role</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-3 select select-bordered w-full focus:select-primary"
                >
                  <option value="user">User / Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="isPatient"
                    checked={formData.isPatient}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text font-medium">
                    Mark as Patient
                  </span>
                </label>
              </div>

              <div className="modal-action mt-8 flex justify-end gap-3">
                {/* Cancel button – closes modal without saving */}
                <button
                  type="button"
                  className="btn btn-neutral px-6"
                  onClick={() => {
                    const modal = document.getElementById("editing_modal");
                    if (modal) modal.close();
                  }}
                >
                  Cancel
                </button>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary px-6">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Backdrop click closes modal */}
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </RoleGuard>
  );
}
