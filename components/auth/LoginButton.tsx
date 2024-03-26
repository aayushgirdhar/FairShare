"use client";

import { signIn } from "next-auth/react";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export const LoginButton = ({ provider }: { provider: string }) => {
  return (
    <button
      className="border border-gray-300 rounded-lg w-36 h-10 flex items-center justify-center gap-4 shadow-sm"
      onClick={() => {
        signIn(provider);
      }}
    >
      {provider === "google" ? (
        <GoogleIcon fontSize="small" />
      ) : (
        <GitHubIcon fontSize="small" />
      )}
      <span className="text-gray-600 ">
        {provider === "google" ? "Google" : "GitHub"}
      </span>
    </button>
  );
};
