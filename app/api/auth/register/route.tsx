import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  try {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 409 }
      );
    }
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        is_oauth: false,
        date: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { message: "User created!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
