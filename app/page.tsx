import { getServerSession } from "next-auth";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function Home() {
  const session = await getServerSession();
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
