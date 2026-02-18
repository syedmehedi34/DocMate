// src/app/DashboardLayout.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <Sidebar />
      </aside>

      <header className="fixed top-0 left-64 right-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <Topbar />
      </header>

      <div className="pl-64 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
