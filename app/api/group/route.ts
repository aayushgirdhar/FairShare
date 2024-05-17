import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";

export const GET = async () => {
  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  const groups = await prisma.groupMember.findMany({
    where: {
      user_id: session?.user?.id,
    },
  });
  if (!groups.length) {
    return NextResponse.json({ message: "No groups found!" }, { status: 404 });
  }
  return NextResponse.json({ groups }, { status: 200 });
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  const { name, users } = await req.json();
  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        admin: {
          connect: {
            id: session?.user?.id,
          },
        },
        members: {
          create: users.map((email: string) => {
            return {
              user: {
                connect: { email },
              },
            };
          }),
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Group created!", group: newGroup },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
