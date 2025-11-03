import prisma from './db';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

// For NextAuth.js integration (alternative approach)
export const authOptions = {
  providers: [
    // Configure authentication providers here
  ],
  callbacks: {
    async session({ session, token }) {
      // Add custom session properties
      return session;
    },
    async jwt({ token, user }) {
      // Add custom JWT properties
      return token;
    },
  },
};