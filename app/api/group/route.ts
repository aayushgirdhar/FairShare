import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { options } from "../auth/[...nextauth]/options";

export const GET = async () => {
  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  const groups = await prisma.groupMember.findMany({
    where: {
      user_id: session?.user?.id,
    },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  if (!groups.length) {
    return NextResponse.json({ message: "No groups found!" }, { status: 404 });
  }
  return NextResponse.json({ groups }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(options);
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
      },
    });

    const memberPromises = users.map(async (email: string) => {
      let user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        // TODO: send invitation email
        user = await prisma.user.create({
          data: {
            name: email.split("@")[0],
            email,
            is_invited: true,
          },
        });
      }
      // after the user clicks on invitation button, they will get redirected to the register page where they only have to enter their password

      await prisma.groupMember.create({
        data: {
          group: {
            connect: { id: newGroup.id },
          },
          user: {
            connect: { id: user?.id },
          },
        },
      });
    });

    /*
      By using Promise.all, all asynchronous operations (checking user existence, sending emails, and adding users to the group) are executed concurrently. This is more efficient than executing them sequentially.
    */

    await Promise.all(memberPromises);

    return NextResponse.json(
      { message: "Group created!", group: newGroup },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
