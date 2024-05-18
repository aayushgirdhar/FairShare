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
    if (user && !user.is_invited) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 409 }
      );
    } else if (user && user.is_invited) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          password: await bcrypt.hash(password, 10),
        },
      });
      return NextResponse.json(
        { message: "User created!", user: user },
        { status: 201 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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
