import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";
import connectDB from "@/db/mongodb";

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
        await connectDB();
        try {
          const user = await User.findOne({ email: credentials?.email });

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
          return user;
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
      await connectDB();

      const user = await User.findOne({ email: profile.email });
      if (!user) {
        await User.create({
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          isOAuth: true,
        });
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
