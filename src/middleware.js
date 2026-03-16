// src/middleware.js
import { auth } from "./auth";

export const runtime = "nodejs";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  // ==================== LOGGED IN USER → AUTH PAGES BLOCK ====================
  if (
    isLoggedIn &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // ==================== ADMIN ONLY ====================
  if (pathname.startsWith("/dashboard/admin")) {
    if (!isLoggedIn || userRole !== "admin") {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  // ==================== DOCTOR ONLY ====================
  if (pathname.startsWith("/dashboard/doctor")) {
    if (!isLoggedIn || userRole !== "doctor") {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  // ==================== GENERAL DASHBOARD — LOGIN REQUIRED ====================
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // ==================== PROFILE — LOGIN REQUIRED ====================
  if (pathname.startsWith("/profile") && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/profile/:path*"],
};
