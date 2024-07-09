import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const POST = async (req: NextRequest, res: { params: { id: any } }) => {
  const session = getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  try {
    const { id } = res.params;
    const { users } = await req.json();

    const group = await prisma.group.findUnique({
      where: {
        id,
      },
    });

    if (!group) {
      return NextResponse.json(
        { message: "Group not found!" },
        { status: 404 }
      );
    }

    const memberPromises = users.map(async (email: string) => {
      let user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        // TODO: send invitation email

        //placeholder user
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
            connect: { id: group.id },
          },
          user: {
            connect: { id: user?.id },
          },
        },
      });
    });

    await Promise.all(memberPromises);

    return NextResponse.json(
      { message: "Users added to the group" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  res: { params: { id: any } }
) => {
  const session = getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  try {
    const { id } = res.params;
    const { userID }: { userID: string } = await req.json();

    const group = await prisma.group.findUnique({
      where: {
        id,
      },
    });
    if (!group) {
      return NextResponse.json(
        { message: "Group not found!" },
        { status: 404 }
      );
    }
    await prisma.groupMember.delete({
      where: {
        group_id_user_id: { // composite key
          group_id: id,
          user_id: userID,
        },
      },
    });
    return NextResponse.json(
      { message: "User removed from the group" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
