// src/middleware.js
import { auth } from "./auth";

export const runtime = "nodejs";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role;

  console.log("Middleware running for:", nextUrl.pathname); // debug
  console.log("Is logged in?", isLoggedIn, "Role:", userRole);

  // ==================== PREVENT LOGGED IN USER FROM AUTH PAGES ====================
  if (
    isLoggedIn &&
    (nextUrl.pathname.startsWith("/login") ||
      nextUrl.pathname.startsWith("/register"))
  ) {
    const homeUrl = new URL("/", nextUrl);
    console.log(
      "Redirecting logged-in user from auth page to:",
      homeUrl.toString(),
    );
    return Response.redirect(homeUrl);
  }

  // ==================== ADMIN ONLY ====================
  if (nextUrl.pathname.startsWith("/dashboard/admin")) {
    if (!isLoggedIn || userRole !== "admin") {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  // ==================== DOCTOR ONLY ====================
  if (nextUrl.pathname.startsWith("/dashboard/doctor")) {
    if (!isLoggedIn || userRole !== "doctor") {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  // ==================== GENERAL DASHBOARD ====================
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/profile/:path*"],
};
