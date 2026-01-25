"use client";

import Navbar from "./components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <div className="h-[72px]">{!isDashboard && <Navbar />}</div>
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
