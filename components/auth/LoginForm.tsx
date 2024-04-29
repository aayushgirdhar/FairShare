"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700"] });

import { useState } from "react";
import { LoginButton } from "./LoginButton";
import { Loader } from "@/components/Loader";
import { z } from "zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Error } from "@/types/ZodError";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const LoginForm = () => {
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    const validatedFields = LoginSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      setLoading(false);
      setError(validatedFields.error.flatten().fieldErrors as Error);
      return;
    }

    const { email: emailVal, password: passwordVal } = validatedFields.data;
    try {
      const res = await signIn("credentials", {
        email: emailVal,
        password: passwordVal,
        redirect: false,
      });

      if (res?.error) {
        {
          toast.error(res.error);
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-row-reverse h-screen w-full justify-center items-center">
      <div className="bg-gray-600 flex-1 h-full"></div>
      <div className="right flex flex-col gap-8 h-full p-24">
        <div className="flex flex-col gap-2">
          <h1 className={`text-center font-bold text-5xl ${syne.className} `}>
            FairShare
          </h1>
          <p className="text-center text-neutral-600">Welcome!</p>
        </div>
        <form className="flex flex-col gap-6 w-96 h-full mx-auto">
          <div className="flex flex-col gap-2">
            <input
              className={`border rounded-lg p-3 outline-none w-full focus:border-purple-600 shadow-sm transition-all ${
                error.email ? "border-red-500" : "border-gray-300"
              } `}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email Address"
              required
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full relative">
              <input
                className={`border rounded-lg p-3 outline-none w-full focus:border-purple-600 shadow-sm transition-all ${
                  error.password ? "border-red-500" : "border-gray-300"
                } `}
                type={type}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                required
              />
              <span
                className="absolute right-[10px] top-1/2 -translate-y-1/2  cursor-pointer p-1 hover:bg-gray-200 flex items-center justify-center rounded-lg transition-all text-gray-600"
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
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
          </div>
          <button
            className=" bg-purple-600 text-white border border-neutral-300 rounded-lg p-3 outline-none font-semibold w-full mt-auto hover:bg-purple-800 transition-all shadow-lg"
            onClick={handleLogin}
          >
            {loading ? <Loader /> : "Login"}
          </button>
          <p className="text-right text-neutral-600 text-sm">
            Here for the first time?{" "}
            <Link href="/auth/signup" className="underline">
              signup
            </Link>
          </p>
        </form>
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-neutral-500">
            or better continue with
          </div>
          <div className="h-[1px] bg-neutral-300 w-full"></div>
        </div>
        <div className="flex gap-3 justify-center mb-8 mt-6">
          <LoginButton provider="google" />
          <LoginButton provider="github" />
        </div>
      </div>
    </main>
    
  );
};
