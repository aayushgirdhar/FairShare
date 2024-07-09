import Link from "next/link";
import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session) {
    return <Link href="/auth/login"> Login </Link>;
  }
  return (
    <>
      <h1>Hello, {session?.user?.email}!</h1>
      <LogoutButton />
    </>
  );
}
