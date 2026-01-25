"use client";

import Navbar from "./components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <div>
        {!isDashboard && (
          <div className="h-[72px]">
            <Navbar />
          </div>
        )}
      </div>
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
