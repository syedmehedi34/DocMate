// src/app/dashboard/DashboardLayout.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Stethoscope } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600">
            <Stethoscope size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Doc<span className="text-teal-600">Mate</span>
          </span>
        </div>
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-teal-100" />
          <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
          Loading dashboard…
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <Sidebar onCollapseChange={setIsCollapsed} />
      </aside>

      {/* Topbar */}
      <header
        className={`fixed top-0 z-20 transition-all duration-300 ease-in-out
                    ${isCollapsed ? "left-16" : "left-64"} right-0`}
      >
        <Topbar />
      </header>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out
                    ${isCollapsed ? "ml-16" : "ml-64"}
                    pt-16 min-h-screen flex flex-col`}
      >
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
