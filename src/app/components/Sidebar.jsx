// src/components/dashboard/Sidebar.jsx
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
import ApplyDoctorModal from "./ApplyDoctorModal";
// import ApplyDoctorModal from "./ApplyDoctorModal";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { role } = session?.user || {};

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Auto-logout logic (যদি ডাক্তার approved হয়)
  useEffect(() => {
    if (role === "doctor" && session?.user?.appliedDoctor) {
      alert("Your application has been approved. Logging out...");
      signOut({ callbackUrl: "/" });
    }
  }, [role, session]);

  return (
    <>
      <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col h-screen border-r border-slate-700 fixed left-0 top-0 z-30">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold hover:text-blue-400 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Main Home
          </Link>
        </div>

        {/* User Info */}
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

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

          {role === "user" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-sm font-medium rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/50 hover:border-emerald-600 transition-colors"
            >
              <FaUserDoctor className="w-5 h-5 text-emerald-400" />
              Join as Doctor
            </button>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Modal – আলাদা component */}
      <ApplyDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={session}
      />
    </>
  );
}
