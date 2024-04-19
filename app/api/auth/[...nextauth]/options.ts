import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcryptjs";
import { User } from "next-auth";

export const options = {
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
    async signIn({ profile, account }: { profile: any; account: any }) {
      if (account?.provider === "credentials") {
        return true;
      }

      const user = await prisma.user.findFirst({
        where: {
          email: profile.email,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            password: "",
            image: profile.avatar_url || profile.picture,
            is_oauth: true,
            date: new Date().toISOString(),
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            image: profile.avatar_url || profile.picture,
          },
        });
      }
      return true;
    },
    async jwt({ token, user }: { user: User, token: any }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
