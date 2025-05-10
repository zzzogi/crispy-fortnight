import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../libs/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        slug: { label: "Slug", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Check if user exists and password is correct
          if (
            !user ||
            !bcrypt.compare(credentials.password, user.password as string)
          ) {
            return null;
          }

          //check if slug == "/admin" then not allow login to admin page
          if (credentials.slug === "/admin") {
            const isAdmin = user.role === "admin" || user.role === "staff";
            if (!isAdmin) {
              return null;
            }
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as string,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token when user signs in
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role and userId to session from token
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom sign-in page
    error: "/login", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours (same as your current token)
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
