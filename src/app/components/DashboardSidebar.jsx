"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  HeartIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { FaUserDoctor } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

export default function DashboardSidebar() {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const { role, appliedDoctor } = session?.user || {};

  // Auto-logout when doctor approval happens
  useEffect(() => {
    if (role === "doctor" && appliedDoctor) {
      alert("Your application has been approved. Logging out...");

      fetch("/api/logout", { method: "POST" })
        .then(() => {
          signOut({ callbackUrl: "/" });
        })
        .finally(() => {
          update();
        });
    }
  }, [role, appliedDoctor, update, signOut]);

  //? Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    cvUrl: "",
    imageUrl: "",
    category: "",
    chamberDays: [], // array of selected days
    chamberOpeningTime: "", // e.g. "09:00"
    chamberClosingTime: "", // e.g. "17:00"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const menuLinks = {
    admin: [
      { name: "Dashboard", href: "/dashboard/admin/home", icon: HomeIcon },
      { name: "Profile", href: "/dashboard/admin/profile", icon: UserIcon },
      {
        name: "All Users",
        href: "/dashboard/admin/users",
        icon: UserGroupIcon,
      },
      {
        name: "All Doctors",
        href: "/dashboard/admin/doctors",
        icon: UserGroupIcon,
      },
      {
        name: "All Patients",
        href: "/dashboard/admin/patients",
        icon: UserGroupIcon,
      },
      {
        name: "Pending Doctors",
        href: "/dashboard/admin/pendingDoctor",
        icon: DocumentTextIcon,
      },
    ],
    doctor: [
      { name: "Dashboard", href: "/dashboard/doctor/home", icon: HomeIcon },
      { name: "Profile", href: "/dashboard/doctor/profile", icon: UserIcon },
      {
        name: "Patients",
        href: "/dashboard/doctor/patients",
        icon: UserGroupIcon,
      },
      {
        name: "Pending Appointments",
        href: "/dashboard/doctor/appointments",
        icon: CalendarIcon,
      },
    ],
    user: [
      { name: "Dashboard", href: "/dashboard/user/home", icon: HomeIcon },
      { name: "Profile", href: "/dashboard/user/profile", icon: UserIcon },
      { name: "Doctors", href: "/dashboard/user/doctors", icon: HeartIcon },
      {
        name: "Appointments",
        href: "/dashboard/user/allAppointment",
        icon: CalendarIcon,
      },
    ],
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      cvUrl: "",
      imageUrl: "",
      category: "",
      chamberDays: [],
      chamberOpeningTime: "",
      chamberClosingTime: "",
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        if (checked) {
          return { ...prev, chamberDays: [...prev.chamberDays, value] };
        } else {
          return {
            ...prev,
            chamberDays: prev.chamberDays.filter((day) => day !== value),
          };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Doctor Application Data:", formData);

    try {
      const res = await fetch("/api/apply-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, appliedDoctor: true }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.message || "Application failed. Please try again.",
        );
      }

      alert("Application submitted successfully!");
      handleCloseModal();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col h-auto border-r border-slate-700">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold hover:text-blue-400 transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          Main Home
        </Link>
      </div>

      {/* User Profile Preview */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-700">
        <img
          src={session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"}
          className="w-10 h-10 rounded-full border-2 border-blue-400"
          alt="User avatar"
        />
        <div>
          <p className="font-medium truncate">{session?.user?.name}</p>
          <p className="text-sm text-slate-400 uppercase">{role}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuLinks[role]?.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-400"
                    : "hover:bg-slate-700/50 hover:border-l-4 hover:border-slate-600"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`}
                />
                <span className="text-sm font-medium">{link.name}</span>
              </div>
            </Link>
          );
        })}

        {/* Apply as Doctor Button */}
        {role === "user" && (
          <button
            onClick={handleOpenModal}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-sm font-medium rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/50 hover:border-emerald-600 transition-colors"
          >
            <FaUserDoctor className="w-5 h-5 text-emerald-400" />
            Join as Doctor
          </button>
        )}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Application Modal */}
      <div
        className={`fixed inset-0 z-50  ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isModalOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseModal}
        />

        {/* Modal content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`
              relative bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto
              transition-all duration-300 ease-out transform
              ${
                isModalOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-12 pointer-events-none"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FaUserDoctor className="w-6 h-6 text-blue-700" />
                  Doctor's Joining Form
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center mb-6 gap-2">
                <IoWarning className="w-5 h-5 text-warning" />
                <p className="text-[#212121] text-sm">
                  Your profile will be reviewed against our doctors' list for
                  approval.
                </p>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Name */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input input-bordered w-full text-black"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={session?.user?.email || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full text-black"
                      required
                    />
                  </div>
                </div>

                {/* CV URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CV URL
                  </label>
                  <input
                    type="url"
                    name="cvUrl"
                    value={formData.cvUrl}
                    onChange={handleChange}
                    className="input input-bordered w-full text-black"
                    required
                  />
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input input-bordered w-full text-black"
                    required
                  />
                </div>

                {/* Specialty */}
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered w-full text-black"
                    required
                  >
                    <option value="">Select specialty</option>
                    <option value="general">General Practitioner</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>

                {/* Chamber Days - Weekly Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chamber Days (select all applicable)
                  </label>
                  <div className="text-black grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {[
                      "Saturday",
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ].map((day) => (
                      <label
                        key={day}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="chamberDays"
                          value={day}
                          checked={formData.chamberDays.includes(day)}
                          onChange={handleChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chamber Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      name="chamberOpeningTime"
                      value={formData.chamberOpeningTime}
                      onChange={handleChange}
                      className="input input-bordered w-full text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      name="chamberClosingTime"
                      value={formData.chamberClosingTime}
                      onChange={handleChange}
                      className="input input-bordered w-full text-black"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error text-sm mt-4">{error}</div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-outline text-[#212121]"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Applying...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
