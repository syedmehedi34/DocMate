"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        {!isDashboard && (
          <div className="h-18">
            <Navbar />
          </div>
        )}
      </div>

      <div className="flex-1">{children}</div>

      {!isDashboard && <Footer />}
    </div>
  );
}
