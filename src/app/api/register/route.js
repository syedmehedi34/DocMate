// app/api/register/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb"; // path adjust করো যদি src/ এ থাকে
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Email searching lowercase + trim  (case-insensitive)
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user", // default role
    });

    // Success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
