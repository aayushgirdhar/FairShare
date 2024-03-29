import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  try {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (rows.length) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 }
      );
    }
    const date = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (name, email, password, date) VALUES (${name}, ${email}, ${hashedPassword}, ${date})`;
    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};
