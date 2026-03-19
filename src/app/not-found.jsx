import Link from "next/link";
import { ArrowLeft, Stethoscope, Home, Search } from "lucide-react";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-60" />
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-green-200/40 rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-12 h-12 bg-green-300/30 rounded-full" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo mark */}
        <div className="flex items-center gap-2.5 mb-12">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl
                          bg-green-700 border border-green-600/40"
          >
            <Stethoscope size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Doc<span className="text-green-600">Mate</span>
          </span>
        </div>

        {/* 404 big number */}
        <div className="relative mb-6">
          <p
            className="text-[9rem] sm:text-[11rem] font-black leading-none tracking-tighter
                         text-gray-100 select-none"
          >
            404
          </p>
          {/* Overlay text */}
          <p
            className="absolute inset-0 flex items-center justify-center
                         text-[9rem] sm:text-[11rem] font-black leading-none tracking-tighter
                         bg-linear-to-b from-green-700 to-green-500
                         bg-clip-text text-transparent select-none"
          >
            404
          </p>
        </div>

        {/* Divider pill */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-12 h-0.5 bg-green-200 rounded-full" />
          <span className="text-[0.65rem] font-bold text-green-600 tracking-widest uppercase">
            Page Not Found
          </span>
          <span className="w-12 h-0.5 bg-green-200 rounded-full" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-snug">
          Oops! This page
          <br />
          doesn't exist
        </h1>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-800
                       text-white text-sm font-bold px-6 py-3 rounded-xl
                       transition-colors duration-200 shadow-sm"
          >
            <Home size={15} /> Back to Home
          </Link>
          <Link
            href="/alldoctors"
            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-[#f8faf9]
                       text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl
                       border border-gray-200 hover:border-green-200
                       transition-all duration-200"
          >
            <Search size={15} /> Find a Doctor
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-gray-300 text-xs mt-10">
          Need help?{" "}
          <Link
            href="/pages/contact"
            className="text-green-600 hover:underline font-medium"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
