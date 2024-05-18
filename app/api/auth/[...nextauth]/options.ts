import {
  NextAuthOptions,
  SessionStrategy,
  Profile as NextAuthProfile,
} from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/db";

import bcrypt from "bcryptjs";
import { User } from "next-auth";

interface CustomProfile extends NextAuthProfile {
  avatar_url?: string;
  picture?: string;
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User> {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email as string,
            },
          });

          if (!user) {
            throw new Error("User not found!");
          }
          if (user.is_oauth) {
            throw new Error("User is registered with OAuth!");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password as string,
            user.password as string
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }
          return user as any;
        } catch (err: any) {
          throw new Error(err.message);
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      account,
      profile,
    }: {
      account: any;
      profile?: CustomProfile;
    }) {
      if (account?.provider === "credentials") {
        return true;
      }

      const exists = await prisma.user.findFirst({
        where: {
          email: profile?.email,
        },
      });

      if (!exists) {
        await prisma.user.create({
          data: {
            name: profile?.name as string,
            email: profile?.email as string,
            image: profile?.avatar_url || (profile?.picture as string),
            is_oauth: true,
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: exists.id,
          },
          data: {
            image: profile?.avatar_url || (profile?.picture as string),
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token?.uid as string;
        session.user.name = token?.name as string;
        session.user.email = token?.email as string;
        session.user.image = token?.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
};
