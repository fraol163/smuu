import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.is_approved) {
      return NextResponse.json({ error: "Account pending admin approval" }, { status: 403 });
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
