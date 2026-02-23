"use client";
import RoleGuard from "@/app/components/RoleGuard";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#105852] text-lg font-medium">
        Loading patients and appointments...
      </div>
    );
  }

  const totalUsers = data.length;

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
                  {paginatedData.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-teal-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-12 w-12">
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

            {totalUsers === 0 && !loading && (
              <div className="py-12 text-center text-gray-500">
                No patients found.
              </div>
            )}

            {/* New Pagination Component */}
            {totalUsers > 0 && (
              <Pagination
                data={data}
                itemsPerPage={itemsPerPage}
                onPageDataChange={setPaginatedData}
              />
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserPage;
