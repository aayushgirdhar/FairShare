import { SignupForm } from "@/components/auth/SignupForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return <SignupForm />;
};

export default Login;
