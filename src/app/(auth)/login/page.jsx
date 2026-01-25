"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import Swal from "sweetalert2";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- Password visibility
  const router = useRouter();

  // Autofill credentials
  const fillCredentials = (type) => {
    switch (type) {
      case "admin":
        setEmail("admin@gmail.com");
        setPassword("adMin@123");
        break;
      case "doctor":
        setEmail("doctor@gmail.com");
        setPassword("docTor@123");
        break;
      case "user":
        setEmail("user@gmail.com");
        setPassword("useR@123");
        break;
      default:
        setEmail("");
        setPassword("");
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        await Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Redirecting to dashboard...",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        router.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left column (form) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md border-none p-8 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium"
                >
                  {showPassword ? (
                    <BiSolidHide size={22} />
                  ) : (
                    <BiSolidShow size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Autofill login buttons */}
            <div className="flex justify-between gap-2 mb-4">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 hover:scale-105 transform transition-all"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("doctor")}
                className="flex-1 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 hover:scale-105 transform transition-all"
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("user")}
                className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 hover:scale-105 transform transition-all"
              >
                User
              </button>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cursor-pointer py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:scale-105 transform"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>

      {/* Right column (image) */}
      <div className="hidden md:block md:flex-1 relative">
        <Image
          src="/login.jpg"
          alt="Login Hero"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
