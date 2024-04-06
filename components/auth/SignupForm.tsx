"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700"] });

import { toast } from "react-hot-toast";

import { useEffect, useState } from "react";
import { LoginButton } from "./LoginButton";
import { Loader } from "@/components/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Error = {
  response: {
    data: {
      error: string;
    };
  };
};

export const SignupForm = () => {
  const [type, setType] = useState("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!name || !email || !password) {
      setLoading(false);
      setError("Please fill all the fields");
      return;
    }
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(res);
      if(res.status === 201) {
        setLoading(false);
        toast.success("User created successfully");
        router.push("/auth/login");
      }
    } catch (error: any) {
      setError(error.response.data.error || error);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-row-reverse h-screen w-full justify-center items-center">
      <div className="bg-gray-600 flex-1 h-full"></div>
      <div className="right flex flex-col gap-7 h-full p-16">
        <div className="flex flex-col gap-2">
          <h1 className={`text-center font-bold text-5xl ${syne.className} `}>
            FairShare
          </h1>
          <p className="text-center text-neutral-600">Welcome Back!</p>
        </div>
        <div className="flex gap-3 justify-center mb-8">
          <LoginButton provider="google" />
          <LoginButton provider="github" />
        </div>
        <form className="flex flex-col gap-6 w-96 h-full mx-auto">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 outline-none focus:border-purple-600 shadow-sm transition-all"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 outline-none focus:border-purple-600 shadow-sm transition-all"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="w-full relative">
              <input
                className="border border-gray-300 rounded-lg p-2 outline-none w-full focus:border-purple-600 shadow-sm transition-all"
                type={type}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span
                className="absolute right-[10px] top-[8.5px] cursor-pointer p-1 hover:bg-gray-200 flex items-center justify-center rounded-lg transition-all text-gray-600"
                onClick={() => {
                  return setType((prevType) => {
                    return prevType === "password" ? "text" : "password";
                  });
                }}
              >
                {type === "password" ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </span>
            </div>
          </div>
          {error && (
            <p className="py-2 px-3 bg-red-100 text-red-500 border border-red-500 rounded-lg">
              {error}
            </p>
          )}
          <button
            className=" bg-purple-600 text-white border border-neutral-300 rounded-lg py-2 outline-none font-semibold w-full mt-auto hover:bg-purple-800 transition-all"
            onClick={handleSignup}
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>
        <p className="text-right text-neutral-600 text-sm">
          Have been here before?{" "}
          <Link href="/auth/login" className="underline">
            login
          </Link>
        </p>
      </div>
    </main>
  );
};
