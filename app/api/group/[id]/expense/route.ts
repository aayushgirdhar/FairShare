import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/db";
import { getServerSession } from "next-auth";

export const GET = async (_: any, res: { params: { id: any } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = res.params;
    const expenses = await prisma.expense.findMany({
      where: {
        group_id: id,
      },
    });
    if (!expenses || expenses.length === 0) {
      return NextResponse.json(
        { message: "No expenses found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
