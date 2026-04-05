// src/app/dashboard/Topbar.jsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Dashboard";

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100">
      {/* Left — greeting */}
      <div>
        <p className="text-[0.58rem] font-bold text-slate-400 uppercase tracking-widest">
          {displayRole} Portal
        </p>
        <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">
          Welcome back,{" "}
          <span className="text-teal-600">
            {session?.user?.name?.split(" ")[0] || "User"}
          </span>{" "}
          👋
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9
                     rounded-xl bg-slate-50 border border-slate-200
                     text-slate-400 hover:bg-teal-50 hover:border-teal-200
                     hover:text-teal-600 transition-all duration-200"
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2
                           bg-teal-500 rounded-full border-2 border-white"
          />
        </button>

        {/* User pill */}
        <div
          className="flex items-center gap-2.5 bg-slate-50 border border-slate-200
                        rounded-xl px-3 py-1.5"
        >
          <img
            src={session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"}
            alt="Avatar"
            className="w-7 h-7 rounded-lg object-cover border border-slate-200"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="text-[0.58rem] text-slate-400 capitalize mt-0.5">
              {role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                     text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50
                     border border-slate-200 hover:border-rose-200
                     rounded-xl transition-all duration-200"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
