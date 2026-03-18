// src/components/Sidebar.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  HeartIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { FaUserDoctor } from "react-icons/fa6";
import { Menu, X, Stethoscope } from "lucide-react";
import ApplyDoctorModal from "../../components/ApplyDoctorModal";

export default function Sidebar({ onCollapseChange }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { role } = session?.user || {};

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsCollapsed(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const menuLinks = {
    admin: [
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
      { name: "Profile", href: "/dashboard/doctor/profile", icon: UserIcon },
      {
        name: "Patients",
        href: "/dashboard/doctor/patients",
        icon: UserGroupIcon,
      },
      {
        name: "Pending Appointments",
        href: "/dashboard/doctor/pending-appointments",
        icon: CalendarIcon,
      },
    ],
    user: [
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

  const roleBadgeColor = {
    admin: "bg-purple-500/20 text-purple-200 border-purple-500/30",
    doctor: "bg-blue-500/20   text-blue-200   border-blue-500/30",
    user: "bg-green-500/20  text-green-200  border-green-500/30",
  };

  return (
    <>
      <aside
        className={`
          flex flex-col h-screen
          fixed left-0 top-0 z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
        `}
        style={{
          background:
            "linear-gradient(180deg, #0d2b1f 0%, #122d20 60%, #0f2419 100%)",
        }}
      >
        {/* subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* ── Logo ── */}
        <div
          className={`relative z-10 h-16 flex items-center shrink-0
                         border-b border-white/8
                         ${isCollapsed ? "justify-center px-3" : "justify-between px-4"}`}
        >
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl
                              bg-green-500/20 border border-green-400/30"
              >
                <Stethoscope size={15} color="#4ade80" strokeWidth={2.2} />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Doc<span className="text-green-400">Mate</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-white/50 hover:text-white
                       hover:bg-white/8 transition-colors duration-200"
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* ── User info ── */}
        <div
          className={`relative z-10 py-4 border-b border-white/8 shrink-0
                         ${isCollapsed ? "flex justify-center px-2" : "px-4"}`}
        >
          {isCollapsed ? (
            <img
              src={session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"}
              className="w-9 h-9 rounded-xl object-cover border-2 border-green-400/30"
              alt="Avatar"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={
                    session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"
                  }
                  className="w-10 h-10 rounded-xl object-cover border-2 border-green-400/30"
                  alt="Avatar"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3
                                 bg-green-400 rounded-full border-2 border-[#0d2b1f]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {session?.user?.name}
                </p>
                <span
                  className={`inline-block mt-1 text-[0.58rem] font-semibold capitalize
                                  border px-2 py-0.5 rounded-full
                                  ${roleBadgeColor[role] || "bg-white/10 text-white/60 border-white/10"}`}
                >
                  {role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Nav links ── */}
        <nav className="relative z-10 flex-1 p-3 space-y-0.5 overflow-y-auto">
          {!isCollapsed && (
            <p
              className="text-[0.58rem] font-semibold text-white/30 uppercase
                          tracking-widest px-3 pt-1 pb-2.5"
            >
              Navigation
            </p>
          )}

          {menuLinks[role]?.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  title={isCollapsed ? link.name : undefined}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 cursor-pointer overflow-hidden
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-green-400/15 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/6"
                    }
                  `}
                >
                  {/* Active left border accent */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2
                                     w-0.75 h-[60%] bg-green-400 rounded-full"
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-colors duration-200
                    ${isActive ? "text-green-400" : "text-white/40"}`}
                  />

                  {!isCollapsed && (
                    <>
                      <span
                        className={`text-sm font-medium truncate flex-1
                        ${isActive ? "text-white" : ""}`}
                      >
                        {link.name}
                      </span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Join as Doctor */}
          {role === "user" && (
            <>
              {!isCollapsed && (
                <p
                  className="text-[0.58rem] font-semibold text-white/30 uppercase
                              tracking-widest px-3 pt-4 pb-2.5"
                >
                  Actions
                </p>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                title={isCollapsed ? "Join as Doctor" : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  bg-green-400/10 border border-green-400/20 text-green-300
                  hover:bg-green-400/18 hover:border-green-400/35
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <FaUserDoctor className="w-4.5 h-4.5 text-green-400 shrink-0" />
                {!isCollapsed && "Join as Doctor"}
              </button>
            </>
          )}
        </nav>

        {/* ── Logout ── */}
        <div className="relative z-10 p-3 border-t border-white/8 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title={isCollapsed ? "Logout" : undefined}
            className={`
              cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 text-sm
              font-medium rounded-xl transition-all duration-200
              text-white/40 hover:text-red-300 hover:bg-red-400/10
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <ArrowLeftOnRectangleIcon className="w-4.5 h-4.5 shrink-0" />
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
