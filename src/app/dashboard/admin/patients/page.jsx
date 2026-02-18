// "use client";
// import RoleGuard from "@/app/components/RoleGuard";
// import { useEffect, useState } from "react";

// const UserPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchUsersAndAppointments();
//   }, []);

//   const fetchUsersAndAppointments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/admin-users-and-appointment");
//       const result = await response.json();
//       setData(result);
//     } catch (error) {
//       console.error("Error fetching users and appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalUsers = data.length;
//   const totalPages = Math.ceil(totalUsers / itemsPerPage);
//   const currentUsers = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
//   const handlePrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
//   const handlePageClick = pageNumber => setCurrentPage(pageNumber);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-[#105852]">
//         Loading users and appointments...
//       </div>
//     );
//   }

//   return (
//     <RoleGuard allowedRoles={["admin"]}>
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-2xl md:text-4xl text-center font-bold mb-8 text-[#105852]">
//         All Patients
//       </h2>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-[#e0f2f1]">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-[#105852]">#</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-[#105852]">Patient</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-[#105852]">Contact</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-[#105852] w-1/3">Appointments</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#e0f2f1]">
//             {currentUsers.map((user, index) => (
//               <tr key={user._id} className="hover:bg-[#f5fbfa] transition-colors">
//                 <td className="px-6 py-4 text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-12 w-12">
//                       <img
//                         className="rounded-full border-2 border-[#66c0b8] p-0.5"
//                         src={user.image || "https://i.ibb.co/33gs5fP/user.png"}
//                         alt="User avatar"
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="text-sm text-gray-900">{user.email}</div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="space-y-3">
//                     {user.appointments.length > 0 ? (
//                       user.appointments.map((appointment, idx) => (
//                         <div
//                           key={idx}
//                           className="p-3 bg-white rounded-lg border border-[#e0f2f1] shadow-sm"
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-[#105852]">
//                               {appointment.doctorName}
//                             </span>
//                             <span className={`px-2 py-1 text-xs rounded-full ${
//                               appointment.isAppointed
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}>
//                               {appointment.isAppointed ? "Confirmed" : "Pending"}
//                             </span>
//                           </div>
//                           <div className="mt-1 text-sm text-gray-600">
//                             <span className="block">{appointment.date}</span>
//                             <span className="block">{appointment.time}</span>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500 italic">No appointments found</div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-[#e0f2f1]">
//           <div className="mb-4 md:mb-0 text-sm text-gray-600">
//             Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
//             {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                 currentPage === 1
//                   ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                   : 'text-[#105852] hover:bg-[#e0f2f1]'
//               }`}
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageClick(i + 1)}
//                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                   currentPage === i + 1
//                     ? 'bg-[#105852] text-white'
//                     : 'text-gray-600 hover:bg-[#e0f2f1]'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                 currentPage === totalPages
//                   ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                   : 'text-[#105852] hover:bg-[#e0f2f1]'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </RoleGuard>
//   );
// };

// export default UserPage;
"use client";
import RoleGuard from "@/app/components/RoleGuard";
import { useEffect, useState } from "react";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsersAndAppointments();
  }, []);

  const fetchUsersAndAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin-users-and-appointment");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching users and appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = data.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const currentUsers = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#105852] text-lg font-medium">
        Loading patients and appointments...
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
            All Patients
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
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider"
                    >
                      Appointments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-teal-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
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
                              alt={user.name || "Patient"}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-3 max-w-2xl">
                          {user.appointments?.length > 0 ? (
                            user.appointments.map((appointment, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm hover:shadow transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-teal-800">
                                    {appointment.doctorName || "Unknown Doctor"}
                                  </span>
                                  <span
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                      appointment.isAppointed
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    }`}
                                  >
                                    {appointment.isAppointed
                                      ? "Confirmed"
                                      : "Pending"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-0.5">
                                  <div>{appointment.date}</div>
                                  <div>{appointment.time}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 italic py-2">
                              No appointments found
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentUsers.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-500">
                No patients found.
              </div>
            )}

            {/* Pagination – matched exactly with previous pages */}
            {totalUsers > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="mb-4 md:mb-0 text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalUsers)} of{" "}
                  {totalUsers} patients
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-teal-700 hover:bg-teal-50"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#105852] text-white"
                          : "text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-teal-700 hover:bg-teal-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserPage;
