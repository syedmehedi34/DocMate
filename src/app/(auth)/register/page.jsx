"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validate = {
    name: /^[a-zA-Z. ]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = name.trim();
    if (!validate.name.test(trimmedName))
      newErrors.name = "Please enter a valid name (2-30 characters)";
    if (!validate.email.test(email))
      newErrors.email = "Please enter a valid email address";
    if (!validate.password.test(password))
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong.",
          confirmButtonColor: "#15803d",
        });
        return;
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        Swal.fire({
          icon: "warning",
          title: "Account Created!",
          text: "Registration successful, but auto-login failed. Please login manually.",
          confirmButtonColor: "#15803d",
        });
        router.push("/login");
      } else {
        await Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: "Registration & login successful! Redirecting...",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        router.replace(result.url || "/");
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

  /* ── shared input class ── */
  const inputCls = (hasError) =>
    `w-full pl-10 pr-4 py-2.5 text-sm bg-[#f8faf9] rounded-xl outline-none
     transition-all duration-200 text-gray-800 placeholder-gray-400
     ${
       hasError
         ? "border border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
         : "border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
     }`;

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ══════════ LEFT — Form ══════════ */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-6 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-700 border border-green-600/40">
              <Stethoscope size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Doc<span className="text-green-600">Mate</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              Create account ✨
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              Join DocMate and start your health journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls(!!errors.name)}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

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
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls(!!errors.email)}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls(!!errors.password)} pr-11`}
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
              {errors.password ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              ) : (
                <p className="mt-1.5 text-[0.7rem] text-gray-400">
                  Min 8 chars · uppercase · lowercase · number
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold
                          text-white rounded-xl shadow-sm transition-all duration-200 mt-2
                          ${
                            isLoading
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800 hover:shadow-md"
                          }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-green-700 hover:text-green-800 underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] text-gray-300">
            <ShieldCheck size={13} className="text-green-400" />
            Secured with end-to-end encryption
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT — Image ══════════ */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <Image
          src="/register.jpg"
          alt="Join DocMate Healthcare"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gray-950/55" />
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-green-500" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-green-400/10" />
        <div className="absolute -left-8 bottom-24 w-40 h-40 rounded-full bg-green-600/15" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo on image */}
          <div className="inline-flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/30">
              <Stethoscope size={16} color="#4ade80" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-white">
              Doc<span className="text-green-400">Mate</span>
            </span>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 bg-green-500/12 border border-green-500/25
                            rounded-full px-4 py-1.5 mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">
                Join 50,000+ Patients
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-snug drop-shadow-lg">
              Start Your
              <br />
              <span className="text-green-400">Health Journey</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm max-w-xs mx-auto leading-relaxed">
              Connect with doctors, book appointments, and manage your health
              records — all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "Free", label: "To Register" },
              { value: "1,200+", label: "Expert Doctors" },
              { value: "24/7", label: "Support" },
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
