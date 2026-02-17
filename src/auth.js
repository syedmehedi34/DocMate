import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/../models/User";

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
          // console.log("Missing credentials");
          return null;
        }

        try {
          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
          });

          if (!user) {
            // console.log("User not found:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            // console.log("Invalid password for:", credentials.email);
            return null;
          }

          // console.log("Login success for:", user.email);

          // returning user object with role for session
          return {
            id: user._id.toString(),
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: user.role || "user", // database-এ role না থাকলে default "user"
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
