// src/middleware.js   (অথবা middleware.ts যদি TypeScript হয়)

import { auth } from "./auth"; // তোমার auth.js থেকে

export const runtime = "nodejs";

export { auth as middleware };

// matcher config
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // আরও protected routes যোগ করতে পারো, যেমন:
    // "/admin/:path*",
    // "/settings/:path*",
  ],
};
