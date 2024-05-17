import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  
  try {
    const user = await prisma.user.findFirst({
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image: "",
        password: hashedPassword,
        is_oauth: false,
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
