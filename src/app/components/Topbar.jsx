// src/components/dashboard/Topbar.jsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  const role = session?.user?.role;
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Dashboard";

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-linear-to-b from-slate-800 to-slate-900 text-white border-b border-gray-200 shadow-sm z-30">
      <div className="text-lg font-semibold">Hello {displayRole}</div>

      <div className="flex items-center gap-6">
        <div className="text-sm  font-medium">
          {session?.user?.name || "User"}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="
            px-4 py-1.5 text-sm font-medium text-red-600 
            hover:text-red-700 hover:bg-red-50 
            rounded-md transition-all duration-200
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}
