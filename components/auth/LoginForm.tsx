"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700"] });

import { useEffect, useState } from "react";
import { LoginButton } from "./LoginButton";
import { Loader } from "@/components/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const [type, setType] = useState("password");
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

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!email || !password) {
      setLoading(false);
      setError("Please fill all the fields");
      return;
    }
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        {
          setError(res.error);
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-row h-screen w-full justify-center items-center">
      <div className="wrapper flex flex-row h-[80%] min-w-[80%] justify-center items-center gap-4 rounded-md overflow-hidden border border-gray-200 p-4 shadow-lg">
        <div className="bg-gray-600 flex-1 h-full"></div>
        <div className="right flex flex-col gap-7">
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
          <form className="flex flex-col gap-6 w-96 mx-auto">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                className="border border-gray-300 rounded-lg h-10 p-2 outline-none focus:border-purple-600 shadow-sm transition-all"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <div className="w-full relative">
                <input
                  className="border border-gray-300 rounded-lg h-10 p-2 outline-none w-full focus:border-purple-600 shadow-sm transition-all"
                  type={type}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <span
                  className="absolute right-[10px] top-[8.5px] cursor-pointer w-7 h-6 hover:bg-gray-200 flex items-center justify-center rounded-lg transition-all text-gray-600"
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
              className=" bg-purple-600 text-white border border-neutral-300 rounded-lg h-10 px-2 outline-none font-semibold mt-7 hover:bg-purple-800 transition-all"
              onClick={handleLogin}
            >
              {loading ? <Loader /> : "Login"}
            </button>
          </form>
          <p className="text-right text-neutral-600 text-sm">
            no account?{" "}
            <Link href="/auth/signup" className="underline">
              signup
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
