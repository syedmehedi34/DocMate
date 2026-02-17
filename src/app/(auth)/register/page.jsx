"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle } from "lucide-react";
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

  // Validation patterns
  const validate = {
    name: /^[a-zA-Z. ]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = name.trim();

    if (!validate.name.test(trimmedName)) {
      newErrors.name = "Please enter a valid name (2-30 characters)";
    }

    if (!validate.email.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validate.password.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

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
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      // Auto login after successful registration
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
          confirmButtonColor: "#2563eb",
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
    } catch (error) {
      // console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row">
            {/* Form side - Glassmorphism */}
            <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white/30 p-8 md:p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-10 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Create Account
                  </h1>
                  <p className="mt-3 text-lg text-gray-600">
                    Join DocMate and start your health journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        className={`block w-full rounded-lg border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        className={`block w-full rounded-lg border pl-10 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`block w-full rounded-lg border pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <BiSolidHide size={22} />
                        ) : (
                          <BiSolidShow size={22} />
                        )}
                      </button>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Must be at least 8 characters with uppercase, lowercase,
                      and a number
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-lg py-3.5 font-semibold text-white shadow-lg transition-all ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Right: Hero Image with overlay */}
            <div className="relative hidden md:block md:flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-500/20 mix-blend-multiply" />
              <Image
                src="/register.jpg" // medical-themed image রাখো (e.g. doctor with patient or health app UI)
                alt="Join DocMate Healthcare"
                fill
                className="object-cover brightness-90 contrast-110"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center px-12 text-center text-white">
                <div>
                  <h2 className="text-4xl font-bold drop-shadow-lg">
                    Start Your Health Journey
                  </h2>
                  <p className="mt-4 text-lg drop-shadow-md">
                    DocMate — Connect with doctors, book appointments, and
                    manage your health easily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
