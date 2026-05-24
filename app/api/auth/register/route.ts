import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, readDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (!data.email || !data.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check existing
    const existing = findUserByEmail(data.email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    if (type === "student") {
      if (!data.smu_id || !data.name) {
        return NextResponse.json({ error: "Name and SMU ID required" }, { status: 400 });
      }
      // Check SMU ID uniqueness
      const db = readDB();
      if (db.users.find((u) => u.smu_id === data.smu_id)) {
        return NextResponse.json({ error: "SMU ID already registered" }, { status: 409 });
      }
      const user = createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "student",
        is_approved: false,
        smu_id: data.smu_id,
        department: data.department || null,
        gpa: data.gpa || 0,
        skills: data.skills || [],
        bio: data.bio || "",
        graduation_year: data.graduation_year || new Date().getFullYear(),
      });
      return NextResponse.json({ success: true, user: { ...user, password: undefined } }, { status: 201 });
    }

    if (type === "employer") {
      if (!data.name || !data.company_name) {
        return NextResponse.json({ error: "Name and company name required" }, { status: 400 });
      }
      const user = createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "employer",
        is_approved: false,
        company_name: data.company_name,
        company_sector: data.company_sector || "Other",
        company_description: data.company_description || "",
        company_website: data.company_website || "",
      });
      return NextResponse.json({ success: true, user: { ...user, password: undefined } }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid registration type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
