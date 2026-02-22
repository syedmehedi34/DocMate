// src/components/Sidebar.jsx   (or wherever your path is)
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
} from "@heroicons/react/24/outline";
import { FaUserDoctor } from "react-icons/fa6";
import { Menu, X } from "lucide-react";
import ApplyDoctorModal from "./ApplyDoctorModal"; // adjust path

export default function Sidebar({ onCollapseChange }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { role } = session?.user || {};

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mobile → start collapsed
  useEffect(() => {
    const checkMobile = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

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

  useEffect(() => {
    if (role === "doctor" && session?.user?.appliedDoctor) {
      alert("Your application has been approved. Logging out...");
      signOut({ callbackUrl: "/" });
    }
  }, [role, session, signOut]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <aside
        className={`
          bg-linear-to-b from-slate-800 to-slate-900 text-white
          flex flex-col h-screen border-r border-slate-700
          fixed left-0 top-0 z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between border-b border-slate-500 px-4">
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold hover:text-blue-400 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              DocMate
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex flex-col items-center border-b border-slate-700">
          <img
            src={session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"}
            className="w-10 h-10 rounded-full border-2 border-blue-400 mb-2"
            alt="Avatar"
          />
          {!isCollapsed && (
            <div className="text-center">
              <p className="font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-slate-400 uppercase">{role}</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuLinks[role]?.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-400"
                        : "hover:bg-slate-700/50 hover:border-l-4 hover:border-slate-600"
                    }
                  `}
                  title={isCollapsed ? link.name : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {link.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {role === "user" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className={`
                w-full flex items-center justify-center gap-3 px-4 py-3 mt-4 
                text-sm font-medium rounded-lg bg-emerald-600/20 
                hover:bg-emerald-600/30 border border-emerald-600/50 
                hover:border-emerald-600 transition-all duration-200
                ${isCollapsed ? "px-3" : ""}
              `}
              title={isCollapsed ? "Join as Doctor" : undefined}
            >
              <FaUserDoctor className="w-5 h-5 text-emerald-400" />
              {!isCollapsed && "Join as Doctor"}
            </button>
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`
              w-full flex items-center gap-3 px-3 py-3 text-sm font-medium 
              rounded-lg hover:bg-red-600/20 hover:text-red-400 
              transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? "Logout" : undefined}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <ApplyDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={session}
      />

      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
