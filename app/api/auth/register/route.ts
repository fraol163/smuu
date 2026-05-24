import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, readDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (!data.email || !data.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check existing email
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
      if (db.users.find((u: any) => u.smu_id === data.smu_id)) {
        return NextResponse.json({ error: "SMU ID already registered" }, { status: 409 });
      }

      // Auto-detect department from SMU ID
      const deptMap: Record<string, string> = {
        RCD: "Computer Science", ECD: "Computer Science",
        RMD: "Marketing", EMD: "Marketing",
        RAD: "Accounting", EAD: "Accounting",
        RTD: "Tourism", ETD: "Tourism",
        RED: "Economics", EED: "Economics",
      };
      const prefix = data.smu_id?.substring(0, 3);
      const department = deptMap[prefix] || data.department || null;

      const user = createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "student",
        is_approved: false,
        smu_id: data.smu_id,
        department,
        gpa: parseFloat(data.gpa) || 0,
        skills: Array.isArray(data.skills) ? data.skills
              : typeof data.skills === "string" ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
              : [],
        bio: data.bio || "",
        graduation_year: parseInt(data.graduation_year) || new Date().getFullYear(),
      });

      const { password: _, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
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

      const { password: _, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid registration type. Use 'student' or 'employer'." }, { status: 400 });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Server error: " + (err?.message || "unknown") }, { status: 500 });
  }
}
