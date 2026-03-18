// src/components/dashboard/Topbar.jsx
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
    <div
      className="h-16 flex items-center justify-between px-6 z-30
                 border-b border-white/8"
      style={{
        background: "linear-gradient(135deg, #0d2b1f 0%, #122d20 100%)",
      }}
    >
      {/* Left — greeting */}
      <div>
        <p className="text-[0.6rem] text-white/35 font-semibold uppercase tracking-widest">
          {displayRole} Portal
        </p>
        <p className="text-sm font-bold text-white leading-none mt-0.5">
          Welcome back,{" "}
          <span className="text-green-400">
            {session?.user?.name?.split(" ")[0] || "User"}
          </span>{" "}
          👋
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2.5">
        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9
                           rounded-xl bg-white/6 border border-white/10
                           text-white/50 hover:bg-green-400/15 hover:border-green-400/30
                           hover:text-green-400 transition-all duration-200"
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2
                           bg-green-400 rounded-full border border-[#0d2b1f]"
          />
        </button>

        {/* User pill */}
        <div
          className="flex items-center gap-2.5 bg-white/6 border border-white/10
                        rounded-xl px-3 py-1.5"
        >
          <img
            src={session?.user?.image || "https://i.ibb.co/33gs5fP/user.png"}
            alt="Avatar"
            className="w-7 h-7 rounded-lg object-cover border border-green-400/30"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="text-[0.6rem] text-white/40 capitalize mt-0.5">
              {role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                     text-white/40 hover:text-red-300 bg-white/5 hover:bg-red-400/12
                     border border-white/8 hover:border-red-400/25
                     rounded-xl transition-all duration-200"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
