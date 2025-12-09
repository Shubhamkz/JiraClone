import prisma from './db';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.avatar_url = user.avatar_url;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.avatar_url = token.avatar_url;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Only handle Google OAuth
        if (account?.provider === "google") {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user for Google OAuth
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                avatar_url: profile?.picture || user.image,
                emailVerified: new Date(),
              },
            });
          } else if (profile?.picture && !existingUser.avatar_url) {
            // Update avatar if missing
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { avatar_url: profile.picture },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // If no specific redirect is set, go to dashboard
      if (url === `${baseUrl}/api/auth/signin` || url === `${baseUrl}/auth/login`) {
        return `${baseUrl}/dashboard`;
      }
      
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
  debug: false,
  trustHost: true,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}
// Mock session handling - replace with your actual auth system
let currentSession = null;

export async function loginUser(email, password) {
  try {
    // In a real app, you would verify credentials properly
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, verify password hash here
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Set session
    currentSession = { user };
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(name, email, password) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In real app, hash this password
      },
    });

    // Set session
    currentSession = { user };
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logoutUser() {
  currentSession = null;
}

