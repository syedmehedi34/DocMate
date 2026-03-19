"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, Stethoscope, ArrowRight, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  /* ⚠️ Demo only  */
  const fillCredentials = (type) => {
    const map = {
      admin: { email: "docmate-admin@gmail.com", password: "adMin@123" },
      doctor: { email: "dr.sm-hasan@gmail.com", password: "docTor@123" },
      user: { email: "john-smith@gmail.com", password: "useR@123" },
    };
    const creds = map[type];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (!result?.error) {
        await Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Redirecting to dashboard...",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        router.replace("/");
        router.refresh();
      } else {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : (result.error ?? "Something went wrong.");
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
          confirmButtonColor: "#15803d",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#15803d",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ══════════ LEFT — Form panel ══════════ */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-6 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-8 group"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl
                            bg-green-700 border border-green-600/40"
            >
              <Stethoscope size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Doc<span className="text-green-600">Mate</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              Welcome back 👋
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl
                             outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                             text-gray-800 placeholder-gray-400 transition-all duration-200
                             disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 text-sm bg-[#f8faf9] border border-gray-200 rounded-xl
                             outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                             text-gray-800 placeholder-gray-400 transition-all duration-200
                             disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <BiSolidHide size={19} />
                  ) : (
                    <BiSolidShow size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* ⚠️ Demo quick-fill  */}
            <div>
              <p className="text-[0.62rem] text-gray-300 uppercase tracking-widest font-semibold mb-2">
                Demo accounts
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    type: "admin",
                    label: "Admin",
                    cls: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
                  },
                  {
                    type: "doctor",
                    label: "Doctor",
                    cls: "bg-green-50  text-green-700  border-green-200  hover:bg-green-100",
                  },
                  {
                    type: "user",
                    label: "User",
                    cls: "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100",
                  },
                ].map(({ type, label, cls }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => fillCredentials(type)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed ${cls}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold
                          text-white rounded-xl shadow-sm transition-all duration-200
                          ${
                            isLoading
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800 hover:shadow-md"
                          }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-green-700 hover:text-green-800 underline underline-offset-4 transition-colors"
            >
              Create account
            </Link>
          </p>

          {/* Trust badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] text-gray-300">
            <ShieldCheck size={13} className="text-green-400" />
            Secured with end-to-end encryption
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT — Image panel ══════════ */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        {/* Background image */}
        <Image
          src="/login.jpg"
          alt="DocMate Healthcare"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-950/55" />

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />

        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-green-400/10" />
        <div className="absolute -left-8 bottom-24 w-40 h-40 rounded-full bg-green-600/15" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Top — logo on image */}
          <div className="inline-flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl
                            bg-green-500/20 border border-green-400/30"
            >
              <Stethoscope size={16} color="#4ade80" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-white">
              Doc<span className="text-green-400">Mate</span>
            </span>
          </div>

          {/* Center — tagline */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 bg-green-500/12 border border-green-500/25
                            rounded-full px-4 py-1.5 mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
                Trusted Healthcare Platform
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-snug drop-shadow-lg">
              Stay Healthy,
              <br />
              <span className="text-green-400">Stay Connected</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm max-w-xs mx-auto leading-relaxed">
              DocMate — Your doctors, appointments, and health records all in
              one place.
            </p>
          </div>

          {/* Bottom — stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "1,200+", label: "Expert Doctors" },
              { value: "50k+", label: "Appointments" },
              { value: "4.9★", label: "Avg Rating" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center"
              >
                <p className="text-lg font-black text-white">{s.value}</p>
                <p className="text-[0.65rem] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
