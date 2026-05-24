import { NextRequest, NextResponse } from "next/server";
import { createApplication, hasApplied, getApplicationsByStudent, getApplicationsByJob, updateApplicationStatus } from "@/lib/db";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("student_id");
  const jobId = req.nextUrl.searchParams.get("job_id");

  if (studentId) {
    const apps = getApplicationsByStudent(parseInt(studentId));
    return NextResponse.json(apps);
  }
  if (jobId) {
    const apps = getApplicationsByJob(parseInt(jobId));
    return NextResponse.json(apps);
  }
  return NextResponse.json({ error: "student_id or job_id required" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, job_id, cover_letter, student_name, student_email,
            student_department, student_gpa, student_skills, student_bio,
            student_smu_id, job_title, company_name } = body;

    if (!student_id || !job_id) {
      return NextResponse.json({ error: "student_id and job_id required" }, { status: 400 });
    }

    if (hasApplied(student_id, job_id)) {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }

    const app = createApplication({
      student_id,
      job_id,
      cover_letter: cover_letter || "",
      status: "pending",
      created_at: new Date().toISOString(),
      student_name,
      student_email,
      student_department,
      student_gpa,
      student_skills,
      student_bio,
      student_smu_id,
      job_title,
      company_name,
    });

    return NextResponse.json({ success: true, application: app }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    updateApplicationStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
