import User from "@/models/User";
import connectDB from "@/db/mongodb";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { name, email, password } = await req.json();
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(
      { message: "User created!", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};
