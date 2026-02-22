// src/app/DashboardLayout.jsx  (or app/(dashboard)/layout.jsx etc.)
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        <Sidebar onCollapseChange={setIsCollapsed} />
      </aside>

      {/* Topbar – now using ml like main content → smooth! */}
      <header
        className={`
    fixed top-0 z-20 bg-white border-b border-gray-200
    transition-all duration-300 ease-in-out
    ${isCollapsed ? "left-16" : "left-64"} 
    right-0
  `}
      >
        <Topbar />
      </header>

      {/* Main content – already good */}
      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isCollapsed ? "ml-16" : "ml-64"}
          pt-16 min-h-screen flex flex-col
        `}
      >
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
