import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { sql } from "@vercel/postgres";
import { User } from "@/types/User";

import bcrypt from "bcryptjs";

export const options = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { rows } =
            await sql`SELECT * FROM users WHERE email = ${credentials?.email};`;
          const user = rows[0];

          if (!user) {
            throw new Error("User not found!");
          }
          if (user.isOAuth) {
            throw new Error("User is registered with OAuth!");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }
          return user as User;
        } catch (err: any) {
          if (err.message === "User not found!") {
            return Promise.reject(new Error("User not found!"));
          } else if (err.message === "Incorrect password!") {
            return Promise.reject(new Error("Incorrect password!"));
          } else if (err.message === "User is registered with OAuth!") {
            return Promise.reject(new Error("User is registered with OAuth!"));
          } else {
            return Promise.reject(new Error("Unknown error occurred!"));
          }
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

      const { rows } =
        await sql`SELECT * FROM users WHERE email = ${profile.email}`;
      const user = rows[0];
      if (!user) {
        const date = new Date().toISOString();
        await sql`INSERT INTO users (name, email, image, is_oauth, date) VALUES (${
          profile.name
        }, ${profile.email}, ${
          profile.avatar_url || profile.picture
        }, true, ${date});`;
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
