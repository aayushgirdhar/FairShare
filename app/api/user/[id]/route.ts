import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { options } from "../../auth/[...nextauth]/options";

export const GET = async (_: any, res: { params: { id: any } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  const { id } = res.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found!" }, { status: 404 });
  }
  return NextResponse.json(user, { status: 200 });
};
