// "use client";
// import { useEffect, useState } from "react";
// import RoleGuard from "../../../components/RoleGuard";

// export default function AdminHome() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "",
//     isPatient: false,
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("/api/users");
//       const data = await res.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await fetch(`/api/users/${id}`, { method: "DELETE" });
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isPatient: user.isPatient,
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     try {
//       const res = await fetch(`/api/users/${editingUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to update user");

//       setUsers(
//         users.map((u) =>
//           u._id === editingUser._id ? { ...u, ...formData } : u,
//         ),
//       );
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   return (
//     <RoleGuard allowedRoles={["admin"]}>
//       <div className="p-6 bg-gray-100 min-h-screen">
//         {/* <div className="bg-white p-6 shadow-md rounded-lg mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage users, update roles, and delete accounts.</p>
//         </div> */}

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Users List</h2>
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Email</th>
//                 <th className="border p-2">Role</th>
//                 <th className="border p-2">Is Patient?</th>
//                 <th className="border p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="text-center">
//                   <td className="border p-2">{user.name}</td>
//                   <td className="border p-2">{user.email}</td>
//                   <td className="border p-2">{user.role}</td>
//                   <td className="border p-2">
//                     {user.isPatient ? "Yes" : "No"}
//                   </td>
//                   <td className="border p-2">
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user._id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {editingUser && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <h3 className="text-xl font-semibold mb-4">Edit User</h3>
//               <form onSubmit={handleUpdate}>
//                 <div className="mb-2">
//                   <label className="block text-sm font-medium">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="block text-sm font-medium">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     className="w-full border p-2 rounded"
//                     disabled
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="block text-sm font-medium">Role</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   >
//                     <option value="user">User</option>
//                     <option value="doctor">Doctor</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium">
//                     Is Patient?
//                   </label>
//                   <input
//                     type="checkbox"
//                     name="isPatient"
//                     checked={formData.isPatient}
//                     onChange={handleChange}
//                     className="ml-2"
//                   />
//                 </div>
//                 <div className="flex justify-between">
//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white px-4 py-2 rounded"
//                   >
//                     Update
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setEditingUser(null)}
//                     className="bg-gray-400 text-white px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </RoleGuard>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import RoleGuard from "../../../components/RoleGuard";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
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
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
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
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setUsers(
        users.map((u) =>
          u._id === editingUser._id ? { ...u, ...formData } : u,
        ),
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
            All Users
          </h2>

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Avatar
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-teal-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-teal-100"
                              src={
                                user.image ||
                                "https://i.ibb.co/33gs5fP/user.png"
                              }
                              alt={user.name}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.isPatient ? (
                          <span className="text-green-600 font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-teal-600 hover:text-teal-900 mr-4 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No users found.
              </div>
            )}
          </div>

          {/* Edit Modal – kept same logic, slightly better styling */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-5">
                  Edit User
                </h3>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="user">User / Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPatient"
                      checked={formData.isPatient}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Mark as Patient
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
