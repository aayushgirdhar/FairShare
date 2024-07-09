import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { options } from "../../auth/[...nextauth]/options";

export const GET = async (_: any, res: { params: { id: any } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  try {
    const { id } = res.params;
    const group = await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { message: "Group not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const DELETE = async (_: any, res: { params: { id: any } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  try {
    const { id } = res.params;

    const groupToDelete = await prisma.group.findUnique({
      where: {
        id,
      },
    });
    if (!groupToDelete) {
      return NextResponse.json(
        { message: "Group not found!" },
        { status: 404 }
      );
    }
    await prisma.group.delete({
      where: {
        id: groupToDelete.id,
      },
    });
    return NextResponse.json({ message: "Group deleted!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, res: { params: { id: any } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  try {
    const { id } = res.params;
    const { name } = await req.json();

    const groupToUpdate = await prisma.group.findUnique({
      where: {
        id,
      },
    });
    if (!groupToUpdate) {
      return NextResponse.json(
        { message: "Group not found!" },
        { status: 404 }
      );
    }
    await prisma.group.update({
      where: {
        id: groupToUpdate.id,
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ message: "Group updated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
