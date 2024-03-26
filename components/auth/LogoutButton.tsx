"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button
      className="border border-gray-300 rounded-lg w-36 h-10 flex items-center justify-center gap-4 shadow-sm"
      onClick={() => signOut()}
    >
      <span className="text-gray-600 ">Logout</span>
    </button>
  );
};
