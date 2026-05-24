import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, approveUser, rejectUser } from "@/lib/db";

export async function GET() {
  const users = getAllUsers().map(({ password, ...u }) => u);
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (action === "approve") approveUser(id);
    else if (action === "reject") rejectUser(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
