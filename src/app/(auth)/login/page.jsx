"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import Swal from "sweetalert2";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Autofill for testing/demo only — REMOVE in production for security
  const fillCredentials = (type) => {
    switch (type) {
      case "admin":
        setEmail("docmate-admin@gmail.com");
        setPassword("adMin@123");
        break;
      case "doctor":
        setEmail("dr.sm-hasan@gmail.com");
        setPassword("docTor@123");
        break;
      case "user":
        setEmail("john-smith@gmail.com");
        setPassword("useR@123");
        break;
      default:
        setEmail("");
        setPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      // console.log("signIn result:", result);

      // Success: error নেই (null/undefined)
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
      } else {
        // Fail: error আছে
        let errorMessage = "Invalid email or password";

        if (result.error === "CredentialsSignin") {
          errorMessage =
            "Invalid credentials. Please check your email and password.";
        } else if (result.error) {
          errorMessage = result.error; // অন্য কোনো custom error হলে
        }

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      // console.error("Unexpected login error:", error);
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
      {/* Optional subtle background pattern or overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row">
            {/* Left: Form - Glassmorphism card */}
            <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white/30 p-8 md:p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-10 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="mt-3 text-lg text-gray-600">
                    Sign in to continue to your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="block w-full rounded-lg border border-gray-300 pl-10 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
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
                        className="block w-full rounded-lg border border-gray-300 pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                    </div>
                  </div>

                  {/* Quick login buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => fillCredentials("admin")}
                      className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-all hover:scale-105"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials("doctor")}
                      className="rounded-lg bg-green-100 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-200 transition-all hover:scale-105"
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials("user")}
                      className="rounded-lg bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-all hover:scale-105"
                    >
                      User
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-lg py-3.5 font-semibold text-white shadow-lg transition-all ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* Right: Hero Image with overlay */}
            <div className="relative hidden md:block md:flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-500/20 mix-blend-multiply" />
              <Image
                src="/login.jpg"
                alt="DocMate Healthcare"
                fill
                className="object-cover brightness-90 contrast-110"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center px-12 text-center text-white">
                <div>
                  <h2 className="text-4xl font-bold drop-shadow-lg">
                    Stay Healthy, Stay Connected
                  </h2>
                  <p className="mt-4 text-lg drop-shadow-md">
                    DocMate — Your doctors, appointments, and health in one
                    place
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
