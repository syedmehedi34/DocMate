// src/components/dashboard/Topbar.jsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-800">
          {session?.user?.role
            ? `${session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)} Dashboard`
            : "Dashboard"}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {session?.user?.name || "User"}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
