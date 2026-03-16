// src/auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dbConnect from "../lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
          }).select("+password"); // password field যদি schema তে select: false থাকে

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    // ✅ Fix: authorized callback সরানো হয়েছে — middleware.js একাই handle করবে
    // দুটো জায়গায় redirect logic থাকলে conflict এবং loop হয়

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
