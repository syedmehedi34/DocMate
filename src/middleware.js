// middleware.js for protecting routes
export { auth as middleware } from "./auth";

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
  // add more protected routes as needed
};
